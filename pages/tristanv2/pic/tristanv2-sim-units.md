---
title: Simulation units
keywords: pic, general, units
last_updated: Dec 17, 2019
summary: "Description of the unit system used in the code."
permalink: tristanv2-sim-units.html
folder: tristanv2
---

### Spatial/temporal units

Each simulation cell by definition has a size of $\Delta x = \Delta y = \Delta z = 1$ in all dimensions, and the unit time (duration of the simulation timestep) is also $\Delta t = 1$.

So fundamentally all spatial dimensions are measured in the number of cells, and temporal intervals are measured in the number of timesteps. The speed of light, `CC` (in code), is defined on compilation time (in `src/defs.F90`) and is usually taken to be `0.45` to ensure the CFL condition is always satisfied: $c\Delta t / \Delta x < 0.5$.

### Electromagnetic units

We inherit the electromagnetic unit system from the older versions of Tristan. As the story goes, "it is best described as a hybrid between Gaussian and rationalized MKSA systems". To understand the unit system, let us consider Maxwell's equations in an arbitrary electromagnetic system of units

<div>
$$
\begin{eqnarray}
\frac{\partial \boldsymbol{E}}{\partial t} & = & \frac{c^2}{\alpha}\nabla\times \boldsymbol{B} - 4\pi k_1\boldsymbol{J}, \\
\frac{\partial \boldsymbol{B}}{\partial t} & = & -\alpha\nabla\times \boldsymbol{E}.
\end{eqnarray}
$$
</div>

We employ $k_1 = 1/4\pi$ and $\alpha = 1$, and also $\boldsymbol{e} = \boldsymbol{E} / c B_{\rm norm}$, $\boldsymbol{b} = \boldsymbol{B} / B_{\rm norm}$, $\boldsymbol{j} = \boldsymbol{J} / c B_{\rm norm}$, where $B_{\rm norm}$ is some fiducial field. Maxwell's equations in code units then become:

<div>
$$
\begin{eqnarray}
\frac{\partial \boldsymbol{e}}{\partial t} & = & c \nabla\times\boldsymbol{b} - \boldsymbol{j}, \\
\frac{\partial \boldsymbol{b}}{\partial t} & = & -c\nabla \times \boldsymbol{e}.
\end{eqnarray}
$$
</div>

We furhter assume $\|e\| = m_e$, so the Lorentz force becomes

<div>
$$
\frac{\mathrm{d} \boldsymbol{v}}{\mathrm{d} t} = \frac{\hat{q}}{\hat{m}} c B_{\rm norm}\left(\boldsymbol{e} + \frac{\boldsymbol{v}}{c}\times \boldsymbol{b}\right),
$$
</div>

where $\hat{q}$ and $\hat{m}$ are normalized to $e$ and $m_e$.

### Normalization

Three fundamental user defined quantities which determine all the relevant physical quantities (i.e., the normalization) in our simulations are the following.

##### 1. `ppc0`: number of particles per cell, $n_{\rm ppc}$, which defines the effective "weight" of our macroparticles sampling the distribution function.

##### 2. `c_omp`: size of the (electron/positron) skin-depth in the number of cells.
Physically speaking, this is the skin depth, $c/\omega{\rm p}$, of plasma with density $n_{\rm ppc}$. In code units the plasma frequency can be written as $\omega_{\rm p}^2 = n_{\rm ppc}e$. From this we can find the normalization for unit charge and mass in code units:
<div>$$
|e| = m_e = \frac{c^2}{n_{\rm ppc} (c/\omega_{\rm p})^2}.
$$</div>
With code variables the relation above looks like this:
```fortran
m_e = unit_ch = CC**2 / (ppc0 * c_omp**2)   ! <- unit charge / unit mass
```

##### 3. `sigma`: magnetization, $\sigma$, which determines the strength of the fiducial magnetic field, $B_{\rm norm}$, w.r.t. the particle rest-mass energy.
Again, this is defined for the "cold" plasma ($T\ll m_e c^2$) with density $n_{\rm ppc}$:
<div>$$
\sigma = \frac{B_{\rm norm}^2}{n_{\rm ppc} m_e c^2}~\implies~B_{\rm norm} = c^2\frac{\sqrt{\sigma}}{(c/\omega_{\rm p})}
$$</div>
In code variables:
```fortran
B_norm = CC**2 * sqrt(sigma) / c_omp  ! <- normalization of the E/B field
```

{% include note.html content="In simulation fields stored in `ex, ey, ez, bx, by, bz` allocatable variables are always normalized to `B_norm`. This means that, say, `ex(:,:,:) = 2.5` assigns `2.5 * B_norm` everywhere in space. However, in the output fields are multiplied back by `B_norm`." %}

### Useful relations

##### 1. Gyroradii of particles with 3-velocity $\beta$ and Lorentz-factor $\gamma$:
<div>$$
r_L = \gamma\beta \frac{c/\omega_{\rm p}}{\sqrt{\sigma}}
$$</div>
```fortran
r_L = gamma * beta * c_omp / sqrt(sigma)
```
