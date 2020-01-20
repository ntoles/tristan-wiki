---
title: Performance and scaling
keywords: performance, speed, scaling, cluster, node, core, vector
last_updated: Jan 19, 2019
permalink: tristanv2-performance.html
folder: tristanv2
---

### Performance

`Tristan-MP v2` employs an implicitly vectorized particle pusher. In addition to explicitly inlined field interpolation, we also convert 3 dimensional indexing to reference fields, `(i, j, k)`, to 1-dimensional, `(lind, -NGHOST, -NGHOST)`. This allows the compiler to optimize the interpolation procedure and fully vectorize the mover.

The comparison can be seen in the picture below where we performed 2D simulations on [`perseus` cluster in Princeton](https://researchcomputing.princeton.edu/systems-and-services/available-systems/perseus) (2.4 GHz Xeon, Broadwell). Compilation was done with the `h5pfc` command using `intel` compilers with the following precompiler flags:

```bash
-O3 -xCORE-AVX2 -qopt-streaming-stores auto -DSoA -ipo -qopenmp-simd
```

We used the `user_weibel` problem generator with `1000x1000` cells on each core (8 cores on a single node), 16 particles per cell, and performed the same run 3 times: first time without vectorization, then with the vectorization enabled, and finally with both vectorization and 1 dimensional field indexing. As it can be seen from the barplot below, the proper vectorization and 1d indexing allows for almost a 3.5x speedup on `perseus` machine.

<div id="opt2d"></div>

Below we also test how performance varies with the number of particles per [tile](tristanv2-structure.html#tiles-and-particles) and with the number of tiles on the [meshblock](tristanv2-structure.html#meshblocks-mpi-domains). Again, we run the same setup in 2d with `1000x1000` grid on each core.

In the first test we keep the number of particles per cell constant (16) and vary dimensions of tiles. While small tiles allow processors to take advantage of the fast cache by preloading particle arrays in full, larger tiles typically show a lot worse performance (left plot). However when tiles become too small, the cost for jumping from tile to tile becomes too large, diminishing the overall performance boost. In this particular setup the sweet spot is somewhere around `20x20` (2500 tiles overall in the meshblock) cells tile size with about `1e4` particles per tile (right plot).

<div class="col-lg-6" id="vartiles2d-1"></div>
<div class="col-lg-6" id="vartiles2d-2"></div>

In the second experiment we keep the tile size at `20x20` and vary the number of particles per cell. From this experiment we can learn, that for low number of particles per tile (i.e., per cell), the cache misses become important and the efficiency drops (right plot). Grey lines on both plots show the "average" performance; from the left plot we see that as we load more particles in our tiles the performance rapidly boosts compare to the linearly predicted average value.

<div class="col-lg-6" id="varppc2d-1"></div>
<div class="col-lg-6" id="varppc2d-2"></div>

<!-- <div class="col-lg-6" id="vartiles3d"></div>
<div class="col-lg-6" id="varppc3d"></div> -->

<script src="pages/tristanv2/useful/opt2d.js"></script>
<script src="pages/tristanv2/useful/performance2d.js"></script>
