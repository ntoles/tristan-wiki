---
title: Output & visualization
keywords: visualization, python, plot, draw, read, hdf5, params, fields, spectrum, spectra, particles
last_updated: Jan 17, 2020
permalink: tristanv2-visualization.html
folder: tristanv2
---

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
    Corresponding `xml` file for reading in `VisIt`.
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
    Distribution functions for all species over the whole simulation box.
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

  enable        = 1              # enable/disable output [defaults to TRUE]
  start         = 0              # first output step
  interval      = 10             # interval between output steps
  stride        = 100            # particle stride
  istep         = 4              # field downsampling
  flds_at_prtl  = 1              # save fields at particle position
  write_xdmf    = 1              # enable XDMF file writing (to open hdf5 in VisIt)

  hst_enable    = 0
  hst_interval  = 1
  hst_readable  = 1              # human readable format for numbers in the history ...
                                 # .. (can be less accurate sometimes)

  spec_min      = 1e-3           # `g - 1` for massive and `e` for massless
  spec_max      = 1e1            # `g - 1` for massive and `e` for massless
  spec_num      = 100            # number of energy bins
```

On top of that each particle species can be enabled separately to be saved into the `prtl.tot.*****` files. For that under the `<particles>` block in the `input` file we need to specify:

```bash
<particles>
# ...
  output1       = 1               # particles of species #1 will be saved to `prtl.tot.`
# ...
  output2       = 0               # particles of species #2 will NOT be saved to `prtl.tot.`
```

{% include note.html content="When the `debug` flag is enabled fields are not interpolated for the output, and are rather saved with their original staggered positions. The densities are also not convolved with the gaussial filter in the `debug` regime."%}

### Parameters
Simulation parameters are saved into the `params.*****` file with the following format: `[<BLOCKNAME>:<VARNAME>] = <VALUE>` if saved in `hdf5` or `<BLOCKNAME> : <VARNAME> : <VALUE>` if saved in text format. The `<BLOCKNAME>` will be shortened to 3 symbols for simplicity, so to find, say, the # of cpus in x direction from `params.*****` file you can simply read of the `[cpu:sizex]` variable, speed of light will be `[alg:c]` and `ppc0` -- `[pls:ppc0]`.

```python
with h5py.File('params.%05d' % 0, 'r') as param:
  print (param.keys()) # <- list all the parameters
  ppc0 = param['pls:ppc0'][0]
  c = param['alg:c'][0]
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

Here `E^2` and `B^2` are the electric and magnetic energies, `lecs` and `ions` are the energies of negatively and positively charged particles respectively, `Etot` is the total energy, `% Etot` is the fraction of the corresponding variable from the total energy, and `% dEtot` is the change of the total energy w.r.t. its initial value.

File named `history` with all this information for all the timesteps (with specified interval) will be saved and updated during runtime in the output directory.

{% include note.html content="If massless particles (photons) are present in the simulation, in the `history` file instead of splitting partition of particle energy between electrons and ions, code will split it into massive and massless particles."%}

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

## Visualization

At the moment there are two ways to visualize the output data.

### `VisIt` app

If `hdf5` flag is enabled during the execution, along with the field quantities the code will also output the `.xdmf` files. These are basically `xml` formatted files that contain the detailed description of the data structure in the `flds.tot.*****` (see details [here](http://www.xdmf.org/index.php/Main_Page)). This is necessary for the `VisIt` visualization app to recognize the `hdf`-files and be able to read them. `VisIt` is probably the fastest way to visualize three dimensional field quantities. You can enable/disable the output of these auxiliary files from the `input` file:

```bash
<output>
  # ...
  write_xdmf    = 1              # enable XDMF file writing (to open hdf5 in VisIt)
  # ...
```

### `python` module

As every Tristan in legends and stories come with his Iseult, our `Tristan` also has it's own `isolde` which is a data reading and visualization package for `python`.

The usage is fairly simple. We will first need to place the `isolde.py` in the same location as our python script (it could be a `.py` file or a Jupyter notebook), and the import it by doing

```python
import isolde
```

{% include note.html content="Alternatively, one can append `sys` with the directory where `isolde.py` is located -- `import sys` and `sys.path.append(0, '/path/to/isolde.py')` -- and then `import isolde` without having to move the file."%}

##### Read particles
```python
step = 137  # specify the step
filename = 'prtl.tot.%05i'%step
particles = isolde.getParticles(filename)
```

`particles` is now a nested dictionary containing all the particle species and their relevant saved quantities:

```python
electrons = particles['1']    # take all the electrons
electrons_x = electrons['x']  # take all the x-positions of the electrons
print (electrons.keys())      # enumerate all the saved quantities
```

##### Read fields
```python
step = 137  # specify the step
filename = 'flds.tot.%05d'%step
fields = isolde.getFields(filename)
```
`fields` is now a dictionary of three dimensional arrays with all the relevant fields saved. By default they are:

```python
print (fields.keys())
# ['xx', 'yy', 'zz', 'ex', 'ey', 'ez', 'bx', 'by', 'bz', 'jx', 'jy', 'jz', 'dens1', 'dens2', ...]
# 3d grid points, ...
# ... electric field components, ...
# ... magnetic field components, ...
# ... current density components and ...
# ... the densities of all the species
```

`fields['xx']`, if you are familiar with `numpy` terminology is the meshgrid -- all the corresponding `x` coordinates of the domain in a 3d array.

##### Read spectra
The following is to read the distribution functions for all the species and particles in the simulation box.

```python
step = 137  # specify the step
filename = 'spec.tot.%05d'%step
spectra = isolde.getSpectra(filename)
```

`spectra` is now a nested dictionary with all the species. We can access the particular species:

```python
electron_spectrum = spectra['1'] # choosing only electrons
bins = electron_spectrum['bn']   # energy bins (for massive particles it's `gamma-1`, for massless - `e`)
cnts = electron_spectrum['cnt']  # number of particles in a particular bin
```

##### Read domain distribution

`Tristan` also saves the domain distribution data, i.e., how the simulation box is subdivided between the MPI processes.

```python
step = 137  # specify the step
filename = 'domain.%05d'%step
domains = isolde.getDomains(filename)
```

Now `domains` will contain a dictionary with the sizes (`sx`, `sy`, `sz`) and the coordinates of the "left bottom" corners of the MPI domains (`x0`, `y0`, `z0`).

##### Parse the `report` file

The `report` file contains crucial information about the performance capabilities of your run, including the data on how long each of the loop substeps take, how different are the loads on each MPI process and how many particles of each species do we host on each core. To make life easier, `isolde` provides a very useful function to parse this `report` file and save all the interesting quantities to a dictionary.

```python
interval = 10       # parse every 10-th step
num_steps = 100500  # how many steps to parse
filename = 'report' # specify the location of the `report` file
report = isolde.parseReport(filename, nsteps = num_steps, skip = interval)
```

`report` is now a dictionary with the following keys:

```python
print (report.keys())
# ['t', 'Full_step', 'move_step', 'deposit_step', ..., 'output_step', 'nprt 1 [core]', 'nprt 2 [core]', ...]
# 't' - timestep
# 'Full_step' - duration of the whole step
# 'nprt 1 [core]' - average number of particles per core of the species 1
```

For each of these step/substep durations we can find the mean duration `dt`, and the `min` and `max` durations among the MPI processes to estimate the possible load imbalance.

***

##### Built-in visualization functions
To make life even easier, we kindly provide a few helpful `python` functions to assist in 2d plotting. All these functions accept standard `matplotlib`'s subplot instance as well as the data read from the relevant files.

```python
import matplotlib.pyplot as plt
fig = plt.figure(figsize=(10,10))
ax = plt.subplot()
```

Then we can do the plotting with the pre-read data. For the field data we can do:

```python
xx = fields['xx'][0,:,:] # cut along z=0
yy = fields['yy'][0,:,:]
dens = (fields['dens1'] + fields['dens2'])[0,:,:]
isolde.plot2DField(ax, xx, yy, dens) # plot two dimensional field data
# optional arguments:
#   `title`: title of the plot;
#   `cmap`: colormap used;
#   `vmin` and `vmax`: min and max values at the colormap;
#   `typ`: type of the plot ['lin', 'log', 'sym']
```

Scatter plot of the particles:

```python
electrons = particles['1'] # take the electrons
x_coords = electrons['x']
y_coords = electrons['y']
isolde.plot2DScatterParticles(ax, x_coords, y_coords)
# optional arguments:
#    `label`: label of particles;
#    `legend`: plot legend [`True` or `False`]
#    `color`: color of the dots
```

(Over) plot the domain rectangles:

```python
isolde.plot2DDomains(ax, domains)
# optional arguments:
#    `color`: color of rectangles
```

Plot the data parsed from the `report` file by either a stackplot of all substeps, or just the full step only:

```python
isolde.plotReport(ax, report)
# optional arguments:
#    `only_fullstep `: plot only the full step or a stackplot of all substeps [`True` or `False`]
```
