---
title: Restarting simulation
keywords: restart, output, binary, rst
last_updated: May 6, 2020
permalink: tristanv2-restart.html
folder: tristanv2
---

`Tristan-MP v2` allows simulations to pause. For that the code can store all the field and particle data into separate files. When restarted, the simulation can read all the data from that file and initialize all the relevant quantities as if it never stopped running in the first place.

### Saving restart files

Directory where the code stores all the restart finales in binary format is specified at runtime with the flag `-r`:

```bash
$ mpiexec exec/tristan-mp2d ... -r [restart_dir_name]
```

If not specified, the `restart_dir_name` will default to just `restart`.

Rest of the configurations for the restart are specified in the `input` file:

```python
<restart>

  enable        = 0              # enable/disable restart
  start         = 1              # first restart step
  interval      = 1000           # step interval between restarts
  rewrite       = 1              # 1 = rewrite each restart; 0 = separate restart each time
```

There are two options for the `rewrite` variable: you can either create a single restart folder and overwrite it once every `interval` timesteps (`rewrite = 1`), or you can create separate folders for each of the restart steps (`rewrite = 0`). All the directories will be saved in the path specified above -- `[restart_dir_name]`. If `rewrite = 1` -- there will be just one directory called `step_00000/` where all the restart files will be saved. If `rewrite = 0` -- you'll see several directories of the form `step_*****`, where `*****` will be the number of the restart.

### Restarting simulation

To restart the simulation with the data stored in the restart directory you need to include the following flag when running:

```bash
$ mpiexec exec/tristan-mp2d ... -R [RESTART_FROM]
```

or

```bash
srun exec/tristan-mp2d ... -R [RESTART_FROM]

```

`[RESTART_FROM]` is the directory where all the restart files are stored, i.e., typically it will be of the form: `restart/step_*****`. Notice that here you'll also need to specify the subdirectory `step_` where all the files are actually stored. That way you can specify which restart point you actually want to use.

{% include note.html content="Every cpu will be writing its own restart file in the specified directory. Because of that when you actually restart the simulation, you cannot change the meshblock or tile distribution. Allocated sizes of particle tiles can be altered, but not their spatial dimensions." %}

{% include note.html content="Also the fundamental scaling parameters, such as the speed of light, the skin depth etc will be read from the restart file, and the values specified in the new input will be ignored. The user-specified parameters, however, will still be determined read from the input, as the `userReadInput()` function will still be called during the restart. However, user-specific particle and field initializations will be ignored." %}
