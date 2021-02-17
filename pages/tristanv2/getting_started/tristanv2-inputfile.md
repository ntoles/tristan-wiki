---
title: Input file
keywords: input, parameter, domain, problem
last_updated: Dec 31, 2019
permalink: tristanv2-inputfile.html
folder: tristanv2
---

Input file is where user stores all the relevant simulation related parameters and constants, be it technical (i.e., number of cores, max number of particles, etc), domain specific (boundary types, number of grid cells, etc) or physical and problem specific (`sigma`, `c_omp`, etc).

{% include tip.html content="The most complete example of the input file containing all the possible necessary settings can be found in the `inputs/input.full` file with all the relevant descriptions. When starting to work on a new simulation it's a good idea to inherit input file from that particular one. This file also contains the most up to date description of all the relevant input parameters." %}

The user file is specified as a command line argument using `-i` or `--input` flag when running the simulation:
```bash
$ mpiexec -np 8 ./tristan-mp2d -i myinput
```

Following is an example of such an input file:

```python
<node_configuration>

  sizex         = 2              # number of cpus in x direction
  sizey         = 2              # number of cpus in y direction
  sizez         = 1              # number of cpus in z direction

<time>

  last           = 1000          # last timestep

<grid>

  mx0           = 64             # number of actual grid points in the x direction
  my0           = 64             # number of actual grid points in the y direction
  mz0           = 1              # number of actual grid points in the z direction

  boundary_x    = 1              # boundary in x: 1 = periodic, 0 = outflow, 2 = radial outflow
  boundary_y    = 1              # boundary in y: 1 = periodic, 0 = outflow, 2 = radial outflow
  boundary_z    = 1              # boundary in z: 1 = periodic, 0 = outflow, 2 = radial outflow
                                 # ... if either is "2" all will be assigned to "2"

# ....

<plasma>

  ppc0          = 10
  sigma         = 4
  c_omp         = 10

<particles>

  nspec         = 2

  maxptl1       = 1e6           # max number of particles per core
  m1            = 1
  ch1           = -1
  deposit1      = 1             # [defaults to TRUE if charge != 0]
  move1         = 1             # [defaults to TRUE]
  cool1         = 1             # turn ON/OFF cooling for this species
  output1       = 0             # save particles to `prtl` output or not [defaults to TRUE]

  maxptl2       = 1e6           # max number of particles per core
  m2            = 1
  ch2           = 1
  deposit2      = 1             # [defaults to TRUE if charge != 0]
  move2         = 1             # [defaults to TRUE]
  cool2         = 0             # turn ON/OFF cooling for this species

<problem>

  myvariable    = 0.1
```

Each of those bracketed sections (e.g., `<particles>`) are called blocks. When trying to read a variable from the input from anywhere in the code one can simply do:
```fortran
call getInput('problem', 'myvariable', myvar)
```
Notice that you first specify the block (in this case the `problem`) and then the variable name (`myvariable`). The value read from the input will be stored in `myvar` variable. Since `getInput` subroutine is overloaded `myvar` can have any type (`integer`, `real`, `logical`), the routine will do the necessary conversion itself.

{{site.data.alerts.tip}}
<p>You can also specify the default value in case the variable isn't found in the input:</p>
<pre>
call getInput('problem', 'myvariable', myvar, 0.5)
</pre>
{{site.data.alerts.end}}


{% include note.html content="If `myvar` is boolean (i.e. has type of `logical` in Fortran) it will automatically convert `1` and `0` from the input file to `.true.` and `.false.`."%}
