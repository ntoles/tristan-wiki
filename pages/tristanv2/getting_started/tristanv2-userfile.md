---
title: User file
keywords: userfile, setup, domain, fields, initialize
last_updated: Dec 17, 2019
permalink: tristanv2-userfile.html
folder: tristanv2
---

This is probably the most important chapter for the end-user, since the code is thought and designed in such a way, that an ordinary user might not want to touch the main skeleton of the code, and will only set up a problem through the so-called user file (stored in the `user/*` directory) and the [input](tristanv2-inputfile.html) file.

User file is a problem specific set of instructions for the simulation. It basically consists of a few different types of routines:
1. User specific parameters [`userReadInput()`]: read the problem specific parameters from the input file (typically those under the `<problem>` block) and store them in private variables (ideally accessible only within the user file itself);
2. user specific initialization [`userInitParticles()` and `userInitFields()`]: initialize problem specific configuration of particles and fields;
3. user specific driving [`userDriveParticles()`]: a subroutine called every timestep to perform some action with particles;
4. user specific boundary conditions [`userParticleBoundaryConditions()` and `userFieldBoundaryConditions()`]: these are also called at every timestep (field boundary conditions are called several times) and are meant to contain problem specific boundary conditions on particles (e.g., injection/reflection) and fields (e.g., forcing field values in specific regions).

{% include note.html content="Even if you don't want to do anything inside some of these user-specific subroutines, it is necessary to at least define them (even if they are empty) in the user file, as the main loop will be trying to access them. The most up-to-date dummy user file is [user_dummy.F90](https://github.com/PrincetonUniversity/tristan-v2/blob/master/user/user_dummy.F90). When starting to write a problem generator from scratch it's always a good idea to start by modifying that file." %}

{% include tip.html content="A more detailed step-by-step guide on how to write a user file can be found in the [\"Writing a user file\"](tristanv2-writinguserfile.html) section."%}

Now here are some handy examples of these functions.

### Initializing fields

```fortran
! `func_bx`, etc are some arbitrary functions defined elsewhere
subroutine userInitFields()
  implicit none
  integer :: i, j, k
  real    :: x_glob, y_glob, z_glob
  ! initialize to zero (not really necessary)
  ex(:,:,:) = 0; ey(:,:,:) = 0; ez(:,:,:) = 0
  bx(:,:,:) = 0; by(:,:,:) = 0; bz(:,:,:) = 0
  jx(:,:,:) = 0; jy(:,:,:) = 0; jz(:,:,:) = 0

  ! loop over all the gridpoints on a local mesh
  do k = 0, this_meshblock%ptr%sz - 1
    do j = 0, this_meshblock%ptr%sy - 1
      do i = 0, this_meshblock%ptr%sx - 1
        ! convert local to global coordinates
        x_glob = REAL(i + this_meshblock%ptr%x0)
        y_glob = REAL(j + this_meshblock%ptr%y0)
        z_glob = REAL(k + this_meshblock%ptr%z0)

        ! bx is staggered only in x direction
        bx(i, j, k) = func_bx(x_glob - 0.5, y_glob, z_glob)

        ! by is staggered only in y direction
        by(i, j, k) = func_by(x_glob, y_glob - 0.5, z_glob)

        ! bz is staggered only in z direction
        bz(i, j, k) = func_by(x_glob, y_glob, z_glob - 0.5)

        ! ex is staggered only in y & z directions
        ex(i, j, k) = func_ex(x_glob, y_glob - 0.5, z_glob - 0.5)

        ! ey is staggered only in x & z directions
        ey(i, j, k) = func_ey(x_glob - 0.5, y_glob, z_glob - 0.5)

        ! ez is staggered only in x & y directions
        ez(i, j, k) = func_ez(x_glob - 0.5, y_glob - 0.5, z_glob)
      end do
    end do
  end do
end subroutine userInitFields
```

### Initializing particles

```fortran
function userSpatialDistribution(x_glob, y_glob, z_glob,&
                               & dummy1, dummy2, dummy3)
  real :: userSpatialDistribution
  real, intent(in), optional  :: x_glob, y_glob, z_glob  ! global coordinates
  real, intent(in), optional  :: dummy1, dummy2, dummy3  ! dummy variables to pass parameters
  userSpatialDistribution = some_func_df(x_glob, y_glob, z_glob, dummy1, dummy2, dummy3)
  return ! returns the "wave function", i.e., the probability of a particle at a given position
end function userSpatialDistribution

! injecting a boosted maxwellian with temperature `0.2 me c^2` ...
! ... with positrons flying in -y direction with `beta=0.5` ...
! ... and electrons in +y with the same `beta`
subroutine userInitParticles()
  implicit none
  type(region)        :: back_region
  real                :: shift_gamma, shift_beta, TT
  procedure (spatialDistribution), pointer :: spat_distr_ptr => null()
  ! point at the previously defined spatial DF:
  spat_distr_ptr => userSpatialDistribution

  ! this `region` type defines where the plasma will be injected (in global coordinates)
  back_region%x_min = REAL(0)
  back_region%x_max = REAL(global_mesh%sx)
  back_region%y_min = REAL(0)
  back_region%y_max = REAL(global_mesh%sy)
  ! these attributes will inject in the whole region

  ! define boost 3-velocity
  shift_beta = 0.5
  ! compute boosting Lorentz factor
  shift_gamma = 1.0 / sqrt(1.0 - shift_beta**2)
  ! define the temperature
  TT = 0.2 ! in units of `m_e c^2`

  ! the following function ensures that all particles of ...
  ! ... species 1 and 2 are created at the same positions ...
  ! ... so that the electric field is 0 everywhere by definition
                                 ! region      | species  | # of species
  call fillRegionWithThermalPlasma(back_region,  (/1, 2/),  2,&
                                 ! density of each   | temperature
                                 & 0.5 * ppc0,         TT,&
                                 ! boost gamma (optional)
                                 & shift_gamma = shift_gamma,&
                                 ! boost direction for positive particles (optional, "-2" means "-y")
                                 & shift_dir = -2,&
                                 ! push both signs in the same direction (optional)
                                 & zero_current = .false.,&
                                 ! dimension of the maxwellian (optional)
                                 & dimension = 3,&
                                 ! weights of the newly created particles (optional)
                                 & weights = 1.0,&
                                 ! spatial distribution function (optional)
                                 & spat_distr_ptr = spat_distr_ptr,&
                                 ! dummy variables for the spatial DF (optional)
                                 & dummy1 = myvar1, dummy2 = myvar2, dummy3 = myvar3)
end subroutine userInitParticles
```
