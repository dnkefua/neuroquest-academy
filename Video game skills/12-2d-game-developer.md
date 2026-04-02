# 2D Game Developer

## Role Definition

The 2D Game Developer specializes in creating compelling two-dimensional interactive experiences — from pixel art platformers and top-down RPGs to side-scrolling action games, visual novels, and mobile puzzle games. This role covers sprite animation, tile-based world design, 2D physics, parallax scrolling, 2D lighting, UI design, and the unique optimization challenges of 2D rendering across platforms.

---

## Core Competencies

### 1. 2D Art Styles & Production

#### Art Style Categories
| Style | Description | Examples | Tools |
|-------|-------------|----------|-------|
| **Pixel Art** | Low-resolution grid-based art with deliberate pixel placement | Celeste, Stardew Valley, Dead Cells | Aseprite, LibreSprite, Piskel, GraphicsGale |
| **Vector Art** | Scalable, clean-line art with smooth curves | Hollow Knight, Ori, Cuphead (hand-drawn) | Inkscape, Illustrator, Affinity Designer |
| **Hand-Drawn / Painted** | Organic, textured artwork with visible brushstrokes | Cuphead, Gris, Spiritfarer | Krita, Photoshop, Procreate, Clip Studio |
| **Paper / Cutout** | Layered flat shapes with parallax depth | Rayman Legends, Paper Mario | Photoshop, After Effects, Spine |
| **Minimalist** | Clean geometric shapes, limited palette | Thomas Was Alone, VVVVVV | Any vector or pixel tool |

#### Sprite Sheet Design
```
Sprite Sheet Organization:
├── Character Sprites
│   ├── Idle (4-8 frames, loop)
│   ├── Walk (6-12 frames, loop)
│   ├── Run (6-8 frames, loop)
│   ├── Jump (3-5 frames: anticipation, rise, fall, land)
│   ├── Attack (4-8 frames per attack type)
│   ├── Hit / Hurt (2-4 frames)
│   ├── Death (6-10 frames)
│   ├── Dash / Roll (4-6 frames)
│   └── Special (varies)
├── Enemy Sprites
│   └── Same categories as character, per enemy type
├── Environment Tiles
│   ├── Ground (top, middle, bottom, corners, edges)
│   ├── Walls (vertical edges, corners, inner corners)
│   ├── Platforms (one-way, moving, crumbling)
│   ├── Decorations (bushes, rocks, signs, lamps)
│   └── Interactive (doors, chests, switches, breakables)
├── VFX Sprites
│   ├── Slash effects, hit sparks, explosions
│   ├── Magic particles, elemental effects
│   └── Dust puffs, water splashes, smoke
└── UI Elements
    ├── Health bar, mana bar, stamina bar
    ├── Inventory slots, item icons
    ├── Button prompts, dialogue boxes
    └── Menu backgrounds, borders, cursors
```

### 2. Tile-Based Level Design

#### Tilemap Systems
```
Tilemap Architecture:
├── Tile Layers (bottom to top)
│   ├── Background (sky, distant mountains, clouds)
│   ├── Background Detail (parallax layers)
│   ├── Terrain Back (behind player: walls, waterfalls)
│   ├── Terrain Main (solid ground, platforms) + Collision
│   ├── Terrain Front (foreground: grass, vines over terrain)
│   ├── Objects (interactables, items, NPCs — often not tiles)
│   └── Foreground (overlay: fog, tree canopy, rain)
│
├── Auto-Tiling Rules
│   ├── 4-bit (16 tile variants: basic cardinal neighbors)
│   ├── 8-bit / Blob (47 tile variants: corners + edges)
│   ├── Wang Tiles (edge-matching for seamless patterns)
│   └── Rule Tiles (Unity) / Terrains (Godot) for auto-selection
│
├── Tile Properties
│   ├── Collision type (solid, one-way, ladder, water, hazard)
│   ├── Animation (animated tiles: water, lava, torches)
│   ├── Friction / Slipperiness
│   └── Custom data (biome, damage, sound on step)
│
└── Level Editor Tools
    ├── Tiled Map Editor (TMX format, free, universal)
    ├── LDtk (Level Designer Toolkit by Dead Cells creator)
    ├── Unity Tilemap + Rule Tiles
    ├── Godot TileMap with TileSet editor
    └── Custom in-game editors
```

### 3. 2D Physics & Platformer Mechanics

#### Platformer Character Controller
```csharp
// Responsive 2D platformer controller
public class PlatformerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private float _maxSpeed = 8f;
    [SerializeField] private float _acceleration = 50f;
    [SerializeField] private float _deceleration = 40f;
    [SerializeField] private float _airAcceleration = 30f;
    [SerializeField] private float _turnSpeed = 80f;  // Faster decel when changing direction

    [Header("Jump")]
    [SerializeField] private float _jumpForce = 14f;
    [SerializeField] private float _jumpCutMultiplier = 0.5f;  // Short hop
    [SerializeField] private float _coyoteTime = 0.1f;         // Jump after leaving edge
    [SerializeField] private float _jumpBufferTime = 0.12f;     // Pre-land jump input
    [SerializeField] private float _fallGravityMultiplier = 1.5f;
    [SerializeField] private float _maxFallSpeed = 20f;

    [Header("Ground Check")]
    [SerializeField] private Transform _groundCheck;
    [SerializeField] private Vector2 _groundCheckSize = new(0.8f, 0.1f);
    [SerializeField] private LayerMask _groundLayer;

    private Rigidbody2D _rb;
    private float _coyoteTimer;
    private float _jumpBufferTimer;
    private bool _isGrounded;
    private bool _isJumping;

    private void Update()
    {
        // Ground detection
        _isGrounded = Physics2D.OverlapBox(
            _groundCheck.position, _groundCheckSize, 0f, _groundLayer);

        // Coyote time
        if (_isGrounded)
            _coyoteTimer = _coyoteTime;
        else
            _coyoteTimer -= Time.deltaTime;

        // Jump buffer
        if (Input.GetButtonDown("Jump"))
            _jumpBufferTimer = _jumpBufferTime;
        else
            _jumpBufferTimer -= Time.deltaTime;

        // Jump execution
        if (_jumpBufferTimer > 0 && _coyoteTimer > 0 && !_isJumping)
        {
            _rb.linearVelocity = new Vector2(_rb.linearVelocity.x, _jumpForce);
            _isJumping = true;
            _jumpBufferTimer = 0;
            _coyoteTimer = 0;
        }

        // Variable jump height (release to cut jump short)
        if (Input.GetButtonUp("Jump") && _rb.linearVelocity.y > 0)
        {
            _rb.linearVelocity = new Vector2(
                _rb.linearVelocity.x,
                _rb.linearVelocity.y * _jumpCutMultiplier);
        }

        if (_isGrounded && _rb.linearVelocity.y <= 0)
            _isJumping = false;
    }

    private void FixedUpdate()
    {
        float input = Input.GetAxisRaw("Horizontal");
        float targetSpeed = input * _maxSpeed;
        float currentSpeed = _rb.linearVelocity.x;

        float accelRate;
        if (_isGrounded)
        {
            // Use turn speed when changing direction
            bool changingDirection = (input > 0 && currentSpeed < 0) ||
                                     (input < 0 && currentSpeed > 0);
            accelRate = changingDirection ? _turnSpeed :
                       (Mathf.Abs(input) > 0.01f ? _acceleration : _deceleration);
        }
        else
        {
            accelRate = _airAcceleration;
        }

        float speedDiff = targetSpeed - currentSpeed;
        float movement = speedDiff * accelRate * Time.fixedDeltaTime;

        _rb.AddForce(Vector2.right * movement, ForceMode2D.Impulse);

        // Enhanced fall gravity
        if (!_isGrounded && _rb.linearVelocity.y < 0)
        {
            _rb.gravityScale = _fallGravityMultiplier;
            _rb.linearVelocity = new Vector2(
                _rb.linearVelocity.x,
                Mathf.Max(_rb.linearVelocity.y, -_maxFallSpeed));
        }
        else
        {
            _rb.gravityScale = 1f;
        }
    }
}
```

### 4. 2D Animation Techniques

#### Frame-by-Frame Animation
```
Animation Principles for 2D Games:
├── Squash & Stretch (jump anticipation, landing impact)
├── Anticipation (wind-up before action)
├── Follow-Through (hair, capes, weapons overshoot)
├── Ease In / Ease Out (smooth acceleration/deceleration)
├── Arcs (natural motion paths)
├── Timing (frame counts affect feel: snappy vs. weighty)
└── Exaggeration (game-feel over realism)

Frame Rate Guidelines:
├── Full animation: 24 fps (film-smooth)
├── Game standard: 12 fps (on 2s) for most character animations
├── Snappy actions: 8-10 fps (attacks, hits — fewer frames = more impactful)
├── Idle: 4-6 fps (subtle breathing, blinking)
└── Pixel art: Often 8-12 fps with held frames for style
```

#### Skeletal Animation (Spine / DragonBones)
```
Skeletal 2D Animation:
├── Advantages
│   ├── Smooth motion with fewer art assets
│   ├── Runtime blending between animations
│   ├── Procedural effects (IK, physics bones)
│   ├── Smaller file sizes than sprite sheets
│   └── Easy to iterate on animations
├── Tools
│   ├── Spine (industry standard, paid)
│   ├── DragonBones (free, open source)
│   ├── Unity 2D Animation (built-in, PSD Importer)
│   └── Godot Skeleton2D
└── Best Practices
    ├── Separate mesh for each body part
    ├── Overlap joints to hide seams
    ├── Use mesh deformation for organic movement
    ├── IK for feet/hands touching surfaces
    └── Combine with sprite-swap for attack frames
```

### 5. Parallax Scrolling & Depth

```
Parallax Layer Setup (back to front):
│
├── Layer 0: Sky gradient (static or very slow)     Speed: 0.0-0.1x
├── Layer 1: Distant mountains / clouds              Speed: 0.1-0.2x
├── Layer 2: Mid-ground hills / trees                Speed: 0.3-0.5x
├── Layer 3: Near background buildings / foliage     Speed: 0.6-0.8x
├── Layer 4: GAMEPLAY LAYER (1:1 with camera)        Speed: 1.0x
├── Layer 5: Near foreground (grass, particles)      Speed: 1.1-1.3x
└── Layer 6: Closest foreground (blur, vignette)     Speed: 1.3-1.5x

Implementation Techniques:
├── Transform-based: Move each layer at different speeds relative to camera
├── Shader-based: UV offset in fragment shader (GPU-efficient)
├── Infinite scrolling: Tile seamless textures, wrap at boundaries
└── Vertical parallax: Subtle Y-axis parallax for depth during jumping
```

### 6. 2D Lighting

#### Techniques
| Technique | Description | Engine Support |
|-----------|-------------|---------------|
| **Sprite Normal Maps** | Per-pixel lighting on 2D sprites using normal maps | Unity URP 2D, Godot, custom |
| **2D Light Sources** | Point, spot, and global lights affecting sprites | Unity URP 2D Renderer |
| **Shadow Casters** | Sprites/shapes that cast 2D shadows | Unity URP 2D, Godot |
| **Light Masks** | Darkness layer with light "holes" (roguelike fog of war) | Custom shader, Godot Light2D |
| **Emissive Sprites** | Self-illuminated elements (torches, magic, eyes) | Emission maps |
| **Ambient Gradient** | Background color shifts for time-of-day | Shader/color overlay |
| **Volumetric 2D** | Simulated light shafts using geometry or shaders | Custom shader |

### 7. 2D Game Genres & Design Patterns

#### Platformer Systems
```
Platformer Feature Checklist:
├── Core Movement
│   ├── Walk / Run (with acceleration curves)
│   ├── Jump (variable height, coyote time, jump buffer)
│   ├── Wall jump / Wall slide
│   ├── Dash (air/ground, directional)
│   └── Crouch / Slide
├── Level Mechanics
│   ├── Moving platforms
│   ├── One-way platforms (drop-through)
│   ├── Ladders / Ropes / Vines
│   ├── Springs / Bounce pads
│   ├── Conveyor belts
│   ├── Hazards (spikes, lava, projectiles)
│   └── Destructible terrain
├── Camera
│   ├── Smooth follow with dead zones
│   ├── Look-ahead in movement direction
│   ├── Camera rooms / screen boundaries
│   └── Screen shake on impact
└── Game Feel
    ├── Squash & stretch on jump/land
    ├── Dust particles on movement
    ├── Screen freeze on hit (hit stop)
    ├── Controller rumble
    └── Sound design sync with animations
```

#### Top-Down RPG Systems
```
Top-Down RPG Feature Checklist:
├── Movement
│   ├── 4-directional or 8-directional movement
│   ├── Collision with tilemap and objects
│   ├── NPC interaction (talk, trade, quest)
│   └── Vehicle / mount systems
├── World
│   ├── Multi-layer tilemap with auto-tiling
│   ├── Room/area transitions with fade/wipe
│   ├── Interactable objects (chests, doors, switches)
│   ├── Day/night cycle (color overlay, NPC schedules)
│   └── Weather effects (rain particles, lightning flash)
├── Combat (Turn-Based)
│   ├── Encounter triggers (random, visible, story)
│   ├── Battle scene with party and enemy layout
│   ├── Turn order system (speed-based, CTB, ATB)
│   ├── Attack / Magic / Item / Defend / Flee
│   ├── Status effects and buffs/debuffs
│   └── Experience and leveling
├── Combat (Action)
│   ├── Real-time attacks with hitboxes
│   ├── Dodge / Block / Parry
│   ├── Combo systems
│   └── Enemy AI patterns
├── Inventory
│   ├── Grid or list inventory
│   ├── Equipment slots (weapon, armor, accessory)
│   ├── Consumables (potions, scrolls, food)
│   └── Crafting system
├── Dialogue
│   ├── Text box with character portraits
│   ├── Branching choices
│   ├── Quest acceptance / completion
│   └── Shop interface
└── Progression
    ├── Experience points and level-ups
    ├── Skill trees or ability learning
    ├── Stat growth (HP, MP, STR, DEF, etc.)
    └── Equipment upgrades
```

---

## 2D Performance Optimization

| Technique | Description |
|-----------|-------------|
| **Sprite Atlasing** | Pack sprites into atlas textures to reduce draw calls |
| **Object Pooling** | Reuse projectiles, particles, enemies instead of instantiate/destroy |
| **Chunk-Based Loading** | Only load/render tiles and objects near the camera |
| **Camera Culling** | Don't process logic for off-screen entities |
| **Reduce Overdraw** | Minimize transparent sprite overlap (biggest 2D perf killer) |
| **Batch-Friendly Sorting** | Keep same-material sprites on same sorting layers |
| **Animation LOD** | Reduce animation frame rate for distant or off-screen sprites |
| **Tilemap Chunking** | Break large tilemaps into chunks for efficient rendering |

---

## Recommended 2D Tools

| Category | Tool | Notes |
|----------|------|-------|
| **Engine** | Unity (URP 2D), Godot 4, GameMaker | All excellent for 2D |
| **Pixel Art** | Aseprite, LibreSprite, Piskel | Aseprite is industry standard |
| **Digital Paint** | Krita, Clip Studio Paint | For hand-drawn styles |
| **Tilemap Editor** | LDtk, Tiled | Export to any engine |
| **Skeletal Anim** | Spine, DragonBones | Runtime blending support |
| **Level Design** | LDtk, Engine built-in | LDtk has Entity support |
| **VFX** | Aseprite (frame), Engine particles | Mix sprite VFX + particles |

---

## Example Prompt for AI-Assisted 2D Development

```
You are a 2D Game Developer. I'm building a pixel-art metroidvania in
Unity with URP 2D rendering. The game features:
- 16x16 pixel tile-based world with multiple interconnected areas
- Fluid platformer controls (wall jump, dash, double jump)
- Melee and ranged combat with multiple weapons
- RPG elements (stat upgrades, abilities, equipment)
- 2D dynamic lighting for atmosphere (torches, magic, darkness)

Help me implement:
1. A responsive platformer controller with all movement abilities,
   coyote time, jump buffering, and great game feel
2. A tilemap-based world system with room transitions, auto-tiling,
   and seamless area connections (metroidvania map)
3. A combat system with melee combos, ranged attacks, hit-stop,
   screen shake, and enemy knockback
4. A 2D lighting setup using URP 2D lights with normal-mapped sprites,
   shadow casters, and a darkness/fog-of-war system
5. An ability system that unlocks new movement abilities (wall jump,
   dash, double jump) that open previously inaccessible areas

Prioritize game feel and responsiveness in all implementations.
```
