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

The following command will configure the three-dimensional version of the code with the intel compatible MPI, hdf5 output, 5 ghost cells and the `user_mysetup.F90` userfile:
```bash
$ python configure.py -3d -intel -mpi -hdf5 --nghosts=5 --user=user_mysetup
```

List of all the flags available in the latest version can be found [here](tristanv2-confflags.html).

As a result of this python command the `Makefile` will be generated in the main directory (from `Makefile.in`). Now the code can be compiled with `make all` or cleaned with `make clean`.

{% include note.html content="The compilation takes place in two stages. During the precompilation step all the precompiler flags are processed by the `C` compiler and all the files are copied into a temporary `src_/` directory. During the second stage, the all the files in `src_/` directory are compiled and linked. This two step magic is done to support the indented macros (`#ifdef`, etc)." %} 

### Running
Executable is generated in `exec` directory named either `tristan-mp2d` or `tristan-mp3d`. Simply run with
```bash
$ exec/tristan-mp2d -i [input_file_name] -o [output_dir_name] -r [restart_dir_name]
```
or if compiled with `mpif90` one can run in MPI
```bash
$ mpiexec -np [NPROC] exec/tristan-mp2d -i [input_file_name] -o [output_dir_name] -r [restart_dir_name]
```
