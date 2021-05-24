---
title: Supported configuration flags
keywords: compile, flag, configure
last_updated: May 24, 2021
permalink: tristanv2-confflags.html
folder: tristanv2
---

To configure the code and generate a `Makefile` run the following in the root directory: `python configure.py [FLAGS]`. Following is a list of all the currently supported flags:

<table>
<colgroup>
<col width="30%" />
<col width="70%" />
</colgroup>
<thead>
<tr class="header">
<th>Flag</th>
<th>Description</th>
</tr>
</thead>
<tbody>


<tr class="header">
  <th colspan="2">Compiler specifications</th>
</tr>
<tr>
  <td markdown="span">
    `-intel`
  </td>
  <td markdown="span">
    Compile with intel compatibility.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-mpi` or `-mpi08`
  </td>
  <td markdown="span">
    Use default MPI or MPI_08.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-hdf5`
  </td>
  <td markdown="span">
    Enable `hdf5` and compile with `h5fpc`. Currently the only output option is `hdf5`.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-serial`
  </td>
  <td markdown="span">
    Enable serial `hdf5` output (instead of parallel), this might help in some older filesystems.
  </td>
</tr>

<tr>
  <td markdown="span">
    `-ifport`
  </td>
  <td markdown="span">
    Enable `use ifport` or not. This handles `mkdir` commands, some systems do not support this.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-avx2`/`-avx512`
  </td>
  <td markdown="span">
    Enable avx2 or avx512 vectorization regimes.
  </td>
</tr>

<tr>
  <td markdown="span">
    `--debug=<LEVEL>`
  </td>
  <td markdown="span">
    Enable debug mode and specify the debug level [0, 1, 2] (also enables custom `-DDEBUG` macros flag, `traceback`, `qopt` reports for intel compilers etc).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-lowmem`
  </td>
  <td markdown="span">
    Enable full dynamic allocation of tiles (tiles can be allocated by arbitrary amount). Useful for low memory machines.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-usroutput`
  </td>
  <td markdown="span">
    Enable the user-specified output written into `<OUTPUT_DIR>/usroutput` (also enabled the `-DUSROUTPUT` flag).
  </td>
</tr>

<tr class="header">
  <th colspan="2">Domain specifications</th>
</tr>
<tr>
  <td markdown="span">
    `-1d`/`-2d`/`-3d`
  </td>
  <td markdown="span">
    Specify the dimension of the simulation (enables one of the `-DoneD`/`DtwoD`/`-DthreeD` macros flags).
  </td>
</tr>
<tr>
  <td markdown="span">
    `--nghosts=[NUM_GHOSTS]`
  </td>
  <td markdown="span">
    Specify the number of ghost zones, will compile with `-DNGHOST=[NUM_GHOSTS]` (if unspecified, defaults to `3` ghost cells).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-alb`, `-slb`
  </td>
  <td markdown="span">
    Enable the adaptive and/or static load balancing.
  </td>
</tr>

<tr class="header">
  <th colspan="2">Physical specifications</th>
</tr>
<tr>
  <td markdown="span">
    `--user=[USER_FILE]`
  </td>
  <td markdown="span">
    Name of the user file from the `user/` directory (without the extension).
  </td>
</tr>
<tr>
  <td markdown="span">
    `--unit=[UNIT_FILE]`
  </td>
  <td markdown="span">
    Name of the unit file (for debugging) from the `unit/` directory (without the extension).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-vay`
  </td>
  <td markdown="span">
    Enable Vay pusher.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-absorb`
  </td>
  <td markdown="span">
    Enable absorbing boundary conditions (enables custom `-DABSORB` macros flag).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-extfields`
  </td>
  <td markdown="span">
    Enable user specified stationary external fields in the mover.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-dwn`
  </td>
  <td markdown="span">
    Enable particle downsampling.
  </td>
</tr>

<tr class="header">
  <th colspan="2">Extra physics</th>
</tr>
<tr>
  <td markdown="span">
    `--radiation=[MECHANISM]`
  </td>
  <td markdown="span">
    Enable radiation reaction with the specified `MECHANISM`. Currently supports `sync` for synchrotron and `ic` for inverse Compton radiation. To enable both do `--radiation=sync+ic`.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-emit`
  </td>
  <td markdown="span">
    Enable photon emission from radiation. Will not work unless `--radiation` is enabled.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-qed`
  </td>
  <td markdown="span">
    Enable the QED substep in the main loop.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-bwpp`
  </td>
  <td markdown="span">
    Enable the Breit-Wheeler pair production (requires `-qed` enabled).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-compton`
  </td>
  <td markdown="span">
    Enable Compton scattering (requires `-qed` enabled).
  </td>
</tr>
<tr>
  <td markdown="span">
    `-annihilation`
  </td>
  <td markdown="span">
    Enable pair annihilation (requires `-qed` enabled).
  </td>
</tr>
<tr>
  <td markdown="span">
    `--gca=<N_ITER>`
  </td>
  <td markdown="span">
    Enable GCA (guiding center approximation) mover and set number of iterations (2-4 is usually enough).
  </td>
</tr>


<tr class="header">
  <th colspan="2">Cluster specific shortcuts</th>
</tr>
<tr>
  <td markdown="span">
    `--cluster=<CLUSTER>`
  </td>
  <td markdown="span">
    Configures the code specific to the cluster. Current options are: `stellar`, `perseus` and `frontera`.
  </td>
</tr>


</tbody>
</table>
