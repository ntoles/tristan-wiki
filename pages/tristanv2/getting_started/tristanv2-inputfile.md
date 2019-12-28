---
title: Input file
keywords: input, parameter, domain, problem
last_updated: Dec 17, 2019
permalink: tristanv2-inputfile.html
folder: tristanv2
---

Input file is where the user stores all the relevant simulation related parameters and constants, be it technical (i.e., number of cores, max number of particles, etc), domain specific (boundary types, number of grid cells, etc) or physical and problem specific (`sigma`, `c_omp`, etc).

{% include tip.html content="The most complete example of the input file containing all the possible necessary settings can be found in [`inputs/input.dummy`](https://github.com/PrincetonUniversity/tristan-v2/blob/master/inputs/input.dummy). So when starting to work on a new simulation it's a good idea to inherit input file from that one. That file also contains the most up to date description of all the relevant input parameters." %}

The user file is specified as a command line argument using `-i` or `--input` flag:
```bash
$ mpiexec -np 8 ./tristan-mp2d -i myinput
```

Following is an example of such an input file.

```bash
<node_configuration>

  sizex         = 2              # number of cpus in x direction
  sizey         = 2              # number of cpus in y direction
  sizez         = 1              # number of cpus in z direction

<time>

  last           = 1000          # last timestep

<grid>

  mx0           = 64             # number of actual grid points in the x direction
  my0           = 64             # number of actual grid points in the y direction
  mz0           = 1              # ... (ignored for 2D simulations)

  boundary_x    = 1              # boundary in x: 1 = periodic, 0 = outflow

# ....

<plasma>

  ppc0          = 10
  sigma         = 4
  c_omp         = 10

<particles>

  nspec         = 2             # number of species

  maxptl1       = 1e6           # max number of particles per core
  m1            = 1             # mass of the species [normalized to unit mass]
  ch1           = -1            # charge of the species [normalized to unit mass]

  maxptl2       = 1e6           # max number of particles per core
  m2            = 1
  ch2           = 1

<problem>

  myvariable    = 0.1
```

Each of those bracketed sections (e.g., `<particles>`) are called blocks. When trying to read a variable from the input from anywhere in the code one can simply do:
```fortran
call getInput('problem', 'myvariable', myvar)
```
Notice that you first specify the block and then the variable name. The value read from the input will be stored in `myvar`. Since `getInput` subroutine is overloaded `myvar` can have any type (`integer`, `real`, `logical`), the routine will do the necessary conversion itself.

{{site.data.alerts.tip}}
<p>You can also specify the default value in case the variable isn't found in the input:</p>
<pre>
call getInput('problem', 'myvariable', myvar, 0.5)
</pre>
{{site.data.alerts.end}}
