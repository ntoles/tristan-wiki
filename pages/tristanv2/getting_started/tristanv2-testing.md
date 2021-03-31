---
title: Testing the code
keywords: test, testing
last_updated: Dec 31, 2020
permalink: tristanv2-testing.html
folder: tristanv2
---

To make development easier we suggest using an automated testing framework to ensure nothing in the code is broken. This framework launches a series of standard tests on a cluster, and then one can diagnose these tests with the same framework.

To make this happen one needs a python 3 (with `matplotlib` and `numpy`). To launch the tests first open the `fulltest.py` file and edit the `modules` and `outdir` to match your cluster path specifications. `outdir` is the path where the simulation outputs will be saved. Then you can run (don't forget to load all the modules properly, because the script is going to try to compile the code):

```bash
python fulltest.py [FLAGS]
```

Flags include:
* `--path`: specify the path where to write the simulation;
* `--cluster`: specify the cluster to load the proper modules (current options are `perseus` and `stellar`);
* `-v`: verbose mode, i.e., show all the outputs;
* `-c`: compilation mode (only test compilation without running);
* `-t 1,2,...4`: specify tests to run (by default it runs all the tests);
* `-d`: diagnostic mode: plot the results after the simulations are done;
* `-r`: run mode: only runs the preexisting simulations compiled and written into the `path`.

So a typical workflow to test the code would be:

```bash
# load anaconda3 (if available on your cluster)
$ module load anaconda3
$ python fulltest.py
# ... wait for the tests to finish and plot the results
$ python fulltest.py -d
# ... if running from an ssh terminal make sure to have x11 forwarding enabled to see the matplotlib window
```

The output should look something like this:

{% include image.html file="tristan_v2/vis/testing.png" alt="testing"%}

At the moment there are just 4 tests available (two-stream instability, electrostatic plasma oscillations, weibel instability and charged particle merging).
