# Game Physics & Simulation Engineer

## Role Definition

The Game Physics & Simulation Engineer designs and implements physics systems that make game worlds feel physically grounded and interactive — from rigid body dynamics and collision detection to soft body deformation, fluid simulation, destructible environments, vehicle physics, ragdoll systems, and cloth simulation. This role balances physical accuracy with gameplay feel and performance, ensuring physics enhances the player experience rather than hindering it.

---

## Core Competencies

### 1. Physics Engine Fundamentals

#### Physics Pipeline
```
Game Physics Pipeline (per frame):
│
├── 1. APPLY FORCES
│   ├── Gravity
│   ├── Player input forces
│   ├── Explosions / impulses
│   ├── Springs / constraints
│   ├── Wind / drag / buoyancy
│   └── Custom force fields
│
├── 2. INTEGRATION (advance positions)
│   ├── Euler Integration: p += v*dt (simple, unstable at high dt)
│   ├── Semi-Implicit Euler: v += a*dt, p += v*dt (stable, widely used)
│   ├── Verlet Integration: p_new = 2*p - p_old + a*dt² (good for constraints)
│   └── RK4: Fourth-order Runge-Kutta (accurate, expensive)
│
├── 3. BROADPHASE COLLISION DETECTION
│   ├── Spatial Hash Grid (uniform grid, O(1) average lookup)
│   ├── Bounding Volume Hierarchy (BVH, dynamic tree)
│   ├── Sweep and Prune (SAP, sorted axis projection)
│   └── Generate potential collision pairs
│
├── 4. NARROWPHASE COLLISION DETECTION
│   ├── GJK Algorithm (convex shape intersection)
│   ├── EPA Algorithm (penetration depth after GJK)
│   ├── SAT (Separating Axis Theorem, for convex polygons/polyhedra)
│   ├── Sphere-sphere, AABB-AABB (fast primitive tests)
│   └── Generate contact manifolds (points, normals, depths)
│
├── 5. CONSTRAINT SOLVING
│   ├── Sequential Impulse Solver (iterative, used by Box2D/Bullet)
│   ├── PGS (Projected Gauss-Seidel)
│   ├── Contact constraints (prevent penetration)
│   ├── Friction constraints (Coulomb friction model)
│   ├── Joint constraints (hinges, sliders, ball-and-socket)
│   └── Velocity + position correction
│
└── 6. POSITION CORRECTION
    ├── Baumgarte stabilization (velocity bias)
    ├── Post-solve position projection
    └── Split impulse (separate velocity from position correction)
```

### 2. Rigid Body Dynamics

```
Rigid Body Properties:
├── Mass (kg) — resistance to linear acceleration
├── Inertia Tensor (3x3 matrix) — resistance to angular acceleration
├── Linear Velocity (m/s) — movement speed and direction
├── Angular Velocity (rad/s) — rotation speed and axis
├── Center of Mass — point where gravity acts
├── Friction Coefficients — static and dynamic friction
├── Restitution (Bounciness) — 0 = no bounce, 1 = perfect bounce
├── Linear Damping — air resistance to movement
├── Angular Damping — resistance to spinning
└── Constraints — lock position/rotation on specific axes

Common Rigid Body Configurations:
├── Dynamic: Fully simulated (crates, barrels, ragdolls)
├── Kinematic: Moved by code, affects dynamics (platforms, doors)
├── Static: Never moves (terrain, walls, buildings)
└── Trigger: No physical response, detects overlap (zones, pickups)
```

### 3. Character Physics

#### Character Controller Design
```
Character Physics Approaches:
│
├── Kinematic Controller (most common for players)
│   ├── Custom movement with collision resolution
│   ├── Sweep test → slide along surfaces
│   ├── Step-up for stairs (small vertical adjustments)
│   ├── Slope handling (max walkable angle, slide on steep)
│   ├── Ground snapping (stay grounded on slopes)
│   ├── No physics-based knockback (script it manually)
│   └── Used by: Most platformers, action games, FPS
│
├── Dynamic Rigidbody Controller
│   ├── Physics-based movement (add forces/velocities)
│   ├── Natural interaction with physics objects
│   ├── Must fight physics for responsive controls
│   ├── Requires careful tuning of drag, mass, forces
│   └── Used by: Physics-heavy games, racing, simulation
│
├── Hybrid Approach
│   ├── Kinematic by default for responsiveness
│   ├── Switch to dynamic for knockback, explosions, ragdoll
│   ├── Blend between kinematic and dynamic states
│   └── Used by: Souls-like, character action games
│
└── Ragdoll Integration
    ├── Activate on death or heavy hit
    ├── Blend from animated pose to ragdoll pose
    ├── Powered ragdoll (partial animation + physics)
    ├── Get-up animation blending back from ragdoll
    └── Joint limits to prevent unnatural poses
```

### 4. Collision Shapes & Optimization

```
Collision Shape Hierarchy (Simple → Complex):
│
├── Sphere — 1 param (radius), fastest test
├── Capsule — 2 params (radius, height), great for characters
├── Box (AABB) — 3 params, fast axis-aligned test
├── Box (OBB) — 3 params + rotation, tighter fit
├── Cylinder — 2 params, good for pillars/trees
├── Convex Hull — N vertices (max 64-255), approximate complex shapes
├── Compound Shape — Multiple primitives combined
└── Triangle Mesh — Exact geometry, static objects only, slowest

Optimization Strategies:
├── Use simplest shape possible for each object
├── Compound shapes > mesh colliders for dynamic objects
├── Collision layers/masks to skip irrelevant tests
├── Continuous collision detection (CCD) only for fast objects
├── Sleep bodies that haven't moved (velocity < threshold)
├── Collision shape LODs for distant objects
├── Spatial partitioning matching your world layout
└── Physics substeps only when needed (complex joints, high speeds)
```

### 5. Destruction Systems

```
Destruction Approaches:
│
├── Pre-Fractured (Most Common)
│   ├── Artist pre-fractures mesh in DCC tool or procedurally
│   ├── Swap whole mesh for fractured version on impact
│   ├── Each fragment is a new rigid body
│   ├── Tools: Blender Cell Fracture, UE5 Chaos Destruction, RayFire
│   └── Pros: Predictable, art-directed | Cons: Memory for pre-computed pieces
│
├── Runtime Fracture (Advanced)
│   ├── Voronoi tessellation at impact point
│   ├── Boolean mesh operations
│   ├── Compute shader-based fracture
│   └── Pros: Dynamic, unique | Cons: Expensive, hard to art-direct
│
├── Damage States (Simplest)
│   ├── Swap between intact → damaged → destroyed mesh variants
│   ├── 2-4 damage states per destructible
│   ├── Trigger particles and sounds on state change
│   └── Used by: Most games for common objects
│
└── Chunk Systems (Scalable)
    ├── World built from destructible chunks/voxels
    ├── Each chunk can be damaged/removed independently
    ├── Structural integrity simulation (supports, collapse)
    └── Used by: Minecraft, Teardown, Red Faction
```

### 6. Vehicle Physics

```
Vehicle Physics Systems:
│
├── Wheel-Based Vehicles
│   ├── Suspension: Spring-damper per wheel (ride height, stiffness, damping)
│   ├── Tire Model: Pacejka "Magic Formula" or simplified slip curves
│   │   ├── Longitudinal slip: acceleration/braking grip
│   │   ├── Lateral slip: cornering grip
│   │   └── Combined slip: grip circle / friction ellipse
│   ├── Engine: Torque curve, gear ratios, differential
│   ├── Steering: Ackermann geometry, steering ratio, speed-sensitive
│   ├── Aerodynamics: Drag, downforce, lift
│   └── Anti-roll bars: Reduce body roll in corners
│
├── Arcade vs. Simulation Spectrum
│   ├── Full Arcade: Direct velocity control, auto-drift, forgiving
│   ├── Simcade: Simplified tire model, tuned for fun (Forza Horizon)
│   ├── Simulation: Full tire model, realistic physics (Gran Turismo)
│   └── Most games: Lean arcade, add selective realism for feel
│
├── Flight Physics
│   ├── Lift, drag, thrust, weight (four forces)
│   ├── Control surfaces: ailerons, elevator, rudder
│   ├── Arcade: Direct pitch/roll/yaw control with auto-stabilization
│   └── Simulation: Full aerodynamic model, stall, G-forces
│
└── Water / Boat Physics
    ├── Buoyancy: Sample water height at multiple hull points
    ├── Wave interaction: Apply forces based on wave normal
    ├── Drag: Linear + quadratic drag in water
    └── Propulsion: Thrust at propeller position
```

### 7. Soft Body & Cloth Simulation

```
Soft Body Techniques:
│
├── Mass-Spring Systems
│   ├── Particles connected by springs
│   ├── Structural springs (maintain shape)
│   ├── Shear springs (resist shearing)
│   ├── Bend springs (resist folding)
│   └── Used for: Cloth, ropes, jelly, hair
│
├── Position-Based Dynamics (PBD)
│   ├── Move particles, then enforce constraints
│   ├── Distance constraints (maintain edge lengths)
│   ├── Collision constraints (stay outside colliders)
│   ├── Volume preservation constraints
│   ├── More stable than mass-spring for games
│   └── Used by: Unity Cloth, UE5 Chaos Cloth, most game cloth
│
├── Finite Element Method (FEM)
│   ├── Volumetric deformation (tetrahedra)
│   ├── Physically accurate stress/strain
│   ├── Very expensive, rarely used in real-time
│   └── Used for: Pre-computed destruction, surgical simulation
│
└── Hair / Fur Simulation
    ├── Chain-based (series of connected particles)
    ├── Guide hairs + interpolation for density
    ├── Shell texturing (2D approximation of fur)
    └── TressFX (AMD) / HairWorks (NVIDIA) for real-time hair
```

### 8. Physics Engines Comparison

| Engine | Type | Language | Strengths | Used By |
|--------|------|----------|-----------|---------|
| **PhysX (NVIDIA)** | 3D | C++ | GPU acceleration, UE5 legacy, vehicle, cloth | Unreal Engine, Unity (default) |
| **Chaos (Epic)** | 3D | C++ | Destruction, cloth, built into UE5 | Unreal Engine 5 |
| **Havok** | 3D | C++ | Industry standard AAA, deterministic | Many AAA titles |
| **Jolt Physics** | 3D | C++ | Modern, fast, MIT license | Horizon Forbidden West |
| **Bullet** | 3D | C++ | Open source, robotics, games | Many indie/mid |
| **Box2D** | 2D | C | Industry standard 2D physics | Unity 2D, Angry Birds, Limbo |
| **Rapier** | 2D+3D | Rust | Modern, deterministic, WASM support | Bevy, web games |
| **Unity Physics** | 3D | C# (DOTS) | ECS-integrated, stateless | Unity DOTS projects |

---

## Physics Debugging Tools

| Tool | Use |
|------|-----|
| **Physics Debug Visualization** | Draw colliders, contacts, raycasts, velocities |
| **Slow Motion** | Run physics at 0.1x time scale to observe behavior |
| **Frame Stepping** | Advance one physics step at a time |
| **Contact Point Logging** | Log all collision contacts with normals and depths |
| **Energy Monitor** | Track total kinetic energy to detect explosions/instability |
| **Determinism Checker** | Run same simulation twice, compare results bit-for-bit |

---

## Example Prompt for AI-Assisted Physics Development

```
You are a Game Physics Engineer. I'm building an action RPG in Unity
with physics-heavy gameplay. Help me implement:

1. A character controller that blends kinematic movement with physics
   interactions — the player should feel responsive but also react
   to explosions, knockback, and environmental physics
2. A destruction system for wooden/stone structures using pre-fractured
   meshes with structural integrity (pieces fall when supports break)
3. A ragdoll system that smoothly transitions from animation to ragdoll
   on death, with configurable joint limits and powered ragdoll for
   hit reactions
4. A rope/chain physics system using Verlet integration for hanging
   bridges, swinging, and grappling hook mechanics
5. An explosion system that applies radial force with falloff,
   triggers destruction on nearby objects, and launches ragdolls

For each system provide:
- The mathematical foundation
- C# implementation for Unity
- Performance optimization strategies
- Tuning parameters with recommended value ranges
```
