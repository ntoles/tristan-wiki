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

Returned `couples` are types of objects defined in the following way:

```fortran
type :: spec_ind_pair
  ! object which identifies a particle ...
  !     ... by its species and index on a given tile
  integer :: spec, index
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

{% include note.html content="The subroutine `coupleParticlesOnTile()` only make couples from the given particle groups, it doesn't handle the consequent physics that should be carried on these particle couples later." %}

### Breit-Wheeler pair production

To enable the Breit-Wheeler pair production one must first add the following two flags when configuring the `Makefile`: `-qed`, `-bwpp`. In the input file this module requires several parameters to be included:

```bash
<bw_pp>

  tau_BW        = 0.01          # fiducial Breit-Wheeler cross section
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

#### Weights

Pair production process respects particle weights. This means that (in an ideal situation) there should be almost no difference between two-photon pair production of two macro-photons with weights `1` and `10`, and between `11` separate macro-photons. However, of course, there is no free lunch, so downsampling, as expected may reduce the sampling resolution of the photon distribution function, and, as a result, the distribution function of  produced electron-positron pairs.

Below we present an example simulation where we initialize two monoenergetic photon sources, with energies $E\sim 5 m_e c^2$, emitting two counterstreaming photon populations at a given rate. We present 3 cases with varying weights of emitted photons, the rates are adjusted accordingly. The leftmost panel in all 3 cases is the photon number density, the central panel is the density of produced pairs (which for the purposes of demonstration are frozen), and the rightmost panel is the spectrum of produced pairs.

{% include image.html file="tristan_v2/qed/mc_1.png" alt="mc1" max-width="70%" caption="Both sources emit photons with weight 1." %}

{% include image.html file="tristan_v2/qed/mc_10.png" alt="mc10" max-width="70%" caption="Both sources emit photons with weight 10." %}

{% include image.html file="tristan_v2/qed/mc_5_1.png" alt="mc51" max-width="70%" caption="Left source emits weight 5 photons, while the right one -- with weight 1." %}
