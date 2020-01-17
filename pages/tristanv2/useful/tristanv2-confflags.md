---
title: Supported configuration flags
keywords: compile, flag, configure
last_updated: Dec 17, 2019
permalink: tristanv2-confflags.html
folder: tristanv2
---

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
    `-ifport`
  </td>
  <td markdown="span">
    Enable `use ifport` or not. This handles `mkdir` commands, some systems do not support this.
  </td>
</tr>
<tr>
  <td markdown="span">
    `-debug`
  </td>
  <td markdown="span">
    Enable debug mode (enables custom `-DDEBUG` macros flag, `traceback`, `qopt` reports for intel compilers etc).
  </td>
</tr>

<tr class="header">
  <th colspan="2">Domain specifications</th>
</tr>
<tr>
  <td markdown="span">
    `-3d`
  </td>
  <td markdown="span">
    Enable 3D (enables custom `-DthreeD` macros flag).
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
    Enable the Breit-Wheeler pair production.
  </td>
</tr>


</tbody>
</table>
