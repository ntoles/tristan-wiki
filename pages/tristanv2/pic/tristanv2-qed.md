---
title: QED Module
keywords: pic, qed, algorithm, binary, pair production, pair, photon
last_updated: Jan 25, 2020
permalink: tristanv2-qed.html
folder: tristanv2
---

{% include note.html content="This module is not available in the public version." %}

### Binary vs Monte-Carlo coupling

To simulation "two-body" processes, i.e., quantum interactions of two macro-particles, it is first crucial to invent a proper pairing routine that will loop through the particles within a given region, randomly pair them together, compute the corresponding interaction cross sections and then decide to either proceed with the interaction or not.

There are two approaches one can employ. We can either loop through all the possible pairs in a given region; in general this requires `N^2` operations, where `N` is the number of particles in that region. This approach, while being the physically "correct" one, is extremely time-consuming. On the other hand, we could pair random particles in a given region only once at a given timestep, which can be done in `O(N)` operations. In our code we implement both approaches and then compare their performance and convergence. Also keep in mind, that there are two general scenarios that may occur: particles from group `A` may be interacting with particles from group `B`, or alternatively particles from the same group may be interacting with each other. Our generic coupling routines work with both of these situations.

### MC pairing

{% include tip.html content="This section might be useful only when you are developing new QED modules, for the actual applications please see the subsequent sections." %}

In this subsection we will briefly describe the generic pairing routine that we employ in the code. This routine is written in such a way, that it can be implemented to simulate two-photon (Breit-Wheeler) pair-production, or Compton scattering, or Coulomb scatterings, or any other kind of binary interaction.

`Tristan-MP v2` is an intrinsically [multi-species](tristanv2-structure.html#species) code. In certain situations species can represent physical differences between the macro-particles (e.g., electrons, positrons, ions, photons etc), as well as conceptual differences (e.g., electrons injection to the simulation by user vs electrons produced from QED processes). Because of this the pairing routine has to be agnostic to species, and only pair the two **groups** of particles (to whatever species they belong).

In the `src/tools/binary_coupling.F90` we can find the `coupleParticlesOnTile()` subroutine which pairs two particle groups on a single [tile](tristanv2-structure.html#tiles-and-particles). Let us quickly go through the arguments this function accepts.

* `(in) ti, tj, tk` - tile indices;
* `(in) sp_arr_1, n_sp_1` - array of species for the group `A` of particles, as well as the number of **species** (not particles) in that array;
* `(in) sp_arr_2, n_sp_2` - same for the group `B` (notice, these values for `A` and `B` can be equal);
* `(out) coupled_pairs, num_couples` - returned random `couples` of pairs from groups `A` and `B`, and their number;
* `(out) num_group_1, num_group_2` - returned number of particles in each group.
* `(out) wei_1, wei_2` - returned total weight of particles in each group.

Returned `couples` are types of objects defined in the following way:

```fortran
type :: spec_ind_pair
  ! object which identifies a particle ...
  !     ... by its species and index on a given tile
  integer :: spec, index
  real    :: wei ! particle weight
end type spec_ind_pair

type :: couple
  ! object that contains two particles ...
  !     ... given by their species and index ...
  !     ... on a single tile
  type(spec_ind_pair) :: part_1
  type(spec_ind_pair) :: part_2
end type
```

So to extract from memory the (`x` coordinate of the) first particle from one of the returned couples, one would do:

```fortran
sp = couple%part_1%spec
pp = couple%part_1%index

species(sp)%tile(ti, tj, tk)%x(pp)
```
Remember, that any particle can be uniquely identified by the corresponding tile indices (`ti`, `tj`, `tk`), the species index (`s`) and its own index (`p`).

The subroutine can pair particles with arbitrary weights. For particles with weight larger than the
reference weight of 1, we split the total weight evenly among `CEILING(weight)` copies of the
particle. This improves the MC sampling for heavy particles, which can carry a large fraction of
the total group weight but would be accounted for only crudely if they are not split into
order-unity weight particles. *Note*: At this stage the particles are 'split' only in an
abstract sense to construct pairs with reduced particle weights. The actual splitting may (or may not)
occur later when particles get a chance to interact via some specific QED process.

{% include note.html content="The subroutine `coupleParticlesOnTile()` only make couples from the given particle groups, it doesn't handle the consequent physics that should be carried on these particle couples later." %}

### Breit-Wheeler pair production

#### Quick user guide

To enable the Breit-Wheeler pair production one must first add the following two flags when configuring the `Makefile`: `-qed`, `-bwpp`. In the input file this module requires several parameters to be included:

```bash
<bw_pp>

  tau_BW        = 0.01          # fiducial optical depth
  interval      = 1             # perform BW once every `interval` timestep
                                # ... this value renormalizes the cross section,
                                # ...... so no need to worry about changing the `tau_BW`
  algorithm     = 1             # 1 = BINARY; 2 = MC
  electron_sp   = 3             # save produced electrons to species #...
  positron_sp   = 4             # save produced positrons to species #...
```

Additionally we must define two species in the `<particles>` block of the input that would be treated as electrons/positrons:

```bash
  maxptl3       = 1e6           # max number of particles per core
  m3            = 1
  ch3           = -1

  maxptl4       = 1e6           # max number of particles per core
  m4            = 1
  ch4           = 1
```

And of course let's not forget about the photons themselves:

```bash
  maxptl1       = 1e6           # max number of particles per core
  m1            = 0
  ch1           = 0
  bw1           = 1

  maxptl2       = 1e6           # max number of particles per core
  m2            = 0
  ch2           = 0
  bw2           = 2
```

Notice the `bw1` and `bw2` parameters. The fact that they're different means the algorithm will be treating these as two separate groups of photons interacting with each other: photons from group `#1` interact with photons from group `#2`, but not with the photons from the same group. Alternatively we could have only one group of photons interacting with themselves:

```bash
  maxptl1       = 1e6           # max number of particles per core
  m1            = 0
  ch1           = 0
  bw1           = 1

  maxptl2       = 1e6           # max number of particles per core
  m2            = 0
  ch2           = 0
  bw2           = 1             # <-- same group now
```

... or like this (if the second photon species is unnecessary):
```bash
  maxptl1       = 1e6           # max number of particles per core
  m1            = 0
  ch1           = 0
  bw1           = 1
```

Depending on which algorithm is chosen, the routine goes through some procedure and produces electron/positron pairs respecting the computed differential cross section. The total energy and momentum (of two photons before the process, and of the pair after the process) is exactly conserved.

On the plot below we compare the two pairing methods (binary and Monte-Carlo) with the analytic model from [Aharonyan+ 1983](https://link.springer.com/article/10.1007%2FBF01005624). We initialize a periodic box with two isotropically distributed monoenergetic photon populations with energies $\varepsilon_1 = 0.1 m_e c^2$ and $\varepsilon_2 = 100 m_e c^2$.

{% include image.html file="tristan_v2/qed/mc_bin_an.png" alt="mc_bin_ad" max-width="70%"%}

#### BW with variable weights

Pair production process respects particle weights. This means that (in an ideal situation) there should be almost no difference between two-photon pair production of two macro-photons with weights `1` and `10`, and between `11` separate macro-photons. However, of course, there is no free lunch, so downsampling, as expected may reduce the sampling resolution of the photon distribution function, and, as a result, the distribution function of  produced electron-positron pairs.

Below we present an example simulation where we initialize two monoenergetic photon sources, with energies $E\sim 5 m_e c^2$, emitting two counterstreaming photon populations at a given rate. We present 3 cases with varying weights of emitted photons, the rates are adjusted accordingly. The leftmost panel in all 3 cases is the photon number density, the central panel is the density of produced pairs (which for the purposes of demonstration are frozen), and the rightmost panel is the spectrum of produced pairs.

{% include image.html file="tristan_v2/qed/mc_1.png" alt="mc1" max-width="70%" caption="Both sources emit photons with weight 1." %}

{% include image.html file="tristan_v2/qed/mc_10.png" alt="mc10" max-width="70%" caption="Both sources emit photons with weight 10." %}

{% include image.html file="tristan_v2/qed/mc_5_1.png" alt="mc51" max-width="70%" caption="Left source emits weight 5 photons, while the right one -- with weight 1." %}

### Compton scattering

#### Quick user guide

To include support for Compton scattering,
run the `Makefile` configuration script with the `-qed` and `-compton` flags.
The main functionality can be controlled with the parameters in the
`<compton>` block of the input file:
```bash
<compton>

  tau_Compton   = 0.01     # fiducial optical depth
  interval      = 1        # scatter once every `interval` timesteps
  algorithm     = 2        # 2 = MC; binary is currently not supported
  el_recoil     = 1        # enable the recoil on the electron in the scattering
  Thomson_lim   = 1e-5     # photon energy in the electron rest frame...
                           # ... below which the scattering is done in the...
                           # ... Thomson regime
```

Particles belonging to some species `1` will participate in the scattering
if their `compton1` parameter is configured:
```bash
  maxptl1       = 1e6           # max number of particles per core
  m1            = 0
  ch1           = 0
  compton1      = 1             # enable Compton scattering

```
The list of Compton-enabled species has to include at least
one electron/positron and one photon species.
Ions cannot participate in the process.

#### Implementation details

The implementation details are similar to those described in
[Del Gaudio+ 2020](https://arxiv.org/abs/2004.11404) with a few variations.
Central to the model is the calculation of an appropriately
normalized the scattering cross section for every electron-photon pair and
the random sampling of the photon scattering angle in the electron rest frame.
The differential Klein-Nishina cross section for unpolarized
photons in the electron frame reads (see, e.g.,
[Berestetskii+, Quantum Electrodynamics (Pergamon, Oxford, 1982)](https://ui.adsabs.harvard.edu/abs/1980MINTF...4.....B/abstract)):
$$
\frac{{\rm d} \sigma}{{\rm d} u} = \frac{3\sigma_{\rm T}}{8}\rho^2
\left(\rho + \frac{1}{\rho} + u^2 - 1 \right),
$$
where $u = \cos\theta'$ is the cosine of the scattering angle (i.e.,
the angle between the initial and scattered photon direction in the electron
frame),  $\sigma_{\rm T}$ is the Thomson cross section,
 and $\rho$ is the ratio of the scattered to initial photon energy
 in the (primed) electron rest frame:
\begin{align}
\rho = \frac{\epsilon_1'}{\epsilon_0'} =  \frac{1}{1 + \epsilon_0'(1- u)}.
\end{align}
Here $\epsilon_{0,1}' = \hbar\omega_{0,1}' / m_ec^2$ is the normalized energy.
The total cross section (integrated over $u$) can be written as

\begin{align}
\sigma =
\frac{3\sigma_{\rm T}}{8\epsilon_0'}\left[ \left( 1 - \frac{2}{\epsilon_0'} - \frac{2}{\epsilon_0'^2} \right)
\log\left(1 + 2\epsilon_0'\right)
+ \frac{1}{2}  + \frac{4}{\epsilon_0'} - \frac{1}{2\left(1 + 2\epsilon_0'\right)^2} \right].
\end{align}
For the random sampling of $u = \cos\theta'$ we make use of the
cumulative probability distribution similar to Del Gaudio+. The
cumulative distribuion can be expressed as
\begin{align}
{\rm CDF}(u) = c_4\left[ c_3 + \epsilon_0'u + (\epsilon_0' \rho)^2/2 + c_0\rho +
c_2\log(c_0 \rho) \right],
\end{align}
where
\begin{align}
c_0 &=  1 + 2\epsilon_0', &
c_1 &=  \epsilon_0' / c_0, &
c_2 &=  \epsilon_0'^2 - 2\epsilon_0' - 2, &\\
c_3 &=  \epsilon_0' - 1 - c_1^2/2, &
c_4 &=  \left[ 4\epsilon_0' + 2\epsilon_0'(1 + \epsilon_0')c_1^2 + c_2\log(c_0) \right]^{-1}. &
\end{align}
To obtain a random cosine $u$, we select a random number $R\in[0,1)$ and solve
iteratively (via a Newton root find) for ${\rm CDF}(u) = R$. The
coefficients $\{c_i\}$ can be computed only once per every root find.
Convergence is typically achieved in only a few iterations.
For $\epsilon_0'\ll 1$ we expand ${\rm CDF}(u)$ to 2nd
order in $\epsilon_0'$ to avoid numerical issues with evaluating the
full expresion in this regime.

The (Monte-Carlo) scattering algorithm works as follows. We first construct random
electron-photon pairs on every tile. For each pair from the list,
the photon momentum and energy are transformed into the electron (or positron)
rest frame:
\begin{align}
\epsilon_0' & =  \gamma \epsilon_0 - \boldsymbol p_0 \cdot \boldsymbol k_0,&
\boldsymbol k_0' & =  \boldsymbol k_0 + \left(\frac{\boldsymbol p_0\cdot\boldsymbol k_0}{\gamma_0 + 1} - \epsilon_0\right)\boldsymbol p_0, &
\end{align}
where $\boldsymbol p_0$ is the electron momentum and $\boldsymbol k_0$ is
the initial simulation-frame photon momentum (both in units of $m_e c$).
Once in the lab frame, the electron-photon pair is scattered with
probability
\begin{align}
    P =   \tau_{\rm T}\,\hat{\sigma} \,P_{\rm corr}\, \epsilon_0'/\epsilon_0\gamma_0  ,
\end{align}
where $\tau_{\rm T}$ is our fiducial Thomson scattering optical depth
(as measured in code units; $\Delta t = \Delta x = 1$),
$\hat \sigma = \sigma(\epsilon_0')/\sigma_{\rm T}$ is the total Klein-Nishina
cross section in the electron rest frame normalized to
$\sigma_{\rm T}$, and $P_{\rm corr}$ is a probability correction/normalization
factor that accounts for variable numbers of particles on a tile,
particle weights, etc. (see details below). The factor
$\epsilon_0'/\epsilon_0\gamma_0$
transforms the probability from the rest frame into the simulation frame.
It is worth noting that this last term not only adjusts the
total probability but also assigns a different probability to
each saparate scattering, depending on the momentum of the photon and electron.
*Note*: For a self-consistent simulation of Compton scattering *together with* BW pair production, the `tau_BW` and `tau_Compton` parameters should be actually the
same because both cross sections are normalized to $\sigma_{\rm T}$.

Once an electron-photon pair is selected for scattering, we
pick a random scattering cosine as described above, update the photon
momentum (projecting different components of $\boldsymbol k_1'$
onto an orthogonal basis) and Lorentz boost back into the simulation frame. The momentum of the scattered electron in the simulation frame
is finally obtained via momentum conservation:
$\boldsymbol p_1 = \boldsymbol p_0 + \boldsymbol k_0 - \boldsymbol k_1$

#### Normalizations

Several aspects need to be taken into account for an appropriate normalization
of probabilities: (i) the time evolution should be independent of
numerical parameters such as number of particles per cell, time step,
particle weights, and (ii) the MC pairing should match the full binary pairing. Below we describe
the normalization step by step.

First, the probability should be independent of the number of particles per cell, tile size,
and time step. This gives as a starting point:
\begin{equation}
P_{\rm corr} =  \frac{\Delta t_C / \Delta t} {n_{\rm ppc} s_x s_y s_z},
\end{equation}
where $n_{\rm ppc}$ is the number of particles per cell, $s_x$, $s_y$, $s_z$ are the tile
sizes in cell units, $\Delta t_C$ is the time step for Compton scattering, and
$\Delta t$ is the PIC loop step. By normalizing with the reference number of particles per tile,
the physical density ia effectively set with the choice of the optical depth $\tau_C$. *Note*:
If the number of particles per tile increases above the (fixed) reference value during simulation the
probabilities *do* increase accordingly.

Next, we consider the matching of probabilites with full binary pairing. In the case of MC, each
(split) particle can interact with at most one particle from the other group. In reality, all possible
interactions should be considered. To account for this, the probability needs to increase:
$$
P_{\rm corr} \rightarrow P_{\rm corr} \max(w_1, w_2),
$$
where $w_1$ and $w_2$ is the total weight of particles in group 1 and group 2, respectively.

Finally, we mention the implications of pairs with non-equal weights. Without counting particles
twice, at most $\min(n_1, n_2)$ pairs can be generated, where $n_1$ and $n_2$ are the total numbers of particles
in each group. It is important to notice that
the total weight of particles which have been paired may be significantly less
than the the total weight of both groups. Furthermore, it may not be possible to scatter the total
portion of the paired weight. If the weights in a given pair ($w_{1i}$, $w_{2j}$)
are unequal, the weight of the lighter particle needs to be
split away from the heavier one, and only the split portion is scattered (see [Haugbolle+ 2013](https://doi.org/10.1063/1.4811384),
[Del Gaudio+ 2020](https://arxiv.org/abs/2004.11404)) . To account for these
circumstances, the probability needs to be
adjusted:
$$
P_{\rm corr} \rightarrow P_{\rm corr} \frac{\min(w_1, w_2)}{\sum\limits_{\rm pairs}\min(w_{1i}, w_{2j})}.
$$
Here, the numerator represents the amount of weight that could be scattered in an ideal
situation, while the denominator is the amount that can be actually scattered. All the
probability corrections can be now combined into the final expression:
\begin{equation}
P_{\rm corr} =  \frac{\Delta t_C / \Delta t} {n_{\rm ppc} s_x s_y s_z}
\frac{w_1 w_2}{\sum\limits_{\rm pairs}\min(w_{1i}, w_{2j})},
\end{equation}

#### Tests

Using the above-described algorithm, we perform a series of common tests. This includes the
Comptonization of soft photons in a thermal electron background
([Kompaneets 1957](http://www.jetp.ac.ru/cgi-bin/e/index/e/4/5/p730?a=list)) and the
spectrum of isotropic photons scattered off a relativisic electron
([Jones 1968](https://doi.org/10.1103/PhysRev.167.1159)). The results
agree well with theory. We also perform the tests with unequal initial
electron and photon weight. This leads to the splitting of
particles. The physical results are unaffected by such choice remain in
excellent agreement with the case where all weights are 1.

{% include image.html file="tristan_v2/qed/kompaneets.png" alt="mc1" max-width="70%" caption="Kompaneets test.
At late time, the photon spectrum approaches the
theoretically expected Wien solution $\sim \epsilon_{\rm ph}^2\exp(−\epsilon_{\rm ph}/\theta_e)$,
where $\theta_e =k_{\rm B}T_e/m_ec^2$ is the (dimensionless) background temperature. Left: both electrons
and photons have weight 1. Right: electrons have initial weight 3.1 and photons 2.4." %}

{% include image.html file="tristan_v2/qed/jones.png" alt="mc1" max-width="70%" caption="Spectrum of
photons scattered of a relativistic electron. The numerical result (blue line) is compared against the
expression derived by Jones 1968, valid for $\gamma_e\gg 1$." %}
