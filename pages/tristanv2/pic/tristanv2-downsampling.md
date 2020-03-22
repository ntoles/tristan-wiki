---
title: Particle downsampling
keywords: merging, downsampling, particle, weight
last_updated: Feb 18, 2020
permalink: tristanv2-downsampling.html
folder: tristanv2
---

### Weights

In `Tristan-MP v2` particles, along with other parameters like coordinates and momenta, have weights. This quantity is stored similarly on a tile `tile%weight(p)` (it has a type of `real`). Likewise the weight can be passed to particle injection functions:

```fortran
call injectParticleGlobally(s, x, y, z, u, v, w, weight = 123.0)
! or
call createParticle(s, xi, yi, zi, dx, dy, dz, u, v, w, weight = 123.0)
```

Notice that the weight, `123.0`, is in the form of a floating point number. If the weight is not passed, by default a particle with weight of `1.0` is created.

Particle weights are taken into account when computing the densities and energy densities saved into the `flds.tot.*****` files. Weights are also saved as particle quantities, and can then be accessed from `prtl.tot.*****`:

```python
step = 137  # specify the step
filename = 'prtl.tot.%05i' % step
particles = isolde.getParticles(filename)
weights = particles['1']['wei'] # <- weights are saved into `wei` hdf5 database
```

Both [pair production routines](tristanv2-qed.html#binary-vs-monte-carlo-coupling) (Monte-Carlo and binary) respect particle weights, and adjust accordingly, i.e. two photons with weights `10.7` and `1.2` will pair-produce as if there were `11` particles in total. Photons with weights less than `1` do not participate in pair production. For this reason it is a good idea to make sure there are few photons below `1` in the simulation. 

### Particle downsampling

We provide a particle downsampling (or merging) routine performed on every tile. We employ a variation of the algorithm described by [Vranic + (2015)](https://www.sciencedirect.com/science/article/pii/S0010465515000405?via%3Dihub) where multiple particles in the same momentum bin are being merged into two, conserving both energy and momentum components. Our momentum binning is logarithmic (log-normal) in energy and uniform in two spherical angles, similar to the method described for the [`Smilei` code](http://www.maisondelasimulation.fr/smilei/particle_merging.html#solid-angle-correction-in-3d).

For species to be considered for downsampling one has to specify that explicitly in the `input` file:

```bash
<particles>

  # ...
  dwn3          = 1             # enable/disable particle downsampling
```

The downsampling parameters, also specified in the `input`, are the following:

```bash
<downsampling>

  # particle downsampling (merging) parameters
  interval      = 10
  start         = 1             # starting timestep
  max_weight    = 100           # maximum weight of merging particles
  angular_bins  = 5             # number of angular bins (theta/phi)
  energy_bins   = 5             # number of log energy bins
  energy_min    = 1e-1          # min energy of merged particle
  energy_max    = 1e1           # max energy of merged particle
```

{% include image.html file="tristan_v2/downsampling/binning.png" max-width="40%" alt="bins"%}

On the image above there are 100000 particles with equal energies scattered in the 3d phase space. Here we highlight groups of particles in the corresponding momentum bins with separate colors. At each timestep on every tile we also randomly rotate our momentum bins in 3d phase space, so that the two polar bins are not necessarily in $\pm z$ direction. The resulting merged population (in the same phase space) looks like the following:

{% include image.html file="tristan_v2/downsampling/merged.png" max-width="70%" alt="merged"%}

While now there are about 50 times less macro-particles (compare left and right panels), sum of all weights, energies and momentum components are precisely conserved.

{% include note.html content="When specifying `angular_bins = 5` there will actually be `5 + 2 = 7` bins in $\theta\in \left\[-\pi/2, \pi/2\right\]$ (with 2 additional polar bins), and `10` bins in $\phi \in \left\[0, 2\pi\right\]$."%}

Downsampling may significantly reduce the memory usage and computation time depending on a given setup, and it is currently possible for both massive and massless particles. However, be careful when using this routine for **charged** particles, as some undeposited current may be left behind that can accumulate over time and cause non-physical effects on sufficiently long timescales.
