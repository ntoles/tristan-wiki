---
title: "Tristan-MP v2 wiki homepage"
keywords: homepage
sidebar: tristanv2_sidebar
permalink: index.html
---

## Latest on `Tristan-MP v2`

`Tristan-MP v2` is the second (arguably third) reincarnation of the most awesome astroplasma particle-in-cell code in the world written in Fortran 90. If you would like to learn more about the code structure, compilation process, or how to build a user file from scratch, feel free to read through this wiki.

{% include note.html content="If you are a new user testing the code on a new computer cluster, please consider contributing to [this chapter](https://ntoles.github.io/tristan-wiki/tristanv2-configure.html#cluster-specific-customization) about cluster-specific configuration to make the life easier for future generations."%}

_Disclaimer for the closed v2 version_. This wiki contains the most up-to-date info only for the `master` branch. Some of the new features added to the `dev/main` branch might not be documented yet. However, as soon as they are pushed to the `master` -- their documentation will immediately appear here.

<!--### Recent updates-->

<!--#### Technical updates-->
<!-- * <span class='date'>Aug 12 2019</span>[Static load balancing](tristanv2-loadbal.html#static-load-balancing)
* <span class='date'>Feb 12 2020</span>[Particle weights & downsampling](tristanv2-downsampling.html)
* <span class='date'>May 10 2020</span>[Restart](tristanv2-restart.html)
* <span class='date'>May 13 2020</span>[Parameters file](tristanv2-visualization.html#parameters)
* <span class='date'>May 14 2020</span>[History](tristanv2-visualization.html#history)
* <span class='date'>Jun 28 2020</span>[Slice outputs in 3d](tristanv2-visualization.html#slices-for-3d-only)
* <span class='date'>Jul 19 2020</span>[Cartesian particle binning](tristanv2-downsampling.html#cartesian-binning) -->
<!--* <span class='date'>Dec 31 2020</span>[Charged particle downsampling](tristanv2-downsampling.html#particle-downsampling)-->
<!--* <span class='date'>Dec 31 2020</span>[Spatial binning for spectra output](tristanv2-visualization.html#read-spectra)-->
<!--* <span class='date'>Dec 31 2020</span>[Automated testing](tristanv2-testing.html)-->
<!--* <span class='date'>Dec 31 2020</span>[Visualization functions](tristanv2-visualization.html#built-in-visualization-functions)-->
<!--* <span class='date'>Dec 31 2020</span>[Particle payloads](tristanv2-output.html#particle-payloads)-->
<!--* <span class='date'>Mar 31 2021</span>[Diagnostics and warning facility](tristanv2-output.html#runtime-diagnostics)-->

<!--#### Physics updates-->
<!-- * <span class='date'>Aug 24 2019</span>[Synchrotron radiation/cooling](tristanv2-radiation.html#synchrotron-cooling)
* <span class='date'>Dec 02 2019</span>[Inverse Compton radiation/cooling](tristanv2-radiation.html#inverse-compton-cooling)
* <span class='date'>Dec 16 2019</span>[Two-photon pair production](tristanv2-qed.html)
* <span class='date'>Mar 16 2020</span>Absorbing boundary conditions in 2D/3D
* <span class='date'>Jun 25 2020</span>[Guiding center approximation (GCA)](tristanv2-algorithms.html#guiding-center-approximation)
* <span class='date'>Jul 09 2020</span>[Compton scattering](tristanv2-qed.html#compton-scattering) -->
<!--* <span class='date'>Dec 31 2020</span>[Pair annihilation](tristanv2-qed.html#pair-annihilation)-->
<!--* <span class='date'>Dec 31 2020</span>Vay pusher-->
<!--* <span class='date'>Dec 31 2020</span>[Universal unit normalization for QED](tristanv2-sim-units.html#radiation-and-qed)-->

<!--### Under development-->


### Future plans

* $\gamma + \boldsymbol{B}$ pair production

## Releases
* v2.2 <span class='date'>__May 2021__</span>
  * Adaptive load balancing
  * Dynamic reallocation of tiles (more stable on low memory machines, slightly slower)
  * Explicit low-memory mode for clusters such as frontera (-lowmem flag)
  * User-specific output added at runtime
  * Updated the fulltest.py facility (see wiki)
  * Debug levels (0, 1, 2)
  * A facility for warnings and diagnostic output (see wiki)
  * Coupling of GCA with Vay pusher
  * Cooling limiter
  * Fluid velocity output
  * Major bugfix in the momentum output
  * Major restructuring in the initializer
  * Minor improvements, restructurings and bugfixes
* 2.1.2 <span class='date'>Mar 2021</span>
  * Dynamic reallocation of tiles
  * Coupling of GCA with Vay pusher
  * Major restructuring in the initializer
  * A facility for warnings and diagnostic output
  * Cooling limiter
  * Fluid velocity output
  * Lots of subroutines to be used in the future for the adaptive load balancing
  * Minor improvements, restructurings and bugfixes.
* 2.1.1 <span class='date'>Dec 2020</span>
  * Patched the Compton cross section normalization
  * Minor bug fixes
* 2.1 <span class='date'>Dec 2020</span>
  * Pair annihilation module (+ advanced test for all QED modules coupled)
  * Merging of charged particles
  * Particle payloads
  * Vay pusher
  * Individual particle current deposition (necessary for reflecting walls and downsampling of charged particles)
  * Spatial binning for spectra
  * Automated testing framework with `fulltest.py`
  * Major restructuring of output modules
  * Major restructuring of QED modules
  * Minor issues fixed for GCA pusher
* 2.0.1 <span class='date'>Jul 2020</span>
  * Compton scattering and GCA pusher added
  * Slice outputs for 3d added
  * Particle momentum binning improved for downsampling
  * Minor bugs fixed
