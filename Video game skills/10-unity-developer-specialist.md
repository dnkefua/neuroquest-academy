# Unity Developer Specialist

## Role Definition

The Unity Developer Specialist possesses deep expertise across the entire Unity ecosystem — from traditional MonoBehaviour/GameObject workflows to the high-performance DOTS (Data-Oriented Technology Stack) with ECS, the Job System, and Burst Compiler. This role covers 2D and 3D game development, Universal/HDRP render pipelines, UI Toolkit, Addressables, multiplayer via Netcode for GameObjects/Entities, and the full publishing pipeline across all platforms.

---

## Core Competencies

### 1. Unity Architecture & Core Systems

#### Unity Runtime Architecture
```
Unity Engine Architecture
├── Core Runtime
│   ├── GameObject / Component System (MonoBehaviour)
│   ├── DOTS (Data-Oriented Technology Stack)
│   │   ├── Entities (ECS)
│   │   ├── Jobs System (multi-threaded work)
│   │   ├── Burst Compiler (SIMD-optimized native code)
│   │   └── Collections (NativeArray, NativeList, NativeHashMap)
│   ├── ScriptableObject System
│   ├── Serialization System
│   └── Asset Database / Addressables
├── Rendering
│   ├── Universal Render Pipeline (URP)
│   ├── High Definition Render Pipeline (HDRP)
│   ├── Built-in Render Pipeline (Legacy)
│   ├── Shader Graph
│   ├── VFX Graph (GPU particles)
│   ├── Sprite Renderer / Tilemap
│   └── Post-Processing Stack
├── Physics
│   ├── PhysX (3D physics)
│   ├── Box2D (2D physics)
│   └── Unity Physics (DOTS-based)
├── Animation
│   ├── Animator Controller (Mecanim)
│   ├── Animation Rigging
│   ├── Timeline (Cinematic sequencing)
│   └── DOTS Animation
├── Audio
│   ├── AudioSource / AudioListener
│   ├── Audio Mixer
│   └── DSP integration (FMOD, Wwise)
├── UI
│   ├── UI Toolkit (Runtime + Editor)
│   ├── uGUI (Canvas-based)
│   └── TextMeshPro
├── AI / Navigation
│   ├── NavMesh (pathfinding)
│   ├── NavMesh Agents / Obstacles
│   └── ML-Agents (reinforcement learning)
├── Networking
│   ├── Netcode for GameObjects
│   ├── Netcode for Entities (DOTS)
│   ├── Unity Transport Layer
│   └── Unity Relay / Lobby Services
└── Services
    ├── Unity Gaming Services (UGS)
    ├── Cloud Build
    ├── Analytics
    ├── Remote Config
    └── Cloud Save
```

### 2. C# Gameplay Programming

#### MonoBehaviour Patterns
```csharp
// Example: Combat system with events and ScriptableObjects
[RequireComponent(typeof(HealthComponent))]
public class CombatController : MonoBehaviour
{
    [Header("Combat Settings")]
    [SerializeField] private WeaponData _defaultWeapon;
    [SerializeField] private LayerMask _hitLayers;
    [SerializeField] private float _attackCooldown = 0.5f;

    // Events for decoupled communication
    public event Action<DamageResult> OnDamageDealt;
    public event Action<DamageResult> OnDamageTaken;
    public event Action OnWeaponChanged;

    private WeaponData _currentWeapon;
    private float _lastAttackTime;
    private HealthComponent _health;
    private Animator _animator;

    // Object pooling for projectiles
    private static readonly Dictionary<int, Queue<Projectile>> _projectilePool = new();

    private void Awake()
    {
        _health = GetComponent<HealthComponent>();
        _animator = GetComponentInChildren<Animator>();
        _currentWeapon = _defaultWeapon;
    }

    public void Attack(Vector3 direction)
    {
        if (Time.time - _lastAttackTime < _attackCooldown) return;

        _lastAttackTime = Time.time;
        _animator.SetTrigger(_currentWeapon.AttackAnimTrigger);

        switch (_currentWeapon.AttackType)
        {
            case AttackType.Melee:
                PerformMeleeAttack(direction);
                break;
            case AttackType.Ranged:
                PerformRangedAttack(direction);
                break;
            case AttackType.Magic:
                PerformMagicAttack(direction);
                break;
        }
    }

    private void PerformMeleeAttack(Vector3 direction)
    {
        var hits = Physics.SphereCastNonAlloc(
            transform.position,
            _currentWeapon.AttackRadius,
            direction,
            _hitBuffer,
            _currentWeapon.AttackRange,
            _hitLayers
        );

        for (int i = 0; i < hits; i++)
        {
            if (_hitBuffer[i].collider.TryGetComponent<IDamageable>(out var target))
            {
                var damage = _currentWeapon.CalculateDamage();
                var result = target.TakeDamage(damage, transform.position);
                OnDamageDealt?.Invoke(result);
            }
        }
    }

    private readonly RaycastHit[] _hitBuffer = new RaycastHit[16];
}
```

#### ScriptableObject Data Architecture
```csharp
// Data-driven weapon definitions
[CreateAssetMenu(fileName = "New Weapon", menuName = "RPG/Weapon Data")]
public class WeaponData : ScriptableObject
{
    [Header("Identity")]
    public string WeaponName;
    public Sprite Icon;
    public GameObject Prefab;
    public WeaponType Type;
    public Rarity Rarity;

    [Header("Combat Stats")]
    public float BaseDamage = 10f;
    public float AttackSpeed = 1f;
    public float AttackRange = 2f;
    public float AttackRadius = 0.5f;
    public AttackType AttackType;
    public DamageType DamageType;

    [Header("Scaling")]
    public AnimationCurve DamageScaling;  // Damage multiplier by player level

    [Header("Animation")]
    public string AttackAnimTrigger = "Attack";
    public AnimatorOverrideController AnimOverride;

    [Header("Effects")]
    public GameObject HitVFX;
    public AudioClip[] HitSounds;
    public float ScreenShakeIntensity = 0.2f;

    public DamageData CalculateDamage(int playerLevel = 1, float bonusDamage = 0)
    {
        float scaledDamage = BaseDamage * DamageScaling.Evaluate(playerLevel) + bonusDamage;
        return new DamageData(scaledDamage, DamageType, this);
    }
}
```

### 3. DOTS (Data-Oriented Technology Stack)

#### ECS Architecture
```csharp
// Component: Pure data, no behavior
public struct EnemyComponent : IComponentData
{
    public float DetectionRange;
    public float AttackRange;
    public float MoveSpeed;
    public float Health;
    public EnemyState State;
}

public struct TargetComponent : IComponentData
{
    public Entity Target;
    public float DistanceToTarget;
}

// System: Pure logic, operates on components
[BurstCompile]
public partial struct EnemyAISystem : ISystem
{
    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        var playerPosition = GetPlayerPosition(ref state);
        var deltaTime = SystemAPI.Time.DeltaTime;

        // Process all enemies in parallel using Burst-compiled job
        new EnemyAIJob
        {
            PlayerPosition = playerPosition,
            DeltaTime = deltaTime
        }.ScheduleParallel();
    }
}

[BurstCompile]
public partial struct EnemyAIJob : IJobEntity
{
    public float3 PlayerPosition;
    public float DeltaTime;

    void Execute(
        ref LocalTransform transform,
        ref EnemyComponent enemy,
        ref TargetComponent target)
    {
        float distance = math.distance(transform.Position, PlayerPosition);
        target.DistanceToTarget = distance;

        switch (enemy.State)
        {
            case EnemyState.Idle:
                if (distance < enemy.DetectionRange)
                    enemy.State = EnemyState.Chasing;
                break;

            case EnemyState.Chasing:
                if (distance < enemy.AttackRange)
                {
                    enemy.State = EnemyState.Attacking;
                }
                else
                {
                    float3 direction = math.normalize(PlayerPosition - transform.Position);
                    transform.Position += direction * enemy.MoveSpeed * DeltaTime;
                }
                break;

            case EnemyState.Attacking:
                if (distance > enemy.AttackRange * 1.2f)
                    enemy.State = EnemyState.Chasing;
                break;
        }
    }
}
```

### 4. Render Pipelines

#### Universal Render Pipeline (URP)
- **Target**: Mobile, VR, mid-range PCs, Nintendo Switch
- **Features**: 2D Renderer, Forward/Forward+ rendering, screen-space ambient occlusion, post-processing, custom render passes
- **Shader Graph**: Node-based shader authoring (PBR, Unlit, Sprite, custom)
- **2D Lighting**: Sprite lights, shadow casters, normal maps for 2D sprites

#### High Definition Render Pipeline (HDRP)
- **Target**: High-end PC, PS5, Xbox Series X
- **Features**: Physically-based rendering, ray tracing (reflections, GI, shadows, AO), volumetric fog/clouds, DLSS/FSR/XeSS support
- **Visual Environment**: Physically-based sky, fog, exposure control
- **Custom Passes**: Full Frame Graph API for custom render passes

### 5. 2D Game Development

```
Unity 2D Toolkit:
├── Sprite Renderer & Sprite Atlas (batching)
├── Tilemap System
│   ├── Rectangular, Hexagonal, Isometric grids
│   ├── Rule Tiles (auto-tiling)
│   ├── Animated Tiles
│   └── Tilemap Collider 2D
├── 2D Animation
│   ├── Sprite Swap (frame-by-frame)
│   ├── 2D Skeletal Animation (bones, IK)
│   ├── Sprite Shape (deformable sprites)
│   └── 2D PSD Importer (Photoshop layers → bones)
├── 2D Physics (Box2D)
│   ├── Rigidbody2D, Collider2D
│   ├── Effectors (area, buoyancy, platform, surface)
│   └── Joints (spring, hinge, distance, slider)
├── 2D Lighting (URP)
│   ├── Point Light 2D, Spot Light 2D, Global Light 2D
│   ├── Shadow Caster 2D
│   └── Normal Map support for sprites
└── Cinemachine 2D
    ├── Virtual Camera (follow, confiner, dead zones)
    ├── Screen shake
    └── Camera blending
```

### 6. UI Development

#### UI Toolkit (Modern Approach)
```xml
<!-- UXML Layout -->
<ui:UXML xmlns:ui="UnityEngine.UIElements">
  <ui:VisualElement class="inventory-panel">
    <ui:Label text="Inventory" class="panel-title" />
    <ui:ScrollView class="item-grid">
      <!-- Items populated via C# -->
    </ui:ScrollView>
    <ui:VisualElement class="item-details">
      <ui:Label name="item-name" />
      <ui:Label name="item-description" />
      <ui:Button name="equip-button" text="Equip" />
    </ui:VisualElement>
  </ui:VisualElement>
</ui:UXML>
```

```css
/* USS Stylesheet */
.inventory-panel {
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 16px;
}

.item-grid {
  flex-grow: 1;
  flex-wrap: wrap;
  flex-direction: row;
}

.inventory-slot {
  width: 64px;
  height: 64px;
  margin: 4px;
  border-width: 2px;
  border-color: #444;
  border-radius: 4px;
  transition-duration: 0.2s;
}

.inventory-slot:hover {
  border-color: #FFD700;
  scale: 1.1;
}
```

### 7. Asset Management & Addressables

```csharp
// Addressables for efficient asset loading
public class AssetManager : MonoBehaviour
{
    // Load asset asynchronously
    public async Task<T> LoadAssetAsync<T>(string address) where T : Object
    {
        var handle = Addressables.LoadAssetAsync<T>(address);
        await handle.Task;

        if (handle.Status == AsyncOperationStatus.Succeeded)
            return handle.Result;

        Debug.LogError($"Failed to load asset: {address}");
        return null;
    }

    // Instantiate prefab from Addressables
    public async Task<GameObject> SpawnAsync(AssetReference reference, Vector3 position)
    {
        var handle = reference.InstantiateAsync(position, Quaternion.identity);
        return await handle.Task;
    }

    // Load scene additively
    public async Task LoadSceneAsync(string sceneAddress)
    {
        await Addressables.LoadSceneAsync(sceneAddress, LoadSceneMode.Additive).Task;
    }
}
```

### 8. Multiplayer (Netcode for GameObjects)

```csharp
// Networked player controller
public class NetworkedPlayer : NetworkBehaviour
{
    [Header("Movement")]
    [SerializeField] private float _moveSpeed = 5f;

    // Synchronized across network
    private NetworkVariable<PlayerState> _state = new(
        writePerm: NetworkVariableWritePermission.Owner);

    private NetworkVariable<int> _health = new(
        value: 100,
        writePerm: NetworkVariableWritePermission.Server);

    public override void OnNetworkSpawn()
    {
        if (IsOwner)
        {
            // Setup local player camera, input, etc.
            SetupLocalPlayer();
        }

        _health.OnValueChanged += OnHealthChanged;
    }

    private void Update()
    {
        if (!IsOwner) return;
        HandleMovement();
    }

    [Rpc(SendTo.Server)]
    private void AttackServerRpc(Vector3 direction)
    {
        // Server validates and processes attack
        if (ValidateAttack(direction))
        {
            ProcessAttack(direction);
            // Notify all clients
            AttackVisualClientRpc(direction);
        }
    }

    [Rpc(SendTo.Everyone)]
    private void AttackVisualClientRpc(Vector3 direction)
    {
        // Play attack animation and VFX on all clients
        PlayAttackEffects(direction);
    }
}
```

---

## Unity Project Structure

```
MyRPG/
├── Assets/
│   ├── _Project/           # Project-specific assets
│   │   ├── Scripts/
│   │   │   ├── Core/       # Singletons, managers, utilities
│   │   │   ├── Characters/ # Player, NPC, enemy scripts
│   │   │   ├── Combat/     # Weapons, abilities, damage
│   │   │   ├── Inventory/  # Items, equipment, crafting
│   │   │   ├── Quests/     # Quest system
│   │   │   ├── AI/         # Enemy AI, behavior trees
│   │   │   ├── UI/         # UI controllers
│   │   │   ├── World/      # Environment, interactables
│   │   │   └── Data/       # ScriptableObjects, configs
│   │   ├── Art/
│   │   │   ├── Models/
│   │   │   ├── Textures/
│   │   │   ├── Materials/
│   │   │   ├── Animations/
│   │   │   └── VFX/
│   │   ├── Audio/
│   │   ├── Prefabs/
│   │   ├── Scenes/
│   │   ├── UI/             # UXML, USS, UI assets
│   │   └── Resources/      # Runtime-loaded assets
│   ├── Plugins/            # Third-party plugins
│   ├── StreamingAssets/    # Platform-specific data
│   └── AddressableAssetsData/
├── Packages/               # Package manifest
├── ProjectSettings/
└── Tests/
    ├── EditMode/
    └── PlayMode/
```

---

## Performance Optimization Checklist

| Area | Technique |
|------|-----------|
| **CPU** | Object pooling, avoid per-frame allocations, use DOTS for massive entity counts |
| **GPU** | Sprite atlases, draw call batching, LOD groups, occlusion culling, shader LOD |
| **Memory** | Addressables for on-demand loading, texture compression, mesh compression |
| **Physics** | Layer-based collision filtering, simplified colliders, physics rate decoupling |
| **UI** | Canvas splitting (static/dynamic), disable Raycast Target on non-interactive elements |
| **Loading** | Async scene loading, Addressables preloading, asset bundles |
| **GC** | Avoid boxing, use struct over class for value types, pool collections |
| **Profiling** | Unity Profiler, Frame Debugger, Memory Profiler, Profile Analyzer |

---

## Example Prompt for AI-Assisted Unity Development

```
You are a Unity Developer Specialist. I'm building a 2.5D action RPG
in Unity using URP. Target platforms: PC, PS5, Nintendo Switch, and Mobile.

Help me implement:
1. A responsive combat system with melee combos, dodge rolling, and
   ranged attacks using the animation state machine
2. An inventory system using ScriptableObjects for item data, UI Toolkit
   for the interface, and drag-and-drop support
3. A dialogue system with branching conversations, quest integration,
   and localization support
4. An enemy AI system using state machines with patrol, chase, attack,
   and flee behaviors, NavMesh pathfinding
5. A save/load system using JSON serialization that handles scene state,
   inventory, quest progress, and player stats

For each system:
- Provide complete C# scripts with proper Unity patterns
- Use ScriptableObjects for data-driven design
- Include Editor tools where helpful
- Optimize for all target platforms (Switch has the tightest budget)
- Follow Unity best practices (object pooling, event-driven, etc.)
```
