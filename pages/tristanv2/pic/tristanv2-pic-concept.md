---
title: Particle-in-cell concept
keywords: pic, general, algorithm
last_updated: Dec 17, 2019
summary: "Brief introduction to how particle-in-cell works."
permalink: tristanv2-pic-concept.html
folder: tristanv2
---

Particle-in-cell (PIC) is a methodology of solving coupled Maxwell-Boltzmann equations (Vlasov system) for a relativistic collisionless plasma. Instead of dealing with a 6-dimensional distribution function as in full Vlasov system, particle-in-cell instead samples the distribution function with a finite number of macroparticles, carrying the information about the mass and momenta distributions. These macroparticles live on a discrete grid, where the values of the electric and magnetic fields (as well as the currents) are being stored. The positions and velocities of macroparticles are updated according to the Lorentz force they experience, and along with that particles feedback on the fields by depositing currents. The fields themselves are self-consistently updated according to Faraday's and Ampere's laws.

---

Generic PIC code employs the following steps.

##### 0. Initialize particles and fields
We start by initializing all the particles and field components. Notice that in `Tristan` we a-priori initialize the electric fields to zeros, meaning that all the particles have to start in the same position (in such a way, that the charge density is zero).
{% include image.html file="tristan_v2/pic_concept/step0.png" alt="step0"%}

{% include tip.html content="One may actually take advantage of the fact that the electric fields are initialized to zero. If the initial charge distribution does not yield $\rho=0$, solving Maxwell's equations further will introduce static \"ghost\" charges. This can be used to, say, initialize cold immobile \"ions\"." %}

##### 1. Faraday's law for half timestep
Advance `B`-field half step forward according to Faraday's law.
{% include image.html file="tristan_v2/pic_concept/step1.png" alt="step1"%}

##### 2. Lorentz force
Compute the Lorentz forces on particles and advance their velocities and positions according to that.
{% include image.html file="tristan_v2/pic_concept/step2.png" alt="step2"%}

##### 3. Faraday's law for half timestep and Ampere's law
Advance `B`-field for the remaining half step (Faraday's law) and also advance the `E`-field according to Ampere's law (without current).
{% include image.html file="tristan_v2/pic_concept/step3.png" alt="step3"%}

##### 4. Current deposition
Compute currents deposited by moving particles on the grid.
{% include image.html file="tristan_v2/pic_concept/step4.png" alt="step4"%}

##### 5. Ampere's law with currents
Add currents to the Ampere's law.
{% include image.html file="tristan_v2/pic_concept/step5.png" alt="step5"%}

##### 6. Output
And return to step 1.


{% include note.html content="While the general algorithm is generic among different PIC codes, some details may still differ. There exist different algorithms for pushing particles (Boris, Vay), depositing currents (zig-zag, Esirkepov), filtering, etc."%}
