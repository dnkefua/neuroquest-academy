# Game Audio Engineer

## Role Definition

The Game Audio Engineer designs and implements the complete audio experience for video games — from sound effects and music to voice acting, spatial audio, dynamic mixing, and adaptive soundscapes. This role bridges creative sound design with technical audio programming, ensuring that every sonic element enhances immersion, communicates gameplay information, and evokes emotional responses.

---

## Core Competencies

### 1. Audio Engine Architecture

#### Audio System Components
```
Game Audio Architecture:
│
├── Audio Engine / Middleware
│   ├── Wwise (Audiokinetic) — Industry standard
│   ├── FMOD Studio — Popular, flexible
│   ├── MetaSounds (UE5) — Procedural audio
│   ├── Unity Audio — Built-in system
│   └── Custom engine (rare, AAA studios)
│
├── Core Systems
│   ├── Voice Management (priority, limits, stealing)
│   ├── Mixer (channels, buses, routing, effects)
│   ├── Spatial Audio (3D positioning, HRTF, ambisonics)
│   ├── Streaming (large files loaded on demand)
│   ├── Memory Management (sound banks, pooling)
│   └── DSP Pipeline (real-time audio effects)
│
├── Game Integration
│   ├── Event System (game events → audio events)
│   ├── State System (game state → audio state)
│   ├── Parameter System (game values → audio parameters)
│   ├── Trigger System (area/collision → audio triggers)
│   └── Scripting API (code-driven audio control)
│
└── Output
    ├── Stereo (headphones, TV speakers)
    ├── Surround (5.1, 7.1)
    ├── Spatial (Dolby Atmos, DTS:X, Sony 3D Audio)
    ├── Binaural (HRTF for headphones)
    └── Haptics (DualSense, HD Rumble integration)
```

### 2. Sound Design for Games

#### Sound Categories
```
Game Audio Categories:
│
├── Character Sounds
│   ├── Footsteps (per surface: stone, grass, wood, metal, water, sand)
│   ├── Combat (attack swings, impacts per weapon type, blocks, parries)
│   ├── Voice (efforts, grunts, death, hurt, celebrations)
│   ├── Movement (armor clanking, cloth rustling, landing impacts)
│   └── Abilities (spell casting, power-ups, transformations)
│
├── UI / Menu Sounds
│   ├── Button hover, click, back
│   ├── Menu open, close, transition
│   ├── Notification / alert sounds
│   ├── Inventory pickup, equip, drop, craft
│   ├── Quest accept, complete, fail
│   └── Level up, achievement unlock
│
├── Environment / Ambiance
│   ├── Ambient beds (forest, cave, city, ocean, rain, wind)
│   ├── Ambient spot effects (birds, insects, dripping water, creaking)
│   ├── Weather (rain intensity levels, thunder, wind gusts)
│   ├── Time of day (dawn chorus, night crickets, noon silence)
│   └── Interactive objects (doors, chests, levers, fire, water)
│
├── Combat / Action
│   ├── Weapon sounds (sword slash, bow draw/release, gun fire/reload)
│   ├── Impacts (metal on metal, flesh, stone, wood, shield)
│   ├── Projectile (launch, fly-by, impact, ricochet)
│   ├── Explosions (proximity-based layers, debris)
│   └── Magic / Abilities (element-based, charge, release, effect)
│
└── Vehicle / Mechanical
    ├── Engine (RPM-based, load-based, exhaust)
    ├── Tires (surface-based: road, dirt, gravel, skid)
    ├── Wind (speed-based aerodynamic noise)
    ├── Mechanisms (gears, hydraulics, chains)
    └── Damage (scrapes, crunches, glass breaking)
```

#### Sound Variation Techniques
```
Avoiding Repetition:
│
├── Random Container: Randomly select from pool of variants
│   Example: 8 footstep sounds for "stone" surface
│
├── Sequence Container: Play in order (1→2→3→1→2→3)
│   Example: Rhythmic machinery sounds
│
├── Shuffle Container: Random without immediate repeats
│   Example: Sword swing variations
│
├── Parameter-Based Selection: Choose based on game values
│   Example: Impact force determines which impact sound plays
│
├── Pitch Randomization: ±5-15% pitch shift per play
│   Instant variation from same source
│
├── Volume Randomization: ±1-3 dB per play
│   Subtle natural variation
│
└── Layering: Combine multiple elements
    Example: Sword impact = metal_ring + flesh_hit + cloth_movement
    Each layer has independent randomization
```

### 3. Spatial Audio & 3D Sound

```
Spatial Audio Systems:
│
├── Distance Attenuation
│   ├── Linear falloff (simple, game-friendly)
│   ├── Logarithmic / Inverse distance (physically accurate)
│   ├── Custom curves (designer-controlled)
│   ├── Min/Max distance thresholds
│   └── Per-sound-type attenuation settings
│
├── Spatialization Methods
│   ├── Stereo Panning: Simple left/right positioning
│   ├── VBAP (Vector-Based Amplitude Panning): Surround placement
│   ├── Ambisonics: Full-sphere audio encoding/decoding
│   ├── HRTF (Head-Related Transfer Function): Binaural 3D
│   ├── Object-Based Audio (Dolby Atmos): Height channels
│   └── Wwise Spatial Audio / FMOD Spatializer plugins
│
├── Occlusion & Obstruction
│   ├── Occlusion: Sound source fully blocked (wall between listener & source)
│   │   Effect: Low-pass filter + volume reduction
│   ├── Obstruction: Partial blocking (object between but open paths exist)
│   │   Effect: Slight high-frequency reduction
│   └── Implementation: Raycast from listener to source,
│       check geometry intersections, apply DSP filters
│
├── Reverb Zones
│   ├── Per-area reverb settings (cave = long decay, forest = short)
│   ├── Convolution reverb (impulse response of real spaces)
│   ├── Algorithmic reverb (tunable parameters)
│   ├── Reverb blending at zone transitions
│   └── Early reflections for directional cues
│
└── Propagation (Advanced)
    ├── Sound diffraction around corners
    ├── Sound transmission through materials (muffled through walls)
    ├── Room acoustics simulation (ray tracing for audio)
    ├── Portal-based propagation (sound travels through doorways)
    └── Steam Audio / Project Acoustics for real-time propagation
```

### 4. Music Systems

#### Adaptive / Interactive Music
```
Interactive Music Techniques:
│
├── Horizontal Re-Sequencing
│   ├── Music is divided into sections/segments
│   ├── Game state determines which segment plays next
│   ├── Transitions at defined sync points (bar lines, beat)
│   ├── Example: Explore → Battle → Victory → Explore
│   └── Pre-composed transitions between segments
│
├── Vertical Layering / Re-Mixing
│   ├── Multiple synchronized tracks (stems)
│   ├── Add/remove layers based on intensity
│   ├── Example layers: Base percussion, strings, brass, choir, solo
│   ├── Intensity 0: Strings only (peaceful)
│   ├── Intensity 50: +Percussion, +Bass (tension building)
│   ├── Intensity 100: All layers (full combat)
│   └── Crossfade between intensity levels
│
├── Stinger System
│   ├── Short musical phrases triggered by events
│   ├── Quantized to beat/bar for musical timing
│   ├── Examples: Enemy spotted, low health, boss phase change
│   ├── Overlay on current music without interrupting
│   └── Priority system (don't stack stingers)
│
├── Parameter-Driven Music
│   ├── Game parameters directly control music properties
│   ├── Health → music intensity / tempo
│   ├── Time of day → instrument selection / key
│   ├── Altitude → mix / reverb
│   └── Enemy proximity → tempo / tension layers
│
└── Implementation (Wwise Example)
    ├── Music Playlist Container (sequence segments)
    ├── Music Switch Container (state-based segment selection)
    ├── Music Segment (individual sections with transitions)
    ├── Music Track (stems within a segment)
    ├── Transitions: Immediate, Next Beat, Next Bar, Next Entry Cue
    └── Stingers: Quantized event-triggered musical phrases
```

### 5. Voice & Dialogue Audio

```
Voice Production Pipeline:
│
├── Pre-Production
│   ├── Script writing with audio direction notes
│   ├── Character voice casting and auditions
│   ├── Voice reference guides per character
│   └── Pronunciation guide for made-up names/places
│
├── Recording
│   ├── Studio sessions with voice director
│   ├── File naming convention: CharName_QuestID_LineNumber_Take
│   ├── Multiple takes per line for selection
│   ├── Effort sounds: grunts, screams, laughs, breathing
│   └── Walla/group recordings for crowd sounds
│
├── Post-Production
│   ├── Take selection (best performance)
│   ├── Noise reduction and cleanup
│   ├── Level normalization (-16 to -12 LUFS for dialogue)
│   ├── EQ and compression for consistency
│   ├── De-essing and mouth noise removal
│   └── File export (mono, 48kHz, 16-bit WAV → compressed for game)
│
├── Implementation
│   ├── Dialogue management system (queue, priority, interruption)
│   ├── Subtitle synchronization
│   ├── Lip sync (viseme mapping or AI-driven)
│   ├── Localization support (multiple language VO)
│   ├── Ducking (lower music/SFX when dialogue plays)
│   └── Spatial dialogue (3D positioned for NPCs, 2D for narrator)
│
└── AI-Generated Voice (Emerging)
    ├── Eleven Labs, Azure Neural TTS, Google Cloud TTS
    ├── Procedural NPC barks and ambient dialogue
    ├── Dynamic quest dialogue for generated content
    └── Considerations: Quality, consistency, ethical concerns
```

### 6. Dynamic Mixing

```
Audio Mix Structure:
│
├── Master Bus
│   ├── Music Bus
│   │   ├── Combat Music
│   │   ├── Exploration Music
│   │   └── Menu Music
│   ├── SFX Bus
│   │   ├── Player SFX
│   │   ├── Enemy SFX
│   │   ├── Environment SFX
│   │   ├── UI SFX
│   │   └── Weapon SFX
│   ├── Voice Bus
│   │   ├── Dialogue
│   │   ├── Narration
│   │   └── NPC Barks
│   └── Ambient Bus
│       ├── Ambient Beds
│       └── Ambient Spots
│
├── HDR Audio (Dynamic Range Management)
│   ├── Loudness budget per bus (total loudness cap)
│   ├── Priority system (important sounds stay loud)
│   ├── Ducking (loud event temporarily reduces others)
│   ├── Side-chaining (dialogue ducks music and SFX)
│   └── Automatic gain control per bus
│
├── Context-Based Mixing (Snapshots / States)
│   ├── "Exploration": Music 70%, SFX 80%, Ambient 100%
│   ├── "Combat": Music 100%, SFX 100%, Ambient 40%
│   ├── "Dialogue": Music 40%, SFX 50%, Voice 100%
│   ├── "Cutscene": Music 80%, SFX 70%, Voice 100%
│   ├── "Underwater": Low-pass all, reverb up, muffled
│   └── "Menu/Pause": Fade game audio, play menu ambience
│
└── Player Settings
    ├── Master volume
    ├── Music volume
    ├── SFX volume
    ├── Voice volume
    ├── Subtitle toggle + size
    └── Spatial audio mode (stereo, surround, headphones)
```

### 7. Audio Optimization

```
Audio Performance Budget:
│
├── Voice Limits
│   ├── Total simultaneous voices: 32-128 (platform dependent)
│   ├── Priority system: Kill lowest priority when at limit
│   ├── Virtual voices (tracked but not playing — resume when priority rises)
│   └── Per-category limits (max 16 footsteps, max 8 ambients, etc.)
│
├── Memory Budget
│   ├── PC: 128-512 MB for audio
│   ├── Console: 64-256 MB
│   ├── Mobile: 16-64 MB
│   ├── Sound banks: Load/unload per level/area
│   └── Streaming: Large files (music, VO) stream from disk
│
├── Compression Formats
│   ├── Vorbis (.ogg): Good compression, CPU decode (SFX, music)
│   ├── ADPCM: Low CPU, moderate compression (mobile SFX)
│   ├── Opus: Best compression ratio (voice chat, streaming)
│   ├── PCM / WAV: Uncompressed (short critical sounds, no CPU cost)
│   └── Platform-specific: ATRAC (PS), XMA (Xbox)
│
└── CPU Optimization
    ├── DSP effects budget (reverb and convolution are expensive)
    ├── Spatial audio processing budget
    ├── Amortize audio processing across frames
    ├── Lower sample rate for distant sounds (48kHz → 24kHz → 12kHz)
    └── Simplified processing for low-priority sounds
```

---

## Audio Middleware Comparison

| Feature | Wwise | FMOD | Unity Audio | UE5 MetaSounds |
|---------|-------|------|-------------|----------------|
| **Learning Curve** | High | Medium | Low | Medium |
| **Flexibility** | Excellent | Excellent | Basic | Good |
| **Spatial Audio** | Built-in + plugins | Plugins | Basic | Built-in |
| **Interactive Music** | Excellent | Good | Manual | Procedural |
| **Profiling** | Advanced | Good | Basic | UE5 Insights |
| **Cost** | Free < 1000 assets | Free < $200K revenue | Free | Free |
| **Platforms** | All | All | Unity only | UE5 only |

---

## Example Prompt for AI-Assisted Audio

```
You are a Game Audio Engineer. I'm building a dark fantasy action RPG
in Unreal Engine 5. Design the complete audio system:

1. Sound design spec: Define all audio categories (combat, movement,
   UI, environment, magic) with variation strategies and quality targets
2. Spatial audio setup: Configure 3D audio with occlusion, obstruction,
   reverb zones for dungeons/forests/castles, and Dolby Atmos support
3. Adaptive music system: Design a vertical layering system with
   exploration/tension/combat/boss intensity levels, smooth transitions,
   and stinger support for key events
4. Dynamic mixing: Create mix snapshots for different game states
   (exploration, combat, dialogue, cutscene, menu) with proper ducking
   and HDR audio management
5. Voice pipeline: Design the dialogue system with priority handling,
   subtitle sync, lip sync integration, and localization support

For each system:
- Specify Wwise or FMOD implementation approach
- Include UE5 integration details (C++ and Blueprints)
- Define memory and voice budgets per platform
- Address accessibility (subtitle options, visual audio cues)
```
