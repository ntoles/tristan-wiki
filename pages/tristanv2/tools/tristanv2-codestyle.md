---
title: Code unit calculator tool
keywords: tool, calculator, units, convert, interactive
last_updated: May 16, 2019
permalink: tristanv2-codeunitcalc.html
folder: tristanv2
---

### Main parameters

All temporal and spatial units are normalized correspondingly to the timestep $\Delta t$ and the cell size $\Delta x$. We use the following equations

<div class="long-eqn">$$
d_e = \frac{c}{\omega_{\rm p}},~~\omega_{\rm p}^2=\frac{n_{\rm ppc} e^2}{m_e},~~r_L=\gamma\beta \frac{m_e c^2}{|e|B_{\rm norm}},~~\sigma=\frac{B_{\rm norm}^2}{n_{\rm ppc}m_e c^2}.
$$</div>

For all the details on how the code units are defined see the following [section](tristanv2-sim-units.html).

<div>
  <div class="row justify-content-center" style="margin-top: 15px">
    <div class="col-sm-4">
      <div id="c-input" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$c=$<input class="value input-small" value="0.45"></p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div class="setvalue-group col-xs-12">
        <div class="value-input">
          <p>$\Delta x=\Delta t \equiv 1$</p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div class="setvalue-group col-xs-12">
        <div class="value-input">
          <p>$|e|=m_e$</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div>
  <div class="row slider-row">
    <div class="col-sm-4 small-container">
      <div id="nppc-slider" class="independent-value slider-group col-sm-12">
        <div class="slider border border-primary">
          <p>$n_{\rm ppc}=$<input class="value slider-label" value="1"></p>
          <input type="range" class="value slider-small" step="0.1">
          <div class="slider-minmax">
            <input class="slider-min" value="0">
            <input class="slider-max" value="100">
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-4 small-container">
      <div id="comp-slider" class="independent-value slider-group col-sm-12">
        <div class="slider">
          <p>$d_e=$<input class="value slider-label" value="5"></p>
          <input type="range" class="value slider-small" step="0.1">
          <div class="slider-minmax">
            <input class="slider-min" value="0">
            <input class="slider-max" value="50">
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-4 small-container">
      <div id="sigma-slider" class="independent-value slider-group col-sm-12">
        <div class="slider">
          <p>$\sigma=$<input class="value slider-label" value="100"></p>
          <input type="range" class="value slider-small" step="0.1">
          <div class="slider-minmax">
            <input class="slider-min" value="0">
            <input class="slider-max" value="1000">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div>
  <div class="row justify-content-center" style="margin-top: 15px">
    <div class="col-sm-4">
      <div id="omegap-output" class="dependent-value getvalue-group col-xs-12">
        <div class="value-output">
          <p>$\omega_{\rm p}^{-1}=~$<span class="value"></span></p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div id="gyro-output" class="dependent-value getvalue-group col-xs-12">
        <div class="value-output">
          <p>$r_L=\gamma\beta~$<span class="value"></span></p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div class="dependent-value getvalue-group col-xs-12">
        <div class="value-input">
          <!-- <p>$|e|=m_e$</p> -->
        </div>
      </div>
    </div>
  </div>
</div>

<div class="panel-group">
  <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a class="noCrossRef accordion-toggle" data-toggle="collapse" href="#collapseOne">
            Pulsar setup
          </a>
        </h4>
      </div>
      <div id="collapseOne" class="panel-collapse collapse noCrossRef in" aria-expanded="true">
        <div class="panel-body">
          <p>Pulsar setup is initialized with a conducting sphere of radius $R_*$ (in cells) in the middle of the simulation box. The field is initially dipolar, while the conductor rotates with a period $P$ (in units of $\Delta t$). Important quantities include $R_{\rm LC}$ - size of the light cylinder, $r_L(R_{\rm LC})$ - larmor radius of particles near the light cylinder, $n_{\rm GJ}^*$ - GJ density required to screen the parallel electric field near the star, and the associated magnetization - $\sigma^*(n_{\rm GJ}^*)$ - and the skin depth - $d_e(n_{\rm GJ}^*)$. $\Delta V$ is the potential drop across the polar cap.
          </p>
          <p>
          We use the following equations (all the quantities are in code units)

          <div class="long-eqn">$$
          \Omega = \frac{2\pi}{P},~~R_{\rm LC} = \frac{c}{\Omega},~~B_{\rm LC}\approx B_*\left(\frac{R_{\rm LC}}{R_*}\right)^{-3},
          $$</div>

          <div class="long-eqn">$$
          n_{\rm GJ}^* = \frac{2\Omega B_*}{c|e|},~~\frac{\Delta V}{m_e c^2}=\frac{1}{c^2}B_*R_*\left(\frac{R_*}{R_{\rm LC}}\right)^2.
          $$</div>

          </p>
          <div style="margin-top: 20px">
            <div class="row">
              <div class="col-sm-4 small-container">
                <div id="psrperiod-slider" class="independent-value slider-group col-sm-12">
                  <div class="slider border border-primary">
                    <p>$P=$<input class="value slider-label" value="1500"></p>
                    <input type="range" id="psr" class="value slider-small" step="1">
                    <div class="slider-minmax">
                      <input class="slider-min" value="0">
                      <input class="slider-max" value="5000">
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-sm-4 small-container">
                <div id="rstar-input" class="independent-value setvalue col-xs-12">
                  <div class="value-input">
                    <p>$R_*=$<input class="value input-small" value="20"></p>
                  </div>
                </div>
                <div id="rlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$R_{\rm LC}=~$<span class="value"></span></p>
                  </div>
                </div>
                <div id="rlatlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$r_L(R_{\rm LC})=\gamma\beta~$<span class="value"></span></p>
                  </div>
                </div>
                <div id="de-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$\Delta V/m_e c^2=~$<span class="value"></span></p>
                  </div>
                </div>
              </div>

              <div class="col-sm-4 small-container">
                <div id="ngj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$n^*_{\rm GJ}=~$<span class="value"></span></p>
                  </div>
                </div>
                <div id="sigmagj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$\sigma^*(n_{\rm GJ}^*)=~$<span class="value"></span></p>
                  </div>
                </div>
                <div id="degj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$d_e(n_{\rm GJ}^*)=\langle\gamma\rangle^{1/2}~$<span class="value"></span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  </div>
  <!-- /.panel -->
  <div class="panel panel-default">
      <div class="panel-heading">
          <h4 class="panel-title">
              <a class="noCrossRef accordion-toggle" data-toggle="collapse" href="#collapseTwo">
                Other setup
              </a>
          </h4>
      </div>
      <div id="collapseTwo" class="panel-collapse collapse noCrossRef">
          <div class="panel-body">
            Some explanation goes here...
            <div style="margin-top: 20px">
            </div>
          </div>
      </div>
  </div>
</div>


<script>
  window.onload = function() {
    let slider_groups = document.getElementsByClassName("slider-group");
    [].forEach.call(slider_groups, function (group) {
    	let slider = group.getElementsByClassName("slider-small")[0];
      let label = group.getElementsByClassName("slider-label")[0];
      let slider_min = group.getElementsByClassName("slider-min")[0];
      let slider_max = group.getElementsByClassName("slider-max")[0];
      updateMin.call(slider_min);
      updateMax.call(slider_max);
      updateValueFromSlider.apply(slider);
      updateValueFromLabel.apply(label);
      slider.addEventListener("input", updateValueFromSlider, false);
      label.addEventListener("input", updateValueFromLabel, false);
      slider_min.addEventListener("input", updateMin, false);
      slider_max.addEventListener("input", updateMax, false);
      function updateValueFromSlider(elem) {
        let label = this.parentElement.getElementsByClassName("slider-label")[0];
        label.value = this.value;
      }
      function updateValueFromLabel(elem) {
        let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
        slider.value = this.value;
      }
      function updateMin() {
        let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
        let label = this.closest(".slider").getElementsByClassName("slider-label")[0];
        slider.setAttribute("min", this.value);
        updateValueFromLabel.apply(label);
      }
      function updateMax() {
        let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
        let label = this.closest(".slider").getElementsByClassName("slider-label")[0];
        slider.setAttribute("max", this.value);
        updateValueFromLabel.apply(label);
      }
    });
    updateDependents();

    let independent_values = document.getElementsByClassName("independent-value");
    [].forEach.call(independent_values, function (value) {
      let value_inputs = value.getElementsByClassName("value");
      [].forEach.call(value_inputs, function (value_input) {
        value_input.addEventListener("input", updateDependents, false);
      });
    });

    function precise(x) {
      if (isFinite(x)) {
        return Number.parseFloat(x).toPrecision(4);
      } else {
        return '&#8734';
      }
    }
    function updateDependents() {
      let CC = document.getElementById("c-input").getElementsByClassName("value")[0].value;
      let comp = document.getElementById("comp-slider").getElementsByClassName("value")[0].value;
      let sigma = document.getElementById("sigma-slider").getElementsByClassName("value")[0].value;
      let ppc0 = document.getElementById("nppc-slider").getElementsByClassName("value")[0].value;
      let b_norm = CC**2 * Math.sqrt(sigma) / comp;
      let qe = CC**2 / (ppc0 * comp**2);
      {
        // update omega_p
        let omegap_el = document.getElementById("omegap-output");
        omegap_el.getElementsByClassName("value")[0].innerHTML = precise(comp / CC);
      }
      {
        // update gyro
        let gyro_el = document.getElementById("gyro-output");
        gyro_el.getElementsByClassName("value")[0].innerHTML = precise(comp / Math.sqrt(sigma));
      }
      { // Pulsar stuff
        let period = document.getElementById("psrperiod-slider").getElementsByClassName("value")[0].value;
        let rlc_el = document.getElementById("rlc-output");
        let rlc = CC * period / (2 * Math.PI);
        rlc_el.getElementsByClassName("value")[0].innerHTML = precise(rlc);

        let rstar = document.getElementById("rstar-input").getElementsByClassName("value")[0].value;
        let rlatlc_el = document.getElementById("rlatlc-output");
        let rlatlc = (comp / Math.sqrt(sigma)) * (rlc / rstar)**3
        rlatlc_el.getElementsByClassName("value")[0].innerHTML = precise(rlatlc);

        let nGJ = 4 * Math.PI * ppc0 * comp * Math.sqrt(sigma) / (CC * period);
        let ngj_el = document.getElementById("ngj-output");
        ngj_el.getElementsByClassName("value")[0].innerHTML = precise(nGJ);

        let sigmaGJ = CC * period * Math.sqrt(sigma) / (4 * Math.PI * comp);
        let sigmagj_el = document.getElementById("sigmagj-output");
        sigmagj_el.getElementsByClassName("value")[0].innerHTML = precise(sigmaGJ);

        let degj = CC * period / (4 * Math.PI * Math.sqrt(sigma));
        let degj_el = document.getElementById("degj-output");
        degj_el.getElementsByClassName("value")[0].innerHTML = precise(degj);

        let de = 4 * Math.PI**2 * rstar**3 * Math.sqrt(sigma) / (CC**2 * comp * period**2);
        let de_el = document.getElementById("de-output");
        de_el.getElementsByClassName("value")[0].innerHTML = precise(de);

      }
    }
  };
</script>
