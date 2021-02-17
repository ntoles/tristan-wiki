---
title: Code unit calculator tool
keywords: tool, calculator, units, convert, interactive
last_updated: May 16, 2019
permalink: tristanv2-codeunitcalc.html
folder: tristanv2
---

### Main parameters

All temporal and spatial units are normalized correspondingly to the timestep $\Delta t$ and the cell size $\Delta x$; the fields are normalized to the fiducial value $B_{\rm norm}$, and the densities are normalized to $n_{\rm ppc}$. We use the following equations

<div class="long-eqn">$$
d_e = \frac{c}{\omega_{\rm p}},~~\omega_{\rm p}^2=\frac{4\pi n_e e^2}{m_e},~~r_L=\gamma\beta \frac{m_e c^2}{|e|B},~~\sigma=\frac{B^2}{4\pi n_e m_e c^2}.
$$</div>

For all the details on how the code units are defined see the following [section](tristanv2-sim-units.html).

<div>
  <div class="row justify-content-center" style="margin-top: 15px">
    <div class="col-sm-4">
      <div id="c-def" class="setvalue-group col-xs-12">
        <div class="value-input">
          <p>$c=\mathrm{CC}\frac{\Delta x}{\Delta t}$</p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div id="de-def" class="setvalue-group col-xs-12">
        <div class="value-input">
          <p>$d_e=\mathrm{COMP}\Delta x$</p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div id="nppc-def" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$n_{\rm ppc}=\mathrm{PPC}\Delta x^{-3}$</p>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-3">
      <div id="c-input" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$\mathrm{CC}=$<input class="value input-small" value="0.45"></p>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div id="comp-input" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$\mathrm{COMP}=$<input class="value input-small" value="4"></p>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div id="nppc-input" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$\mathrm{PPC}=$<input class="value input-small" value="1"></p>
        </div>
      </div>
    </div>
    <div class="col-sm-3">
      <div id="sigma-input" class="independent-value setvalue-group col-xs-12">
        <div class="value-input">
          <p>$\sigma=$<input class="value input-small" value="100"></p>
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-sm-4">
      <div id="omegap-output" class="dependent-value getvalue-group col-xs-12">
        <div class="value-output">
          <p>$\omega_{\rm p}^{-1}=~$<span class="value"></span>$~\Delta t$</p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div id="omegaB-output" class="dependent-value getvalue-group col-xs-12">
        <div class="value-output">
          <p>$\omega_B^{-1}=(\gamma\beta)^{-1}~$<span class="value"></span>$~\Delta t$</p>
        </div>
      </div>
    </div>
    <div class="col-sm-4">
      <div id="gyro-output" class="dependent-value getvalue-group col-xs-12">
        <div class="value-output">
          <p>$r_L=\gamma\beta~$<span class="value"></span>$~\Delta x$</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- <div>
  <div class="row slider-row">
    <div class="col-sm-4 small-container">
      <div id="nppc-slider" class="independent-value slider-group col-sm-12">
        <div class="slider border border-primary">
          <p>$n_{\rm ppc}=$<input class="value slider-label" value="1"></p>
          <input type="range" class="value slider-small" step="1">
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
          <input type="range" class="value slider-small" step="1">
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
          <input type="range" class="value slider-small" step="1">
          <div class="slider-minmax">
            <input class="slider-min" value="0">
            <input class="slider-max" value="1000">
          </div>
        </div>
      </div>
    </div>
  </div>
</div> -->

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
          <p>
            Pulsar setup is initialized with a conducting sphere of radius $R_*$ in the middle of the simulation box. The field is initially dipolar with an enforced strength $B_*$ at the surface. The conductor rotates with a period $P$.
            <!-- Important quantities include $R_{\rm LC}$ - size of the light cylinder, $r_L^{\rm LC}$ - larmor radius of particles near the light cylinder, $n_{\rm GJ}^*$ - GJ density required to screen the parallel electric field near the star, and the associated magnetization - $\sigma^*(n_{\rm GJ}^*)$ - and the skin depth - $d_e(n_{\rm GJ}^*)$. $\Delta V$ is the potential drop across the polar cap. All the other quantities with a sub-/super- script "${}^*$" are measured at the stellar surface, and with "${}^{\rm LC}$" - near the light cylinder. -->
            <button type="button" id="resetPulsar">Reset to fiducial parameters</button>.
          </p>

          <p>
            We use the following equations (all the quantities are in code units)

            <div class="long-eqn">$$
            \Omega = \frac{2\pi}{P},~~R_{\rm LC} = \frac{c}{\Omega},~~B_{\rm LC}\approx B_*\left(\frac{R_{\rm LC}}{R_*}\right)^{-3},
            $$</div>

            <div class="long-eqn">$$
            n_{\rm GJ} = \frac{\Omega B}{2\pi c|e|},~~\frac{\Delta V_{\rm pc}}{m_e c^2}=\omega_B^0\frac{B_*}{B_{\rm norm}}\frac{R_*}{c}\left(\frac{R_*}{R_{\rm LC}}\right)^2,~~s_{\rm LC}=\frac{d_e(n_{\rm GJ}^{\rm LC})}{R_{\rm LC}}.
            $$</div>
          </p>
          <!-- <input type="range" id="psr" class="value slider-small" step="100">
          <div class="slider-minmax">
            <input class="slider-min" value="0">
            <input class="slider-max" value="5000">
          </div> -->

          <div style="margin-top: 20px">

            <div class="row">

              <div class="col-sm-6 small-container">

                <div id="rstar-input" class="independent-value setvalue col-xs-12">
                  <div class="value-input">
                    <p>$R_*=~$<input class="value input-small" value="20">$~{\color{lightgray}\Delta x}$</p>
                  </div>
                </div>

                <div id="bstar-input" class="independent-value setvalue col-xs-12">
                  <div class="value-input">
                    <p>$B_*=~$<input class="value input-small" value="1">$~{\color{lightgray}B_{\rm norm}}$</p>
                  </div>
                </div>

                <div id="dv-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$\frac{\Delta V_{\rm pc}}{m_e c^2}=~$<span class="value"></span></p>
                  </div>
                </div>

                <!-- <div id="rlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$R_{\rm LC}=~$<span class="value"></span></p>
                  </div>
                </div> -->

                <div id="degj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$d_e^*=~$<span class="value"></span>${\color{lightgray}\langle\gamma\rangle^{1/2} \left(\frac{n}{n_{\rm GJ}^*}\right)^{-1/2} \Delta x}$</p>
                  </div>
                </div>

                <div id="ngj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$n^*_{\rm GJ}=~$<span class="value"></span>$~{\color{lightgray}\Delta x^{-3}}$</p>
                  </div>
                </div>

                <div id="sigmagj-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$\sigma^*=~$<span class="value"></span>${\color{lightgray}\left(\frac{n}{n_{\rm GJ}^*}\right)^{-1}\left(\frac{B}{B_*}\right)^2}$</p>
                  </div>
                </div>

              </div>

              <div class="col-sm-6 small-container">

                <div id="psrperiod-input" class="independent-value slider-group col-xs-6">
                  <div class="value-input">
                    <p>$P=~$<input class="value slider-label" value="1500">$~{\color{lightgray}\Delta t}$</p>
                  </div>
                </div>
                <div id="rlc-output" class="independent-value setvalue col-xs-6">
                  <div class="value-output">
                    <p>$R_{\rm LC}=~$<span class="value"></span>$~{\color{lightgray}\Delta x}$</p>
                  </div>
                </div>

                <div id="blc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$B_{\rm LC}=~$<span class="value"></span>$~{\color{lightgray}B_{\rm norm}}$</p>
                  </div>
                </div>

                <div id="degjlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$d_e^{\rm LC}=~$<span class="value"></span>${\color{lightgray}\langle\gamma\rangle^{1/2} \left(\frac{n}{n_{\rm GJ}^*}\right)^{-1/2} \Delta x}$</p>
                  </div>
                </div>

                <div id="rlatlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$r_L^{\rm LC}={\color{lightgray}\gamma\beta}~$<span class="value"></span>${\color{lightgray}\left(\frac{B}{B_{\rm LC}}\right)^{-1} \Delta x}$</p>
                  </div>
                </div>

                <div id="slc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$s_{\rm LC}=~$<span class="value"></span></p>
                  </div>
                </div>

                <div id="ngjatlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$n^{\rm LC}_{\rm GJ}=~$<span class="value"></span>$~{\color{lightgray}\Delta x^{-3}}$</p>
                  </div>
                </div>

                <div id="sigmagjatlc-output" class="dependent-value col-xs-12">
                  <div class="value-output">
                    <p>$\sigma^{\rm LC}=~$<span class="value"></span>${\color{lightgray}\left(\frac{n}{n^{\rm LC}_{\rm GJ}}\right)^{-1}\left(\frac{B}{B_{\rm LC}}\right)^2}$</p>
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
    // let slider_groups = document.getElementsByClassName("slider-group");
    // [].forEach.call(slider_groups, function (group) {
    // 	let slider = group.getElementsByClassName("slider-small")[0];
    //   let label = group.getElementsByClassName("slider-label")[0];
    //   let slider_min = group.getElementsByClassName("slider-min")[0];
    //   let slider_max = group.getElementsByClassName("slider-max")[0];
    //   updateMin.call(slider_min);
    //   updateMax.call(slider_max);
    //   updateValueFromSlider.apply(slider);
    //   updateValueFromLabel.apply(label);
    //   slider.addEventListener("input", updateValueFromSlider, false);
    //   label.addEventListener("input", updateValueFromLabel, false);
    //   slider_min.addEventListener("input", updateMin, false);
    //   slider_max.addEventListener("input", updateMax, false);
    //   function updateValueFromSlider(elem) {
    //     let label = this.parentElement.getElementsByClassName("slider-label")[0];
    //     label.value = this.value;
    //   }
    //   function updateValueFromLabel(elem) {
    //     let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
    //     slider.value = this.value;
    //   }
    //   function updateMin() {
    //     let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
    //     let label = this.closest(".slider").getElementsByClassName("slider-label")[0];
    //     slider.setAttribute("min", this.value);
    //     updateValueFromLabel.apply(label);
    //   }
    //   function updateMax() {
    //     let slider = this.closest(".slider").getElementsByClassName("slider-small")[0];
    //     let label = this.closest(".slider").getElementsByClassName("slider-label")[0];
    //     slider.setAttribute("max", this.value);
    //     updateValueFromLabel.apply(label);
    //   }
    // });
    updateDependents();

    document.getElementById("resetPulsar").addEventListener("click", resetPulsar);

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
      let comp = document.getElementById("comp-input").getElementsByClassName("value")[0].value;
      let sigma = document.getElementById("sigma-input").getElementsByClassName("value")[0].value;
      let ppc0 = document.getElementById("nppc-input").getElementsByClassName("value")[0].value;
      let b_norm = CC**2 * Math.sqrt(sigma) / comp;
      let qe = CC**2 / (ppc0 * comp**2);
      let omega_P = (comp / CC);
      let omega_B = (b_norm / CC);
      {
        // update omega_p
        let omegap_el = document.getElementById("omegap-output");
        omegap_el.getElementsByClassName("value")[0].innerHTML = precise(1.0 / omega_P);
      }
      {
        // update omegaB
        let omegap_B = document.getElementById("omegaB-output");
        omegap_B.getElementsByClassName("value")[0].innerHTML = precise(1.0 / omega_B);
      }
      {
        // update gyro
        let gyro_el = document.getElementById("gyro-output");
        gyro_el.getElementsByClassName("value")[0].innerHTML = precise(comp / Math.sqrt(sigma));
      }
      { // Pulsar stuff
        let bstar = document.getElementById("bstar-input").getElementsByClassName("value")[0].value;
        let period = document.getElementById("psrperiod-input").getElementsByClassName("value")[0].value;
        let rstar = document.getElementById("rstar-input").getElementsByClassName("value")[0].value;

        let rlc = CC * period / (2 * Math.PI);

        let nGJ = 2 * (2 * Math.PI / period) * bstar * b_norm / (CC * qe);
        let sigmaGJ = (bstar * b_norm)**2 / (nGJ * CC**2 * qe);
        let deGJ = comp * (nGJ / ppc0)**(-0.5);
        let dv = omega_B * bstar * (rstar / CC) * (rstar / rlc)**2;

        let BLC = bstar * (rstar / rlc)**3;
        let rlLC = CC**2 / (BLC * b_norm);
        let nGJLC = 2 * (2 * Math.PI / period) * BLC * b_norm / (CC * qe);
        let sigmaGJLC = (BLC * b_norm)**2 / (nGJLC * CC**2 * qe);
        let deGJLC = comp * (nGJLC / ppc0)**(-0.5);

        let rlc_el = document.getElementById("rlc-output");
        rlc_el.getElementsByClassName("value")[0].innerHTML = precise(rlc);

        let rlatlc_el = document.getElementById("rlatlc-output");
        rlatlc_el.getElementsByClassName("value")[0].innerHTML = precise(rlLC);

        let ngj_el = document.getElementById("ngj-output");
        ngj_el.getElementsByClassName("value")[0].innerHTML = precise(nGJ);

        let blc_el = document.getElementById("blc-output");
        blc_el.getElementsByClassName("value")[0].innerHTML = precise(BLC);

        let sigmagj_el = document.getElementById("sigmagj-output");
        sigmagj_el.getElementsByClassName("value")[0].innerHTML = precise(sigmaGJ);

        let degj_el = document.getElementById("degj-output");
        degj_el.getElementsByClassName("value")[0].innerHTML = precise(deGJ);

        let dv_el = document.getElementById("dv-output");
        dv_el.getElementsByClassName("value")[0].innerHTML = precise(dv);

        let ngjlc_el = document.getElementById("ngjatlc-output");
        ngjlc_el.getElementsByClassName("value")[0].innerHTML = precise(nGJLC);

        let degjlc_el = document.getElementById("degjlc-output");
        degjlc_el.getElementsByClassName("value")[0].innerHTML = precise(deGJLC);

        let slc_el = document.getElementById("slc-output");
        slc_el.getElementsByClassName("value")[0].innerHTML = precise(rstar / rlc);

        let sigmagjlc_el = document.getElementById("sigmagjatlc-output");
        sigmagjlc_el.getElementsByClassName("value")[0].innerHTML = precise(sigmaGJLC);
      }
    }
    function resetPulsar() {
      let cc_0 = 0.45, comp_0 = 4, ppc_0 = 10, sigma_0 = 1e7;
      let rstar_0 = 40, bstar_0 = 1, period_0 = 1600;
      document.getElementById("c-input").getElementsByClassName('value')[0].setAttribute('value', cc_0);
      document.getElementById("comp-input").getElementsByClassName('value')[0].setAttribute('value', comp_0);
      document.getElementById("sigma-input").getElementsByClassName('value')[0].setAttribute('value', sigma_0);
      document.getElementById("nppc-input").getElementsByClassName('value')[0].setAttribute('value', ppc_0);
      document.getElementById("rstar-input").getElementsByClassName('value')[0].setAttribute('value', rstar_0);
      document.getElementById("bstar-input").getElementsByClassName('value')[0].setAttribute('value', bstar_0);
      document.getElementById("psrperiod-input").getElementsByClassName('value')[0].setAttribute('value', period_0);
      updateDependents();
    }
  };
</script>
