---
title: Configuring, compiling and running the code
keywords: configure, flag, compile, run, cluster, mpi
last_updated: Dec 17, 2019
permalink: tristanv2-configure.html
folder: tristanv2
---

### Configuring & making
To configure the code simply type the following command
```bash
$ python configure.py [-FLAGS]
```

For example, the following command will configure the three-dimensional version of the code with the intel compatible MPI, hdf5 output, 5 allocated ghost cells and the `user_mysetup.F90` problem generator:
```bash
$ python configure.py -3d -intel -mpi -hdf5 --nghosts=5 --user=user_mysetup
```

{% include tip.html content="List of all the available flags in the latest version can be found [here](tristanv2-confflags.html)."%}

As a result of this python command the `Makefile` will be generated in the main directory (from the `Makefile.in`). Now the code can be compiled with `make all` or cleaned with `make clean`.

{% include note.html content="The compilation takes place in two stages. During the precompilation step all the precompiler flags are processed by the `C` compiler and all the files are copied into a temporary `src_/` directory. During the second stage, the all the files in `src_/` directory are compiled and linked. This two step magic is done to support the indented macros (`#ifdef`, etc)." %}

### Running
Executable is generated in `exec` directory named `tristan-mp1d`, `tristan-mp2d` or `tristan-mp3d`. Then you may simply run it with
```bash
$ exec/tristan-mp2d -i [input_file_name] -o [output_dir_name] -r [restart_dir_name]
```
or if compiled with `mpif90` you can run in MPI
```bash
$ mpiexec -np [NPROC] exec/tristan-mp2d -i [input_file_name] -o [output_dir_name] -r [restart_dir_name]
```

### Cluster specific customization

Code can be configured for a specific cluster saved into the `configure.py` file. For example, to enable all the `Perseus`-specific configurations (Princeton University) include the `-perseus` flag when calling the `python configure.py`. This will automatically enable the new MPI version, `ifport` library, `intel` compilers and specific vectorization flags.

Most clusters use the so-called `slurm` scheduling system where jobs are submitted for scheduling using a submit script. Here is a best practice example of such a script:

```bash
#!/bin/bash
#SBATCH -J myjobname
#SBATCH -n 64
#SBATCH -t 01:00:00

# specify all the variables
EXECUTABLE=tristan-mp2d
INPUT=input
OUTPUT_DIR=output
SLICE_DIR=slices
RESTART_DIR=restart
REPORT_FILE=report
ERROR_FILE=error

# here you'll need to include cluster specific modules ...
# ... these are the ones used on `perseus`
module load intel-mkl/2019.3/3/64
module load intel/19.0/64/19.0.3.199
module load intel-mpi/intel/2018.3/64
module load hdf5/intel-16.0/intel-mpi/1.8.16

# create the output directory
mkdir $OUTPUT_DIR
# backup the executable and the input file
cp $EXECUTABLE $OUTPUT_DIR
cp $INPUT $OUTPUT_DIR
srun $EXECUTABLE -i $INPUT -o $OUTPUT_DIR -s $SLICE_DIR -r $RESTART_DIR > $OUTPUT_DIR/$REPORT_FILE 2> $OUTPUT_DIR/$ERROR_FILE
```
