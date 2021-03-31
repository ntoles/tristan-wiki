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

Code can be configured for a specific cluster saved into the `configure.py` file. For example, to enable all the `Perseus`-specific configurations (Princeton University) include the `--cluster=perseus` flag when calling the `python configure.py`. This will automatically enable the new MPI version, `ifport` library, `intel` compilers and specific vectorization flags.

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

<!-- {% include note.html content="On a generic cluster not specified here please use the most up-to-date `intel`, `intel-mpi/intel`, `intel-mkl` and `hdf5/intel` modules to compile the code. Depending on the cluster"%} -->

#### `Perseus` (PU)

Modules to load:

```bash
1) intel-mkl/2020.1/1/64              3) intel-mpi/intel/2019.7/64
2) intel/19.1/64/19.1.1.217           4) hdf5/intel-16.0/intel-mpi/1.8.16
```

Also it is highly recommended to use the old version of the MPI (i.e. `-mpi` flag), as the new version seems to malfunction on large number of cores (600+).

{% include warning.html content="There have been some problems reported with `openmpi` on `Perseus`, so please for now use `intel-mpi`."%}

#### `Stellar` (PU)

Modules to load:

```bash
1) intel-rt/2021.1.2                                                          
2) intel-tbb/2021.1.1
3) intel-mkl/2021.1.1
4) intel-debugger/10.0.0
5) intel-dpl/2021.1.2
6) /opt/intel/oneapi/compiler/2021.1.2/linux/lib/oclfpga/modulefiles/oclfpga
7) intel/2021.1.2
8) ucx/1.9.0
9) intel-mpi/intel/2021.1.1
10) hdf5/intel-2021.1/intel-mpi/1.10.6
11) anaconda3/2020.11
```

Simply loading the following modules will automatically load all the others:

```bash
intel/2021.1.2
intel-mpi/intel/2021.1.1
hdf5/intel-2021.1/intel-mpi/1.10.6
anaconda3/2020.11 # <- used when configuring with python
```

You can make an alias for simplicity and put in your `.zshrc` or `.bashrc`:

```bash
alias tristan_modules='module purge; module load intel/2021.1.2 intel-mpi/intel/2021.1.1 hdf5/intel-2021.1/intel-mpi/1.10.6 anaconda3/2020.11'
```

#### `Frontera`

Modules:

```bash
  1) intel/18.0.5   2) impi/18.0.5   3) phdf5/1.10.4   4) python3/3.7.0
```

Useful alias:
```bash
alias tristan_modules="module purge; module load intel/18.0.5; module load impi/18.0.5; module load phdf5/1.10.4; module load python3/3.7.0"
```

#### `Helios` (IAS)

Before running the code do the following:

```bash
# if running on a single node:
export I_MPI_PMI_LIBRARY=/usr/lib64/libpmi.so

# if running on multiple nodes:
export I_MPI_PMI_LIBRARY=/usr/lib64/libpmi2.so
export UCX_TLS=all
```
