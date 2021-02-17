---
title: F.A.Q.
keywords: questions, faq
last_updated: Dec 31, 2019
permalink: tristanv2-faq.html
folder: tristanv2
---

<div class="panel-group">
  <div class="panel panel-default">
      <div class="panel-heading">
          <h4 class="panel-title">
              <a class="noCrossRef accordion-toggle" data-toggle="collapse" href="#collapseOne">
                How to set up absorbing boundary conditions?
              </a>
          </h4>
      </div>
      <div id="collapseOne" class="panel-collapse collapse noCrossRef">
          <div class="panel-body">
            <p>
              Compile the code with the `-absorb` flag and set the corresponding `boundary_*` to `0`. If you need a spherical absorption, set one of the `boundary_*` to `2`. Also specify the `abs_thick` in the input which determines the region across which the absorption takes place.
            </p>
            <div style="margin-top: 20px">
            </div>
          </div>
      </div>
  </div>
  <div class="panel panel-default">
      <div class="panel-heading">
          <h4 class="panel-title">
              <a class="noCrossRef accordion-toggle" data-toggle="collapse" href="#collapseTwo">
                How to set up reflecting boundary conditions?
              </a>
          </h4>
      </div>
      <div id="collapseTwo" class="panel-collapse collapse noCrossRef">
          <div class="panel-body">
            <p>
              There is no encoded reflecting boundary condition in our code as is. However, one can use the userfile to mimic the reflecting wall (see `user_reflect.F90`). The key is to take advantage of the `userCurrentDeposit()` (already done in the mentioned userfile) to properly reflect the particles from the wall with corresponding charge conservation.
            </p>
            <div style="margin-top: 20px">
            </div>
          </div>
      </div>
  </div>

  <div class="panel panel-default">
      <div class="panel-heading">
          <h4 class="panel-title">
              <a class="noCrossRef accordion-toggle" data-toggle="collapse" href="#collapseThree">
                How to add a particle injector?
              </a>
          </h4>
      </div>
      <div id="collapseThree" class="panel-collapse collapse noCrossRef">
          <div class="panel-body">
            <p>
              Use your userfile for that. Examples of particle (and field) injectors can be found in `user_rec.F90` and `user_reflect.F90`.
            </p>
            <div style="margin-top: 20px">
            </div>
          </div>
      </div>
  </div>
</div>
