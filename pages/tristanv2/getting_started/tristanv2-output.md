---
title: Output
keywords: python, plot, draw, read, hdf5, params, fields, spectrum, spectra, particles, payload, tracking
last_updated: Dec 31, 2020
permalink: tristanv2-output.html
folder: tristanv2
---

## Runtime diagnostics

The code outputs three types of runtime diagnostics. The regular output (in `fortran` it is written as `print *, ...`) shows the timing and particle diagnostics for each timestep (example below):

```text
-----------------------------------------------------------------------
Timestep: 6364...................................................[DONE]
[ROUTINE]          [TIME, ms]      [MIN  /  MAX, ms]      [FRACTION, %]
Full_step:            224.818     204.271    237.594
  move_step:           51.701      46.020     58.292             22.997
  deposit_step:        72.232      66.151     83.288             32.129
  filter_step:         11.442       4.631     23.036              5.089
  fld_exchange:         8.607       3.622     18.671              3.828
  prtl_exchange:       71.497      63.071     78.582             31.802
  fld_solver:           2.886       2.423      3.325              1.284
  usr_funcs:            6.448       5.630      7.452              2.868
  output_step:          0.000       0.000      0.000              0.000
[NPART per S]       [AVERAGE]      [MIN/MAX per CPU]            [TOTAL]
  species # 1       8.221E+05   7.437E+05  9.604E+05          1.579E+08
  species # 2       8.221E+05   7.421E+05  9.585E+05          1.579E+08
  species # 3           0.000       0.000      0.000              0.000
  species # 4           0.000       0.000      0.000              0.000
.......................................................................
```

The `diag.log` output can be used for debugging; it is written in the specified `output/` and shows all the functions called after their successful execution.

The `warn.log` output (also written into `output/` directory) can be used to log all the manual warnings called during the simulation. For instance, the simulation artificially suppresses cooling, or interaction probabilities that are too high. The amount of times on each timestep these "hacks" are executed is logged in the `warn.log`.

## Output

`Tristan-MP v2` outputs several files in `hdf5` and text format while running the simulation.

<table>
<colgroup>
<col width="30%" />
<col width="70%" />
</colgroup>
<tbody>

<tr>
  <td markdown="span">
    `params.*****`
  </td>
  <td markdown="span">
    Scalar variables for the simulation (timestep, etc) as well as parameters of the simulation read from the `input` file.
  </td>
</tr>

<tr>
  <td markdown="span">
    `flds.tot.*****`
  </td>
  <td markdown="span">
    Grid based field quantities as well as energy and number densities for all species.
  </td>
</tr>

<tr>
  <td markdown="span">
    `flds.tot.*****.xdmf`
  </td>
  <td markdown="span">
    Corresponding `xml` file for reading in `VisIt` or `Paraview`.
  </td>
</tr>

<tr>
  <td markdown="span">
    `prtl.tot.*****`
  </td>
  <td markdown="span">
    Particle data for all species.
  </td>
</tr>

<tr>
  <td markdown="span">
    `spec.tot.*****`
  </td>
  <td markdown="span">
    Distribution functions for all the particle species in spatial and energy bins defined in the input.
  </td>
</tr>

<tr>
  <td markdown="span">
    `domain.*****`
  </td>
  <td markdown="span">
    Information about the domain decomposition.
  </td>
</tr>

</tbody>
</table>

{% include tip.html content="The code makes sure particles saved in each output are the same (even when the specified `stride` is not `1`) to enable individual particle tracking."%}

Output can be configured from the `input` file. Following are the most up-to-date output configurations with their corresponding description.

```python
<output>

  enable        = 1              # enable/disable output [1]
  flds_enable   = 0              # field output [1]
  prtl_enable   = 0              # prtl output [1]
  spec_enable   = 1              # spectra output [1]
  params_enable = 1              # parameters output [1]
  diag_enable   = 0              # diagnostic output (domain etc) [0]

  start         = 0              # first output step [0]
  interval      = 10             # interval between output steps [10]
  stride        = 100            # particle stride [10]
  istep         = 4              # field downsampling [1]
  smooth_window = 2              # window for gaussian smoothing of the densities [2]
  flds_at_prtl  = 1              # save fields at particle position [0]
  write_xdmf    = 1              # enable XDMF file writing (to open hdf5 in VisIt) [1]
  write_nablas  = 1              # write divE & curlB [0]
  write_momenta = 1              # write average particle momenta as fields [0]
	write_npart 	= 1					 		 # write average particle weights per cell [0]

  # history output
  hst_enable    = 0              # enable/disable history output [0]
  hst_interval  = 1              # interval between history output steps [1]
  hst_readable  = 1              # enable the human readable format (less accurate) [0]

  # spectra output
  # bins are `g - 1` for massive and `e` for massless

  spec_dynamic_bins = 1          # dynamically vary max energy bin [0]

  # if dynamic bins are enabled -- these are initial min/max values
  spec_min      = 1e-3           # min energy of spectra [1e-2]
  spec_max      = 1e1            # max energy of spectra [1e2]
  spec_num      = 100            # number of energy bins [100]
  spec_log_bins = 1              # (1 = log | 0 = linear) bins in energy [1]

  spec_nx       = 10             # number of spatial spectra blocks in x [1]
  spec_ny       = 10             # number of spatial spectra blocks in y [1]
  spec_nz       = 10             # number of spatial spectra blocks in z [1]

  # radiation spectra output (if `rad` flag enabled)
  rad_spec_min  = 1e-3           # [spec_min]
  rad_spec_max  = 1e1            # [spec_max]
  rad_spec_num  = 100            # [spec_num]
```

On top of that each particle species can be enabled separately to be saved into the `prtl.tot.*****` files. For that under the `<particles>` block in the `input` file we need to specify:

```bash
<particles>
# ...
  output1       = 1               # particles of species #1 will be saved to `prtl.tot.`
# ...
  output2       = 0               # particles of species #2 will NOT be saved to `prtl.tot.`
```

{% include note.html content="When the `debug` flag is enabled fields are not interpolated for the output, and are rather saved with their original staggered positions."%}

### Parameters
Simulation parameters are saved into the `params.*****` file with the following format: `[<BLOCKNAME>:<VARNAME>] = <VALUE>` if saved in `hdf5` or `<BLOCKNAME> : <VARNAME> : <VALUE>` if saved in text format.

```python
with h5py.File('params.%05d' % 0, 'r') as param:
  print (param.keys()) # <- list all the parameters
  ppc0 = param['plasma:ppc0'][0]
  c = param['algorithm:c'][0]
  # ... etc
```

### History

To provide an additional control over the energy partition and conservation during the simulation you may enable the history output: set `hst_enable` to `1` from the `input` (in the `<output>` block). Code will print out electromagnetic and particle energies (with a specified frequency) summed over the whole domain in the following format:

```bash
=================================================================
         |                                         |
 [time]  |        [E^2]        [B^2]    [E^2+B^2]  |
         |     [% Etot]     [% Etot]     [% Etot]  |       [Etot]
         |                                         |
         |       [lecs]       [ions]   [tot part]  |    [% dEtot]
         |     [% Etot]     [% Etot]     [% Etot]  |
         |                                         |
=================================================================
```

Here `E^2` and `B^2` are the electric and magnetic field energies, `lecs` and `ions` are the energies of negatively and positively charged particles respectively, `Etot` is the total energy, `% Etot` is the fraction of the corresponding variable from the total energy, and `% dEtot` is the change of the total energy w.r.t. its initial value. File named `history` with all this information for all the timesteps (with specified interval) will be saved and updated during runtime in the output directory.

{% include note.html content="If massless particles (photons) are present in the simulation, in the `history` file instead of splitting partition of particle energy between electrons and ions, code will split it into massive and massless particles."%}

### Particle payloads

Sometimes it is necessary to carry some particle-based quantity (e.g. the work done by the parallel electric field along the particle trajectory), but saving `prtl` output at every timestep is not an option. For that we suggest the particle payloads capability, where one can specify additional variables carried by particles and updated at each timestep.

To enable this capability configure the code with the `-payload` flag. Then each particle will have 3 additional variables not used by any of the routines of the code and outputted as regular particle-based quantities in `prtl.tot.*****`. To access them, one may use the `userDriveParticles()` or `userParticleBoundaryConditions()`:

```fortran
! increment by 0.1
species(s)%prtl_tile(ti, tj, tk)%payload1(p) = species(s)%prtl_tile(ti, tj, tk)%payload1(p) + 0.1
! decrease by 0.5
species(s)%prtl_tile(ti, tj, tk)%payload2(p) = species(s)%prtl_tile(ti, tj, tk)%payload2(p) + 0.5
! increment by particle x-velocity
species(s)%prtl_tile(ti, tj, tk)%payload3(p) = species(s)%prtl_tile(ti, tj, tk)%payload3(p) +&
                                                    & species(s)%prtl_tile(ti, tj, tk)%u(p)
```

## Slices [for 3D only]

Large three dimensional simulations can be very heavy to store in the filesystem frequently. But sometimes saving just a single two dimensional cut of the 3d grid is enough. For that our code has a special `writeSlices()` routine which can save slices of field values along specified axes with specified displacements as frequently as one needs. The output directory for slice data is specified when running the simulation:

```bash
$ mpiexec ... -s [slice_dir_name]
```

All the slices are saved as `hdf5` files with the following naming format: `slice[X/Y/Z]=AAAAA.BBBBB`, where `X/Y/Z` show the direction of the slice (axis to which the slice is perpendicular), `AAAAA` is the displacement in cells, `BBBBB` is the timestamp (not the actual timestep of the simulation). For example, `sliceY=00280.00500` corresponds to `500`-th slice (i.e., corresponding timestep is `500` times the slice interval) of field quantities along `Y=280`.

Parameters for slice outputs are specified in the `input` file:

```python
<slice_output>

  enable        = 1              # only works in 3d
  start         = 0              # first slice output step
  interval      = 10             # interval between slice output steps

  # save 5 different slices of a 3d run ...
  # ... the number after the underscore is just an id of the slice
  sliceX_1      = 60
  sliceX_2      = 360
  sliceX_3      = 560

  sliceY_1      = 5
  sliceY_2      = 140

  sliceZ_1      = 100
```

## User-specified output

On top of all that we also have a user-specific output that is written as a formatted binary file by a single processor (called `usroutput`, can be found in the same directory as the regular output). This can be used to output small pre-computed (compared to particle or field array) quantities or arrays.

Enable this output from the input-file:

```python
<output>

  # user-specific output
  usr_enable    = 0          # enable/disable usr-output [0]
  usr_interval  = 100        # interval between usr-output steps [100]
```

User output is specified from the userfile with the `userOutput(step)` subroutine. This subroutine has to do all the required calculations, send all the data to the root rank and then the root rank will pass those arguments further. An example might look something like this:

```fortran
subroutine userOutput(step)
  implicit none
  ! ...
  ! 1. do calculations and save to a real-type array `myarr` ...
  ! ... or a real-type variable `myvar`
  ! 2. send all the data to the `root_rank` (typically defined as 0) ...
  ! ... which saves everything to, say, `myarr_global` and `myvar_global`
  ! 3. now pass for writing
  if (mpi_rank .eq. root_rank) then
    call writeUsrOutputTimestep(step)
    call writeUsrOutputArray('my_array_name', myarr_global)
    call writeUsrOutputReal('my_var_name', myvar_global)
    ! you may add as many of these outputs as you want
    call writeUsrOutputEnd()
  end if
end subroutine userOutput
```
