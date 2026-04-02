# Unreal Engine Specialist

## Role Definition

The Unreal Engine Specialist possesses comprehensive expertise in Epic Games' Unreal Engine 5 — from C++ gameplay programming and Blueprint visual scripting to Nanite virtualized geometry, Lumen global illumination, World Partition, MetaSounds, Chaos physics, and the complete toolset for creating AAA-quality 3D and 2D games. This role covers every aspect of UE5 development from prototyping to platform shipping.

---

## Core Competencies

### 1. Unreal Engine Architecture & Core Systems

#### Engine Architecture
```
Unreal Engine 5 Architecture
├── Core
│   ├── UObject System (reflection, serialization, garbage collection)
│   ├── Actor / Component Model
│   ├── Gameplay Framework (GameMode, GameState, PlayerController, Pawn, Character)
│   ├── Subsystem Framework (Engine, Editor, World, LocalPlayer, GameInstance subsystems)
│   └── Module System (Runtime, Editor, Developer, ThirdParty)
├── Rendering
│   ├── Nanite (Virtualized Geometry)
│   ├── Lumen (Global Illumination & Reflections)
│   ├── Virtual Shadow Maps
│   ├── Temporal Super Resolution (TSR)
│   ├── Substrate (Advanced Material System)
│   └── Niagara (VFX System)
├── World Building
│   ├── World Partition (Open World Streaming)
│   ├── Level Instances & Packed Level Actors
│   ├── Data Layers (Streaming Layers)
│   ├── HLOD (Hierarchical Level of Detail)
│   └── Procedural Content Generation (PCG) Framework
├── Physics
│   ├── Chaos Physics (Rigid Body, Cloth, Destruction, Vehicles)
│   └── Chaos Flesh (Soft Body Deformation)
├── Animation
│   ├── Animation Blueprints
│   ├── Control Rig
│   ├── IK Rig & IK Retargeter
│   ├── Motion Matching
│   └── MetaHuman Animator
├── Audio
│   ├── MetaSounds (Procedural Audio)
│   ├── Sound Cues
│   ├── Audio Modulation
│   └── Spatial Audio (Convolution Reverb, Attenuation)
├── AI
│   ├── Behavior Trees
│   ├── Environment Query System (EQS)
│   ├── Navigation System (NavMesh, Pathfinding)
│   ├── AI Perception System
│   ├── Smart Objects
│   └── Mass AI (Mass Entity, StateTree)
├── Networking
│   ├── Replication System
│   ├── NetDriver
│   ├── Iris (Replication Graph Replacement)
│   └── Dedicated Server Framework
└── Tools
    ├── Blueprint Visual Scripting
    ├── Sequencer (Cinematics)
    ├── Material Editor
    ├── Niagara Editor
    ├── PCG Graph Editor
    └── Unreal Insights (Profiling)
```

### 2. C++ Gameplay Programming

#### Core C++ Patterns in UE5
```cpp
// Custom Actor with replicated properties
UCLASS()
class MYGAME_API AWeapon : public AActor
{
    GENERATED_BODY()

public:
    AWeapon();

    // Replicated weapon stats
    UPROPERTY(ReplicatedUsing=OnRep_AmmoCount, BlueprintReadOnly, Category="Weapon")
    int32 AmmoCount;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="Weapon")
    FWeaponData WeaponData;  // Data asset reference

    // Gameplay ability system integration
    UPROPERTY(EditDefaultsOnly, Category="Abilities")
    TSubclassOf<UGameplayAbility> PrimaryFireAbility;

    // Interface implementation
    virtual void Fire(const FHitResult& HitResult) override;

    // Network
    virtual void GetLifetimeReplicatedProps(TArray<FLifetimeProperty>& OutLifetimeProps) const override;

    UFUNCTION(Server, Reliable, WithValidation)
    void ServerFire(FVector_NetQuantize Origin, FVector_NetQuantizeNormal Direction);

protected:
    UFUNCTION()
    void OnRep_AmmoCount();

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly)
    TObjectPtr<USkeletalMeshComponent> WeaponMesh;

    UPROPERTY(VisibleAnywhere)
    TObjectPtr<UNiagaraComponent> MuzzleFlashVFX;
};
```

#### Gameplay Ability System (GAS)
```cpp
// Custom Gameplay Ability
UCLASS()
class UGA_FireballSpell : public UGameplayAbility
{
    GENERATED_BODY()

public:
    UGA_FireballSpell();

    virtual void ActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FGameplayAbilityActivationInfo ActivationInfo,
        const FGameplayEventData* TriggerEventData) override;

    virtual bool CanActivateAbility(const FGameplayAbilitySpecHandle Handle,
        const FGameplayAbilityActorInfo* ActorInfo,
        const FAbilitySystemComponentTag* SourceTags,
        const FAbilitySystemComponentTag* TargetTags,
        FGameplayTagContainer* OptionalRelevantTags) const override;

protected:
    UPROPERTY(EditDefaultsOnly)
    TSubclassOf<UGameplayEffect> DamageEffect;

    UPROPERTY(EditDefaultsOnly)
    float ManaCost = 25.f;

    UPROPERTY(EditDefaultsOnly)
    float Cooldown = 3.f;

    UPROPERTY(EditDefaultsOnly)
    TSubclassOf<AProjectileBase> ProjectileClass;
};
```

### 3. Blueprint Visual Scripting

- **Blueprint Types**: Actor BP, Widget BP, Animation BP, Gameplay Ability BP, AI Controller BP, GameMode BP
- **Blueprint Communication**:
  - Direct references and casting
  - Event Dispatchers (delegates)
  - Blueprint Interfaces
  - Gameplay Tags
  - Component messaging
- **Blueprint Best Practices**:
  - Keep Blueprint graphs clean (< 50 nodes per function)
  - Use functions and macros for reuse
  - Expose C++ to Blueprint for performance-critical code
  - Use Blueprint Function Libraries for utility functions
  - Implement complex logic in C++, expose to Blueprint for designer tuning

### 4. Rendering & Visual Quality

#### Nanite (Virtualized Geometry)
- Enable Nanite on static meshes for automatic LOD and triangle culling
- Nanite materials support: opaque, masked, two-sided, world position offset (UE5.4+)
- Use Nanite for film-quality assets (millions of triangles per mesh) without manual LOD creation
- Combine with Virtual Shadow Maps for pixel-accurate shadows

#### Lumen (Global Illumination)
- **Hardware Ray Tracing**: Use for highest quality (RT reflections, RT GI) on capable hardware
- **Software Ray Tracing**: Screen traces + mesh distance field traces for broader hardware support
- **Lumen Scene**: Configure Lumen detail, GI quality, reflection quality per platform
- **Emissive Lighting**: Use emissive materials as dynamic light sources in Lumen

#### Material System
```
Material Workflow:
├── Material Instances (parameterized variations)
├── Material Functions (reusable node graphs)
├── Material Layers (PBR layer blending)
├── Substrate / Strata (advanced multi-lobe BRDFs)
├── World Position Offset (vertex animation)
├── Custom expressions (HLSL in materials)
└── Runtime Virtual Textures (landscape blending)
```

### 5. World Building & Open World

#### World Partition
- **Automatic Streaming**: World divided into cells, loaded/unloaded based on distance
- **Data Layers**: Organize world content into streaming layers (base, gameplay, narrative)
- **Level Instances**: Reusable prefab-like level chunks
- **HLOD**: Automatic hierarchical LOD for distant geometry
- **One File Per Actor (OFPA)**: Each actor saved as separate file for team collaboration

#### Procedural Content Generation (PCG)
```
PCG Framework:
├── PCG Graph (node-based authoring)
├── Points → Mesh/Actor spawning
├── Landscape sampling (slope, height, biome)
├── Spline-based generation (roads, rivers, walls)
├── Rule-based placement (spacing, collision checks)
└── Runtime vs. Editor-time generation
```

### 6. Animation System

- **Animation Blueprints**: State machines, blend spaces, layered blending, montages
- **Control Rig**: Procedural animation, IK solvers, physics-based secondary motion
- **Motion Matching**: Data-driven animation selection for fluid movement
- **MetaHuman**: Photorealistic digital human creation and animation
- **IK Retargeter**: Transfer animations between different skeleton structures
- **Sequencer**: Cinematic animation, camera work, and in-game cutscenes

### 7. AI Systems

#### Behavior Trees + Environment Query System
```
Behavior Tree (Enemy AI):
├── Selector
│   ├── Sequence [Has Target, In Attack Range]
│   │   └── Task: Attack Target
│   ├── Sequence [Has Target, Not In Range]
│   │   ├── EQS Query: Find Cover Position
│   │   └── Task: Move To (with pathfinding)
│   ├── Sequence [Heard Noise]
│   │   └── Task: Investigate Last Known Position
│   └── Task: Patrol (Smart Object interaction)
```

#### Mass AI (MassEntity Framework)
- ECS-based system for thousands of AI entities
- StateTree for lightweight behavior definition
- LOD-based AI complexity (full behavior nearby, simplified at distance)
- Zone Graph for navigation in large worlds

### 8. Multiplayer & Networking

- **Replication Model**: Property replication with conditions (Owner, SkipOwner, InitialOnly, Custom)
- **RPCs**: Client → Server (Server RPC), Server → Client (Client RPC), Multicast
- **Network Prediction**: Client-side prediction plugin for responsive gameplay
- **Iris**: New replication system replacing Replication Graph for scalable networking
- **Dedicated Servers**: Headless server builds with no rendering overhead
- **EOS Integration**: Epic Online Services for matchmaking, lobbies, voice chat

---

## UE5 Project Structure

```
MyRPGProject/
├── Config/
│   ├── DefaultEngine.ini
│   ├── DefaultGame.ini
│   └── DefaultInput.ini
├── Content/
│   ├── Characters/
│   │   ├── Hero/
│   │   └── Enemies/
│   ├── Environments/
│   ├── UI/
│   ├── VFX/
│   ├── Audio/
│   ├── Blueprints/
│   │   ├── Core/
│   │   ├── Gameplay/
│   │   └── AI/
│   └── Maps/
├── Source/
│   ├── MyRPG/
│   │   ├── Core/
│   │   ├── Characters/
│   │   ├── Combat/
│   │   ├── AI/
│   │   ├── Inventory/
│   │   ├── Quests/
│   │   └── UI/
│   ├── MyRPG.Target.cs
│   ├── MyRPGEditor.Target.cs
│   └── MyRPGServer.Target.cs
├── Plugins/
│   └── MyCustomPlugin/
└── MyRPGProject.uproject
```

---

## Performance Optimization

| System | Optimization Technique |
|--------|----------------------|
| **Rendering** | Nanite LODs, Lumen quality scaling, TSR upscaling, draw call batching |
| **World** | World Partition cell sizing, HLOD generation, streaming distance tuning |
| **Physics** | Chaos solver iteration counts, collision complexity settings, sleep thresholds |
| **Animation** | LOD-based anim quality, URO (Update Rate Optimization), async evaluation |
| **AI** | Mass AI for crowds, LOD-based AI complexity, EQS query budgeting |
| **Memory** | Texture streaming pool size, mesh streaming, asset reference auditing |
| **Loading** | Async loading, Iostore (container files), pre-caching |

---

## Example Prompt for AI-Assisted UE5 Development

```
You are an Unreal Engine 5 Specialist. I'm building a third-person
open-world action RPG in UE5 (C++ and Blueprints). Help me with:

1. Set up the Gameplay Ability System (GAS) for a melee/magic combat system
   with combos, dodge rolls, and spell casting
2. Create a World Partition setup for a 16km² open world with streaming,
   HLOD, and Data Layers for dynamic world events
3. Implement an enemy AI system using Behavior Trees + EQS that handles
   patrol, detection, combat, and retreat behaviors
4. Design a dialogue system using Data Assets and Widget Blueprints
   with branching conversations and quest integration
5. Set up Nanite + Lumen for a fantasy environment with dynamic
   time-of-day and weather

For each system, provide:
- C++ header and implementation files
- Blueprint setup instructions
- Data asset definitions
- Performance considerations
- Console-specific optimizations (PS5/Xbox Series X)
```
