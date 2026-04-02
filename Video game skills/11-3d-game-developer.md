# 3D Game Developer

## Role Definition

The 3D Game Developer specializes in all aspects of creating three-dimensional interactive experiences — from real-time rendering, 3D mathematics, and physics simulation to 3D asset pipelines, character animation, camera systems, lighting, and spatial audio. This role encompasses the technical artistry required to build immersive 3D worlds that run at high performance across platforms.

---

## Core Competencies

### 1. 3D Mathematics & Linear Algebra

#### Essential Math for 3D Games
```
Vectors & Operations:
├── Vector addition, subtraction, scaling
├── Dot product (angle between vectors, projection, facing checks)
├── Cross product (perpendicular vector, surface normals, winding order)
├── Normalization (unit vectors for direction)
├── Magnitude / distance calculations
└── Lerp, Slerp (smooth interpolation)

Matrices:
├── 4x4 Transformation matrices (Model, View, Projection)
├── Translation, Rotation, Scale composition
├── Matrix multiplication order (TRS)
├── Inverse matrices (world ↔ local space)
├── Projection matrices (perspective, orthographic)
└── Normal matrix (inverse transpose for lighting)

Quaternions:
├── Rotation representation (avoids gimbal lock)
├── Quaternion multiplication (combining rotations)
├── Slerp (smooth rotation interpolation)
├── Euler ↔ Quaternion conversion
├── Look rotation (direction → rotation)
└── Angle-axis construction

Geometric Primitives:
├── Rays (origin + direction) for raycasting
├── Planes (normal + distance) for culling, reflection
├── AABB (Axis-Aligned Bounding Boxes) for broad-phase collision
├── OBB (Oriented Bounding Boxes) for tighter bounds
├── Spheres for distance checks and broad collision
├── Frustum (6 planes) for camera culling
└── Bezier / Catmull-Rom curves for paths and animation
```

### 2. Real-Time Rendering Pipeline

#### Rendering Architecture
```
Frame Rendering Pipeline:
│
├── 1. SCENE TRAVERSAL
│   ├── Frustum culling (reject objects outside camera view)
│   ├── Occlusion culling (reject objects behind others)
│   ├── LOD selection (choose detail level by distance)
│   └── Sort by render queue (opaque front-to-back, transparent back-to-front)
│
├── 2. SHADOW PASS
│   ├── Render shadow maps from each light's perspective
│   ├── Cascaded Shadow Maps (CSM) for directional lights
│   └── Shadow atlas for point/spot lights
│
├── 3. GEOMETRY PASS (Deferred) or FORWARD PASS
│   ├── Deferred: Render G-Buffer (albedo, normals, roughness, metallic, depth)
│   ├── Forward: Render geometry with lighting in one pass
│   └── Forward+: Tile-based light culling + forward rendering
│
├── 4. LIGHTING PASS (Deferred only)
│   ├── Process each light against G-Buffer
│   ├── Screen-space shadows
│   └── Global illumination (SSGI, probes, VXGI, Lumen)
│
├── 5. TRANSPARENT PASS
│   ├── Render transparent objects back-to-front
│   ├── Order-independent transparency (OIT) for complex cases
│   └── Particle rendering
│
├── 6. POST-PROCESSING
│   ├── Anti-aliasing (TAA, FXAA, MSAA, SMAA)
│   ├── Bloom (bright area glow)
│   ├── Depth of Field (bokeh)
│   ├── Motion Blur
│   ├── Screen-Space Reflections (SSR)
│   ├── Ambient Occlusion (SSAO, GTAO, HBAO)
│   ├── Tone mapping (HDR → LDR)
│   ├── Color grading / LUTs
│   └── Upscaling (DLSS, FSR, XeSS, TSR)
│
└── 7. UI OVERLAY
    └── Render HUD and menus on top
```

### 3. PBR (Physically-Based Rendering) Materials

#### PBR Workflow
```
Metallic-Roughness Workflow (Standard):
├── Albedo (Base Color) — RGB, no lighting info
├── Metallic — 0 (dielectric) to 1 (metal)
├── Roughness — 0 (mirror smooth) to 1 (fully rough)
├── Normal Map — Surface detail without geometry
├── Ambient Occlusion — Crevice darkening
├── Emissive — Self-illumination
└── Height / Displacement — Parallax or tessellation

Specular-Glossiness Workflow (Alternative):
├── Diffuse — RGB, adjusted for metallic
├── Specular — RGB specular color
├── Glossiness — Inverse of roughness
└── (Same normal, AO, emissive, height maps)

Texture Resolutions by Asset Type:
├── Hero characters: 2048x2048 or 4096x4096
├── Environment props: 512x512 to 2048x2048
├── Terrain: 1024x1024 to 4096x4096 (tiled)
├── Weapons/Items: 512x512 to 2048x2048
└── UI elements: Power-of-two, as needed
```

### 4. 3D Asset Pipeline

```
3D Asset Pipeline:
│
├── CONCEPT
│   ├── 2D concept art and reference sheets
│   └── Style guide (art direction, proportions, color palette)
│
├── MODELING
│   ├── High-poly sculpt (ZBrush, Blender Sculpt) — millions of polys
│   ├── Low-poly game mesh (Blender, Maya) — optimized topology
│   ├── UV unwrapping (minimize stretching, maximize texel density)
│   ├── LOD generation (manual or automatic decimation)
│   └── Naming conventions and pivot placement
│
├── TEXTURING
│   ├── Bake high-poly → low-poly (normal map, AO, curvature)
│   ├── PBR texturing (Substance Painter, Quixel Mixer)
│   ├── Trim sheets and texture atlases for efficiency
│   ├── Tiling materials (Substance Designer)
│   └── Texture optimization (compression: BC7, ASTC, ETC2)
│
├── RIGGING (Characters)
│   ├── Skeleton creation (bones, joints, hierarchy)
│   ├── Weight painting (vertex skinning)
│   ├── Blend shapes / morph targets (facial animation)
│   ├── Physics bones (hair, cloth, accessories)
│   └── IK constraints
│
├── ANIMATION
│   ├── Keyframe animation
│   ├── Motion capture cleanup
│   ├── Animation retargeting
│   ├── Blend trees and state machines
│   └── Root motion vs. in-place animation
│
├── INTEGRATION
│   ├── FBX / glTF export with proper settings
│   ├── Engine import and material setup
│   ├── Collision mesh setup (simple vs. complex)
│   ├── LOD group configuration
│   └── Prefab / Blueprint creation
│
└── OPTIMIZATION
    ├── Triangle budget enforcement
    ├── Draw call batching (static/dynamic, instancing)
    ├── Texture streaming configuration
    ├── Occlusion volume placement
    └── Lightmap UV generation and settings
```

### 5. Camera Systems

```csharp
// Third-person camera system with collision
public class ThirdPersonCamera : MonoBehaviour
{
    [Header("Target")]
    [SerializeField] private Transform _target;
    [SerializeField] private Vector3 _shoulderOffset = new(0.5f, 1.6f, 0f);

    [Header("Distance")]
    [SerializeField] private float _defaultDistance = 4f;
    [SerializeField] private float _minDistance = 1f;
    [SerializeField] private float _maxDistance = 8f;

    [Header("Sensitivity")]
    [SerializeField] private float _horizontalSpeed = 200f;
    [SerializeField] private float _verticalSpeed = 120f;
    [SerializeField] private float _verticalClampMin = -30f;
    [SerializeField] private float _verticalClampMax = 70f;

    [Header("Collision")]
    [SerializeField] private LayerMask _collisionLayers;
    [SerializeField] private float _collisionRadius = 0.3f;
    [SerializeField] private float _collisionRecoverySpeed = 8f;

    private float _yaw, _pitch;
    private float _currentDistance;

    private void LateUpdate()
    {
        // Input
        Vector2 input = GetCameraInput();
        _yaw += input.x * _horizontalSpeed * Time.deltaTime;
        _pitch -= input.y * _verticalSpeed * Time.deltaTime;
        _pitch = Mathf.Clamp(_pitch, _verticalClampMin, _verticalClampMax);

        // Calculate desired position
        Quaternion rotation = Quaternion.Euler(_pitch, _yaw, 0f);
        Vector3 pivotPosition = _target.position +
                                _target.TransformDirection(_shoulderOffset);
        Vector3 desiredPosition = pivotPosition - rotation * Vector3.forward * _defaultDistance;

        // Collision detection
        float targetDistance = _defaultDistance;
        if (Physics.SphereCast(pivotPosition,
                              _collisionRadius,
                              (desiredPosition - pivotPosition).normalized,
                              out RaycastHit hit,
                              _defaultDistance,
                              _collisionLayers))
        {
            targetDistance = hit.distance - _collisionRadius;
            targetDistance = Mathf.Max(targetDistance, _minDistance);
        }

        _currentDistance = Mathf.Lerp(_currentDistance, targetDistance,
                                       _collisionRecoverySpeed * Time.deltaTime);

        // Apply
        Vector3 finalPosition = pivotPosition - rotation * Vector3.forward * _currentDistance;
        transform.position = finalPosition;
        transform.LookAt(pivotPosition);
    }
}
```

### 6. Lighting Design

#### Lighting Techniques for 3D Games
| Technique | Description | Use Case |
|-----------|-------------|----------|
| **Baked Lightmaps** | Pre-computed GI stored in textures | Static environments, mobile |
| **Realtime Direct** | Dynamic lights computed per frame | Moving lights, day/night |
| **Light Probes** | Sample points for dynamic object GI | Characters in baked scenes |
| **Reflection Probes** | Cubemap captures for reflections | Metallic/glossy surfaces |
| **Screen-Space GI** | Approximate GI from screen depth | Medium quality, real-time |
| **Ray-Traced GI** | Full path tracing for GI | High-end PC, next-gen console |
| **Volumetric Lighting** | Light shafts, fog scattering | Atmosphere, mood |
| **Emissive Materials** | Self-lit surfaces as light sources | Neon, magic, UI elements |
| **Area Lights** | Soft shadows from area sources | Interior scenes, realism |

### 7. Level of Detail (LOD) Systems

```
LOD Strategy:
│
├── LOD 0 (Near): Full detail mesh
│   └── Distance: 0-15m | Budget: 10,000-50,000 tris
│
├── LOD 1 (Medium): Reduced detail
│   └── Distance: 15-40m | Budget: 5,000-15,000 tris
│
├── LOD 2 (Far): Simplified mesh
│   └── Distance: 40-100m | Budget: 1,000-5,000 tris
│
├── LOD 3 (Very Far): Billboard or impostor
│   └── Distance: 100-300m | Budget: 8-64 tris
│
└── Culled: Not rendered
    └── Distance: 300m+

Modern Approaches:
├── Nanite (UE5): Automatic virtualized geometry, no manual LODs
├── Meshlet Rendering: GPU-driven LOD with mesh shaders
└── Impostor Baking: Pre-rendered billboards for distant objects
```

### 8. 3D Physics & Collision

```
Collision Shapes (Cost Low → High):
├── Sphere — Fastest, good for projectiles, items
├── Capsule — Characters, NPCs
├── Box (AABB) — Crates, buildings, zones
├── Box (OBB) — Rotated boxes
├── Convex Hull — Approximate complex shapes (max 255 verts)
├── Compound — Multiple primitives combined
└── Triangle Mesh — Exact geometry (static only, expensive)

Collision Detection Phases:
1. Broad Phase: AABB overlap tests (spatial hash, BVH, sweep-and-prune)
2. Narrow Phase: Exact shape intersection (GJK, EPA algorithms)
3. Resolution: Separate overlapping objects, apply impulses

Tips:
- Use simple colliders (sphere, capsule, box) wherever possible
- Use layers/masks to skip unnecessary collision checks
- Compound colliders > mesh colliders for dynamic objects
- Separate collision geometry from render geometry
```

---

## Performance Budgets

| Platform | Target FPS | Triangle Budget/Frame | Draw Calls | Texture Memory |
|----------|-----------|----------------------|------------|----------------|
| **High-End PC** | 60-144 | 5-10 million | 2000-5000 | 4-8 GB |
| **PS5/Xbox Series X** | 60 (Quality: 30) | 3-8 million | 2000-3000 | 4-6 GB |
| **Nintendo Switch** | 30 (docked) | 500K-1M | 500-1000 | 1-2 GB |
| **Mobile (High)** | 60 | 200K-500K | 100-300 | 512 MB-1 GB |
| **Mobile (Low)** | 30 | 50K-150K | 50-150 | 256-512 MB |
| **VR** | 72-120 | 1-2M per eye | 500-1000 | 2-4 GB |

---

## Example Prompt for AI-Assisted 3D Development

```
You are a 3D Game Developer. I'm building a third-person fantasy RPG
targeting PC and PS5 using Unreal Engine 5. Help me with:

1. Design the rendering setup: Nanite + Lumen configuration for a
   medieval forest environment with day/night cycle and weather
2. Create a 3D asset pipeline spec: poly budgets, texture specs,
   naming conventions, and LOD requirements for characters, props,
   and environments
3. Implement a third-person camera system with collision avoidance,
   lock-on targeting, and cinematic transitions
4. Design the lighting setup: baked + realtime hybrid approach for
   both outdoor and indoor (dungeon) environments
5. Create a material library structure: master materials for terrain,
   characters, foliage, water, and VFX with instance parameters

For each topic provide:
- Technical specifications and budgets
- Implementation approach with code/Blueprints
- Platform-specific optimizations
- Visual quality vs. performance trade-offs
```
