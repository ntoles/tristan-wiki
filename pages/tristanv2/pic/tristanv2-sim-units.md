---
title: Simulation units
keywords: pic, general, units
last_updated: Nov 17, 2020
summary: "Description of the unit system used in the code."
permalink: tristanv2-sim-units.html
folder: tristanv2
---

<script>
window.MathJax = {
  tex: {
    tags: 'ams',
    packages: {'[+]': ['boldsymbol']}
  }
  loader: {load: ['[tex]/boldsymbol']}
};
</script>

In this section we discuss how to understand the `Tristan-MP v2` code units, what the input quantities actually define and how to convert physical quantities into real-life (e.g., CGS) units.

Let us take $$\Delta x$$ to be the size of the cells and $$\Delta t$$ -- the duration of the timestep. There are three fundamental dimensionless quantities defined in the `input` file:

* $$\textrm{CC}$$ (or in the code `CC`):
  * the speed of light is then defined as $$c = \textrm{CC}\Delta x/\Delta t$$;
* $$\textrm{PPC}$$ (or in the code `ppc0`):
  * assume that each macroparticle in our simulation represents $$w_0$$ real particles; then if we have $$\textrm{PPC}$$ particles per each cell, that corresponds to plasma number density of $$n_0=w_0 \textrm{PPC} \Delta x^{-3}$$;
* $$\textrm{C_OMP}$$ (or in the code `c_omp`):
  * by definition if we have plasma density of $$n_0$$, then the corresponding skin depth is $$d_e^0 = \textrm{C_OMP}\Delta x$$;

The choice of these three parameters is dictated purely by numerical requirements. $$\textrm{CC}$$ has to be $$<0.5$$ for the numerical scheme to satisfy the CFL condition, $$\textrm{PPC}$$ determines the resolution of sampling of the distribution function, and $$\textrm{C_OMP}$$ determines the spatial resolution of the main kinetic scale. This choice has no effect on actual physical scales the simulation is intended to reproduce.

## Brief recap

Essentially the following two equations provide a recipe to convert units between CGS and code quantities:

<div>$$
\begin{eqnarray}
\frac{\lvert e \rvert}{m_e} &=& \frac{\textrm{CC}^2}{\textrm{C_OMP}}\frac{\sqrt{\sigma_0}}{B_0}\frac{\Delta x}{\Delta t^2}, \\
\frac{4\pi e^2}{m_e} &=& \frac{\textrm{CC}^2}{\textrm{C_OMP}^2\cdot \textrm{PPC}}\frac{1}{w_0}\frac{\Delta x^3}{\Delta t^2}, \\
c &=& \textrm{CC}\frac{\Delta x}{\Delta t}.
\end{eqnarray}
$$</div>

Here and further we will call the dimensional and dimensionless parameters $$\Delta x$$, $$\Delta t$$ and the ones with subscripts and superscripts of $$0$$ (e.g., $$n_0$$, $$w_0$$, $$d_e^0$$) -- **fiducial**.

User provides three values in the input file: $$\textrm{CC}$$, $$\textrm{C_OMP}$$, $$\textrm{PPC}$$, that are purely computationally motivated. There are still five fiducial variables left: $$\Delta x$$, $$\Delta t$$, $$B_0$$, $$\sigma_0$$ and $$w_0$$. Typically in `Tristan` we also define $$\sigma_0$$, leaving us with three equations and four variables. If we define one of those fiducial variables in CGS units -- this will allow us to convert everything else to CGS.

### Useful relations

Formulae below apply for plasma species with density $$n_s$$, mass and charge per particle $$m_s$$ and $$q_s$$, threaded by a magnetic field $$B$$. When considering single particle, we assume its four-velocity to be $$\gamma_s\beta_s$$. Fiducial values are measured with code input parameters for some intrinsic species (it's easier to think about these species as electrons, but that can be anything). For simplicity we will measure all the masses, charges, densities and fields in these intrinsic units: $$\hat{n}_s=n_s / n_0$$, $$\hat{b} = B / B_0$$ etc. Lengthscales and timescales with a hat will be normalized to $\Delta x$ and $\Delta t$.

In our code we employ $$\Delta x = \Delta t$$ (a-priori). Here for simplicity we keep these values generic. In the code as well as here we also assume $$\lvert e\rvert \equiv m_e$$. We can do this, because all the electric and magnetic fields are present in the equations with a $$\lvert e\rvert/m_e$$ coefficient; this is equivalent to renormalizing the field quantities.

|quantity|formula|fiducial value|actual value|
|---|---|---|---|
| plasma frequency | $$\omega_{\mathrm{p}s}=\left(4\pi n_s q_s^2/m_s\right)^{1/2}$$ | $$\omega_{\textrm{p}e}^0 = \left(\textrm{CC}/\textrm{C_OMP}\right)\Delta t^{-1}$$ | $$\omega_{\textrm{p}s} = \omega_{\textrm{p}e}^0\cdot \hat{n}_s^{1/2} \lvert \hat{q}_s\rvert \hat{m}_s^{-1/2}$$ |
| plasma skin depth | $$d_{s} = c/\omega_{\mathrm{p}s}$$ | $$d_{e}^0=\textrm{C_OMP} \cdot\Delta x$$ | $$d_s = d_e^0\cdot \hat{n}_s^{-1/2} \lvert \hat{q}_s\rvert^{-1} \hat{m}_s^{1/2}$$ |
| magnetic field strength | -- | $$B_0 = \left(\textrm{CC}^2\sqrt{\sigma_0}/\textrm{C_OMP}\right)\Delta x/\Delta t^2$$ | $$B = B_0\cdot \hat{b}$$ |
| plasma magnetization | $$\sigma_s = B^2/4\pi n_s m_s c^2$$ | $$\sigma_0$$ (input parameter) | $$\sigma_s=\sigma_0 \cdot\hat{b}^2\hat{n}_s^{-1}\hat{m}_s^{-1}$$ |
| gyration frequency | $$\omega_{B}^s=\lvert q_s\rvert B/\gamma_s m_s c$$ | $$\omega_B^0 = \left(\textrm{CC}\sqrt{\sigma_0}/\textrm{C_OMP}\right)\Delta t^{-1}$$ | $$\omega_B^s = \omega_B^0 \cdot \lvert \hat{q}_s \rvert \hat{b} \gamma_s^{-1} \hat{m}_s^{-1} $$ |
| particle gyroradius | $$r_L^s = \gamma_s\beta_s m_s c^2/\lvert q_s \rvert B$$ | $$r_L^0 = \textrm{C_OMP} \cdot\sigma_0^{-1/2}\Delta x$$ | $$r_L^s = r_L^0 \cdot \gamma_s\beta_s\hat{m}_s \lvert \hat{q}_s\rvert^{-1} \hat{b}^{-1}$$  |
| strength of synchrotron cooling | $$\gamma_{\textrm{syn}} = 4\pi \lvert e\rvert\beta_{\rm rec}/\sigma_T B $$ | $$\gamma_{\textrm{syn}0}$$ (input parameter) | $$\gamma_{\textrm{syn}} = \gamma_{\textrm{syn}0}\cdot \hat{b}^{-1}$$ |
| QED optical depth over $l$ | $$\tau_s = n_s\sigma_T l $$ | $$\tau_0 = \beta_{\rm rec}/\left(\gamma_{\textrm{syn}0}^2 \sqrt{\sigma_0}\cdot\textrm{C_OMP}\right)$$ <br> (can also be an input parameter) | $$\tau_s=\tau_0\cdot \hat{n}_s\hat{l}$$ |
| QED mean free path | $$l_{\rm mfp}^s = 1/n_s\sigma_T $$ | $$l_{\rm mfp}^0 = \Delta x/\tau_0$$ | $$l_{\rm mfp}^s = l_{\rm mfp}^0\cdot \hat{n}_s^{-1}$$ |

This table is the main takeaway from this page. In the subsequent paragraphs we go into more details in how to derive them.

## Main PIC algorithm

Let us take for simplicity:

<div>$$
\begin{equation}
k_1 = \frac{\lvert e\rvert}{m_e},~~~\text{and}~~~k_2 = \frac{4\pi e^2}{m_e}.
\end{equation}
$$</div>

### Electrostatic case

Assuming $$(c / d_e^0)^2 = 4\pi n_0 e^2/m_e$$ (plasma frequency squared) we find:

<div>$$
\begin{equation}
\frac{4\pi e^2}{m_e} = k_2 = \frac{\textrm{CC}^2}{\textrm{C_OMP}^2\cdot \textrm{PPC}}\frac{1}{w_0}\frac{\Delta x^3}{\Delta t^2}.
\end{equation}
$$</div>

Consider a real astrophysical system with $$n_e\sim 10^{15}$$ electrons per cm$$^{3}$$. The plasma frequency for such system is $$\omega_{\textrm{p}e}\sim 1.8\cdot 10^{12}~\textrm{s}^{-1}$$. In code units this will be

<div>$$
\omega_{\textrm{p}e} = \left(k_2 n_0\frac{n_e}{n_0}\right)^{1/2} = \frac{\textrm{CC}}{\textrm{C_OMP}}\left(\frac{n_e}{n_0}\right)^{1/2}\Delta t^{-1}.
$$</div>

At this point we have a freedom to choose one of the parameters (either $$\Delta x$$, $$\Delta t$$ or $$w_0$$) in CGS units. We can say that $$\Delta x = 1$$ cm, which will uniquely determine both $$w_0$$ and $$\Delta t$$ (remember that the parameters $$\textrm{CC}$$, $$\textrm{C_OMP}$$, and $$\textrm{PPC}$$ are purely numerical and thus arbitrary from the physical standpoint):

<div>$$
w_0 \sim 2.8\cdot 10^{11}\frac{1}{\textrm{C_OMP}^2\cdot\textrm{PPC}},~~~\Delta t\sim 3.3\cdot10^{-11}~\textrm{s}.
$$</div>

So in the electrostatic problem we have a freedom to gauge just one of the fiducial parameters. This is simply because in electrostatics the only combination of constants we have is $$k_2 = 4\pi e^2/m_e$$, the fraction $$k_1=\lvert e\rvert/m_e$$ never enters the equations independently.

### Electromagnetic case

In electromagnetics we introduce two new fiducial numbers ($$\sigma_0$$ and $$B_0$$):

<div>$$
\begin{equation}
\sigma_0 = \frac{B_0^2/4\pi}{n_0 m_e c^2} = \frac{k_1^2}{k_2}\frac{B_0^2}{n_0 c^2}.
\end{equation}
$$</div>

Physically this dimensionless number $$\sigma_0$$ corresponds to the magnetization of cold plasma with the density $$n_0$$ threaded by a background magnetic field $$B_0$$. This $$\sigma_0$$ parameter is initialized from the input file; inside the code the name of the variable is `sigma`. We then find that

<div>$$
\begin{equation}
k_1 = \frac{\textrm{CC}^2}{\textrm{C_OMP}}\frac{\sqrt{\sigma_0}}{B_0}\frac{\Delta x}{\Delta t^2}.
\end{equation}
$$</div>

The actual magnetization parameter of some cold plasma in the simulation with density $n$ and magnetic field $B$ will be:

<div>$$
\begin{equation}
\sigma = \sigma_0\left(\frac{n}{n_0}\right)^{-1}\left(\frac{B}{B_0}\right)^{2}.
\end{equation}
$$</div>


Let's consider an example. Gyroradius of a particle with a 4-velocity of $$\gamma\beta c$$ perpendicular to the background magnetic field $$B$$ will be equal to:

<div>$$
r_L = \gamma\beta \frac{m_e c^2}{\lvert e\rvert B} = \gamma \beta \frac{c^2}{k_1 B_0} \left(\frac{B}{B_0}\right)^{-1} = \gamma\beta \cdot\textrm{C_OMP}\cdot\sigma_0^{-1/2}\left(\frac{B}{B_0}\right)^{-1}\Delta x.
$$</div>

which determines the Larmor radius in units of $$\Delta x$$ in a background magnetic field w.r.t. the fiducial $$B_0$$ field.

Assume that the actual magnetic field in the system is $$B\sim 10^3$$ G. We can easily measure that the Larmor radius of a particle with $$\gamma\beta = 1$$ will be roughly $$r_L\sim 1.7$$ cm. The choice of both $$\Delta x$$ and $$\sigma_0$$ will thus nail down the value for the fiducial field $$B_0\sim 1.7\cdot 10^3 \sqrt{\sigma_0}/\textrm{C_OMP}$$ Gauss.

### Code units

1. Measure all the spatial and temporal quantities in cell sizes and timesteps:
  * i.e. $$\Delta x = \Delta t$$.
2. Take $$k_1 \equiv 1$$, i.e. $$\lvert e\rvert = m_e$$:
  * keep in mind, that this is not a constraint, this is the normalization of our units.
3. Take $$4\pi \lvert e\rvert = \lvert \tilde{e}\rvert = \textrm{CC}^2 / \left(\textrm{PPC}\cdot\textrm{C_OMP}^2\right)$$:
  * in the code this variable is called `unit_ch`, i.e.:
  ```fortran
  unit_ch = CC**2 / (ppc0 * c_omp**2)
  ```
4. $$k_1 \equiv 1$$ instantly forces $$B_0 = \textrm{CC}^2\sqrt{\sigma_0} / \textrm{C_OMP}$$:
  * in the code this variable is called `B_norm`, i.e.:
  ```fortran
  B_norm = CC**2 * sqrt(sigma) / c_omp
  ```

{% include note.html content="In the simulation field arrays (stored as `ex, ey, ez, bx, by, bz`) values are always normalized to `B_norm` (including the currents). This means that, say, `ex(:,:,:) = 2.5` assigns `2.5 * B_norm` or $$2.5 B_0$$ everywhere in space. In the output fields are multiplied back by `B_norm`. The charges and masses for all the species (stored as `species(s)%ch_sp` etc) are normalized to $$\lvert e\rvert$$ and $$m_e$$ correspondingly." %}

### Equations of evolution

#### Particle pusher

Let us have a look at how the equations of particle motion and Maxwell's equations are written in code units. The code stores all the electromagnetic field quantities normalized to the fiducial field $$B_0$$: $$\boldsymbol{e}=\boldsymbol{E}/B_0$$, $$\boldsymbol{b}=\boldsymbol{B}/B_0$$; the charges and masses of the species are normalized to those of electron charge/mass. The equation of motion for a particle of species $$s$$ can thus be rewritten as the following (in the presence of only the Lorentz force):

<div>$$
\frac{\mathrm{d}\left(\gamma_s\boldsymbol{\beta}_s\right)}{\mathrm{d}t} = \frac{1}{c}\frac{\lvert e\rvert}{m_e}\frac{q_s/\lvert e\rvert}{m_s/m_e}B_0\left(\boldsymbol{e}+\boldsymbol{\beta}_s\times\boldsymbol{b}\right),
$$</div>

or in code terms:
<div>$$
\Delta_n\left(\gamma_s\boldsymbol{\beta}_s\right) = \frac{1}{\textrm{CC}}\frac{q_s}{m_s}B_0\left(\boldsymbol{e}+\boldsymbol{\beta}_s\times\boldsymbol{b}\right),
$$</div>

where $$\Delta_n$$ is a generic finite difference in time.

#### Current deposition

The current arrays (`jx`, `jy` and `jz`) are also normalized to $$B_0$$. Current from a particle of species $$s$$ is thus deposited as the following:

<div>$$
\begin{equation}
4\pi \boldsymbol{J}_s = 4\pi q_s \boldsymbol{\beta}_s c = 4\pi \frac{q_s}{\lvert e\rvert}\lvert e\rvert\boldsymbol{\beta}_s c,
\end{equation}
$$</div>

or in code terms
<div>$$
4\pi \boldsymbol{j}_s = 4\pi \boldsymbol{J}_s/B_0 = q_s\frac{\lvert\tilde{e}\rvert}{B_0}\boldsymbol{\beta}_s \textrm{CC}
$$</div>

#### Field solver

In CGS the two Maxwell's equations we are solving are the following:
<div>$$
\begin{eqnarray}
\frac{\partial \boldsymbol{E}}{\partial t} & = & c\nabla\times \boldsymbol{B} - 4\pi \boldsymbol{J}, \\
\frac{\partial \boldsymbol{B}}{\partial t} & = & -c\nabla\times \boldsymbol{E}.
\end{eqnarray}
$$</div>

Dividing them to $$B_0$$ and plugging the relation for $$\boldsymbol{j}_s$$ we find the equations in code terms:

<div>$$
\begin{eqnarray}
\Delta_n\boldsymbol{e} & = & \textrm{CC}\cdot\nabla\times\boldsymbol{b} - \sum q_s\frac{|\tilde{e}|}{B_0}\boldsymbol{\beta}_s \textrm{CC}, \\
\Delta_n\boldsymbol{b} & = & -\textrm{CC}\cdot \nabla\times\boldsymbol{e}.
\end{eqnarray}
$$</div>

## Radiation and QED

The radiative and QED processes, which are the integral part of this code, all rely on a single dimensional quantity -- $$r_e=e^2/m_e c^2$$ -- the classical radius of the electron (or the Thomson cross-section). In our units the value of this scale is already defined by our fiducial parameters ($$k_2/4\pi c^2$$), and it corresponds to the low energy radiation self-consistently captured by PIC method. However, for computational purposes we rescale this parameter by defining the new $$r_e^0$$ (or $$\sigma_T^0$$) fiducial scale that will capture high energy radiation and QED effects.

Depending on what physics is included one can define this scale by either specifying $$\gamma_{\textrm{syn}0}$$ or $$\tau_0$$ from the input file (more on that below).

For details on this see [the following section](tristanv2-radiation.html#synchrotron-radiation-drag). Dimensionless parameter $$\gamma_{\textrm{syn}0}$$ is defined as the Lorentz factor of a particle the force on which from the accelerating electric field of strength $$\beta_{\rm rec} B_0$$ (characteristic electric field in reconnection) is equal to synchrotron drag in the background magnetic field of strength $$B_0$$:

<div>$$
\begin{equation}
|e|\beta_{\rm rec}B_0 = 2\sigma_T^0\frac{B_0^2}{8\pi}\gamma_{\textrm{syn}0}^2,
\end{equation}
$$</div>

<!-- \gamma_{\textrm{syn}0}^2 = \frac{3}{2}\frac{\lvert e\rvert \beta_{\rm rec}}{r_e^2 B_0}, -->
where $$\beta_{\rm rec} \equiv 0.1$$ (defined in the input file). From this we establish the connection between the $$\sigma_T^0$$ and $$\gamma_{\textrm{syn}0}$$.

<!-- <div>$$
\begin{equation}
\gamma_{\textrm{syn}0}^2 = 6\pi\beta_{\rm rec} \textrm{C_OMP}^3\cdot\textrm{PPC}\frac{ w_0}{\sqrt{\sigma_0}},
\end{equation}
$$</div> -->

<!-- Notice that we don't have to introduce any other fiducial number here; in other words, both $$r_e$$ and $$\gamma_{\textrm{syn}0}$$ are just a linear combinations of $$k_1$$ and $$k_2$$. This means if we provide a numerical value for $$\gamma_{\textrm{syn}0}$$ in our simulation -- this essentially determines the numerical value for $$w_0$$, and we no longer have a freedom to choose any of the fiducial parameters in CGS ($$\Delta x$$, $$\Delta t$$, etc). -->

The equation of motion for the particle $$s$$ with (the simplified version of) the synchrotron drag will thus look like the following (provided that $$q_s=e$$ and $$m_s = m_e$$):

<div>$$
\begin{equation}
\frac{\mathrm{d}\left(\gamma_s\boldsymbol{\beta}_s\right)}{\mathrm{d}t} = -\frac{1}{c}\beta_{\rm rec}\frac{\lvert e\rvert}{m_e}\frac{B_0}{\gamma_{\textrm{syn}0}^2}\lvert\boldsymbol{\beta}_s\times\boldsymbol{b}\rvert^2\gamma_s^2\boldsymbol{\beta}_s.
\end{equation}
$$</div>

The physically important $$\gamma_{\rm syn}$$, which determines the Lorentz factor of particles the acceleration of which is balanced by the synchrotron drag in an arbitrary field, is then:

<div>$$
\begin{equation}
\gamma_{\rm syn} = \left(\frac{B}{B_0}\right)^{-1/2}\gamma_{\textrm{syn}0}.
\end{equation}
$$</div>

For QED processes considered in our code (Compton scattering, pair producation/annihilation), the easiest dimensionless number to construct is the characteristic optical depth per $$\Delta x$$ (for density $$n_0$$):

<div>$$
\begin{equation}
\tau_0 = n_0\sigma_T^0\Delta x,
\end{equation}
$$</div>

<!-- Plugging $$\sigma_T=8\pi r_e^2/3$$ and other parameters we find:

<div>$$
\begin{equation}
\tau_0^{-1} = 6\pi \cdot \textrm{C_OMP}^4\cdot \textrm{PPC}\cdot w_0,
\end{equation} -->
<!-- $$</div> -->

or for an arbitrary number density and distance:

<div>$$
\begin{equation}
\tau = \tau_0\left(\frac{n}{n_0}\right)\left(\frac{l}{\Delta x}\right).
\end{equation}
$$</div>

Notice that defining $$\gamma_{\textrm{syn}0}$$ instantly defines $$\sigma_{\rm T}^0$$ (hence $$\tau_0$$) and vice versa. Depending on the physical problem we are trying to simulate we may define one or the other. The connection between the two can easily be found to be the following:

<div>$$
\begin{equation}
\tau_0 \gamma_{\textrm{syn}0}^2 = \frac{\beta_{\rm rec}}{\sqrt{\sigma_0}\cdot\textrm{C_OMP}}.
\end{equation}
$$</div>


<!-- #### Example

Let's do a simple exercise. Suppose we have a system where we pick $$\sigma_0$$ to be $$10$$, and $$\gamma_{\textrm{syn}0}$$ to be $$1000$$. This instantly nails our $$\tau_0$$ -->

<!-- #### Goldreich-Julian density -->


<!-- ##### 1. `ppc0`: number of particles per cell, $$n_{\rm ppc}$$, which defines the effective "weight" of our macroparticles sampling the distribution function.

##### 2. `c_omp`: size of the (electron/positron) skin-depth in the number of cells.
Physically speaking, this is the skin depth, $$c/\omega_{\rm p}$$, of plasma with density $$n_{\rm ppc}$$. In CGS units the plasma frequency is

##### 3. `sigma`: magnetization, $$\sigma$$, which determines the strength of the fiducial magnetic field, $$B_{\rm norm}$$, w.r.t. the particle rest-mass energy. -->


<!-- ### Spatial/temporal units

Each simulation cell by definition has a size of $$\Delta x = \Delta y = \Delta z = 1$$ in all dimensions, and the unit time (duration of the simulation timestep) is also $$\Delta t = 1$$.

So fundamentally all spatial dimensions are measured in the number of cells, and temporal intervals are measured in the number of timesteps. The speed of light, `CC` (in code), is defined in the input file and is usually taken to be `0.45` to ensure the CFL condition is always satisfied: $$c\Delta t / \Delta x < 0.5$$.

### Electromagnetic units

We inherit the electromagnetic unit system from the older versions of `Tristan`. As the story goes, "it is best described as a hybrid between Gaussian and rationalized MKSA systems". To understand the unit system, let us consider Maxwell's equations in an arbitrary electromagnetic system of units

<div>
$$
\begin{eqnarray}
\frac{\partial \boldsymbol{E}}{\partial t} & = & \frac{c^2}{\alpha}\nabla\times \boldsymbol{B} - 4\pi k_1\boldsymbol{J}, \\
\frac{\partial \boldsymbol{B}}{\partial t} & = & -\alpha\nabla\times \boldsymbol{E}.
\end{eqnarray}
$$
</div>

In Gaussian units we take $$k_1 = 1$$ and $$\alpha = c$$ to get:

<div>$$
\begin{eqnarray}
\frac{\partial \boldsymbol{E}_G}{\partial t} & = & c\nabla\times \boldsymbol{B}_G - 4\pi \boldsymbol{J}_G, \\
\frac{\partial \boldsymbol{B}_G}{\partial t} & = & -c\nabla\times \boldsymbol{E}_G,
\end{eqnarray}
$$</div>

where the fields $$\boldsymbol{E}_G$$, $$\boldsymbol{B}_G$$ and $$\boldsymbol{J}_G$$ are in CGS units.

In `Tristan` we employ $$k_1 = 1/4\pi$$ and $$\alpha = 1$$, which gets us
<div>$$
\begin{eqnarray}
\frac{\partial \boldsymbol{E}_T}{\partial t} & = & c^2\nabla\times \boldsymbol{B}_T - \boldsymbol{J}_T, \\
\frac{\partial \boldsymbol{B}_T}{\partial t} & = & -\nabla\times \boldsymbol{E}_T,
\end{eqnarray}
$$</div>

Notice, that to convert to CGS units we must do the following:

<div>$$
\boldsymbol{E}_G = 4\pi \boldsymbol{E}_T,~~\boldsymbol{B}_G=4\pi c\boldsymbol{B}_T,~~\text{and}~~\boldsymbol{J}_G=4\pi \boldsymbol{J}_T.
$$</div>

We further renormalize these field quantities to $$\boldsymbol{e} = \boldsymbol{E}_T / cB_0$$, $$\boldsymbol{b} = \boldsymbol{B}_T / B_0$$, $$\boldsymbol{j} = \boldsymbol{J}_T / cB_0$$, where $$B_0$$ is some arbitrary field normalization. Maxwell's equations in code units then simplify to:


<div>$$
\begin{eqnarray}
\frac{\partial \boldsymbol{e}}{\partial t} & = & c \nabla\times\boldsymbol{b} - \boldsymbol{j}, \\
\frac{\partial \boldsymbol{b}}{\partial t} & = & -c\nabla \times \boldsymbol{e}.
\end{eqnarray}
$$</div>

To even further simplify things, let us define $$B_{\rm norm}=4\pi cB_0$$. Notice, that now transformation to Guassian units is trivial
<div>$$
\boldsymbol{E}_G = \boldsymbol{e}B_{\rm norm},~~\boldsymbol{B}_G = \boldsymbol{b}B_{\rm norm},~~\text{and}~~\boldsymbol{J}_G = \boldsymbol{j}B_{\rm norm}.
$$</div>

We further also assume $$\lvert e\rvert = m_e$$, so the Lorentz force becomes

<div>$$
\frac{\mathrm{d} (\gamma \boldsymbol{v})}{\mathrm{d} t} = \frac{\hat{q}}{\hat{m}} B_{\rm norm}\left(\boldsymbol{e} + \frac{\boldsymbol{v}}{c}\times \boldsymbol{b}\right),
$$</div>

where $$\hat{q}$$ and $$\hat{m}$$ are normalized to $$\lvert e\rvert$$ and $$m_e$$.

### Normalization

Three fundamental user defined quantities which determine all the relevant physical quantities (i.e., the normalization) in our simulations are the following.

##### 1. `ppc0`: number of particles per cell, $$n_{\rm ppc}$$, which defines the effective "weight" of our macroparticles sampling the distribution function.

##### 2. `c_omp`: size of the (electron/positron) skin-depth in the number of cells.
Physically speaking, this is the skin depth, $$c/\omega_{\rm p}$$, of plasma with density $$n_{\rm ppc}$$. In CGS units the plasma frequency is

<div>$$
\omega_{\rm p}^2 = 4\pi n_{\rm ppc} m_e \frac{e^2}{m_e^2}.
$$</div>

In code units (where $$\lvert e\rvert = m_e$$) this translates into $$\omega_{\rm p}^2 = n_{\rm ppc}e = n_{\rm ppc} m_e$$. From this we can find the normalization for unit charge and mass in code units:
<div>$$
\lvert e\rvert = m_e = \frac{c^2}{n_{\rm ppc} (c/\omega_{\rm p})^2}.
$$</div>
With code variables the relation above looks like this:
```fortran
m_e = unit_ch = CC**2 / (ppc0 * c_omp**2)   ! <- unit charge / unit mass
```

##### 3. `sigma`: magnetization, $$\sigma$$, which determines the strength of the fiducial magnetic field, $$B_{\rm norm}$$, w.r.t. the particle rest-mass energy.
Again, this is defined for the "cold" plasma ($$T\ll m_e c^2$$) with density $$n_{\rm ppc}$$ (in CGS):

<div>$$
\sigma = \frac{B_G^2/4\pi}{n_{\rm ppc}m_e c^2} = \frac{e^2}{m_e^2}\frac{B_G^2 (c/\omega_{\rm p})^2}{c^4}.
$$</div>

Remember, that in code units $$[B_G] = [B_{\rm norm}]$$, and $$\lvert e\rvert = m_e$$, so we get:

<div>$$
B_{\rm norm} = c^2\frac{\sqrt{\sigma}}{(c/\omega_{\rm p})}
$$</div>

In code variables:
```fortran
B_norm = CC**2 * sqrt(sigma) / c_omp  ! <- normalization of the E/B field
```


### Useful relations

##### 1. Gyroradii of particles with 3-velocity $$\beta$$ and Lorentz-factor $$\gamma$$:
<div>$$
r_L = \gamma\beta \frac{c/\omega_{\rm p}}{\sqrt{\sigma}}
$$</div>
```fortran
r_L = gamma * beta * c_omp / sqrt(sigma)
``` -->
