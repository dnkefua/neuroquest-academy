# Game AI Programmer

## Role Definition

The Game AI Programmer designs and implements artificial intelligence systems that bring game worlds to life — from enemy combat behaviors and NPC routines to pathfinding, perception systems, strategic decision-making, procedural content generation, and director AI that dynamically adjusts difficulty. This role ensures that non-player entities behave believably, create engaging challenges, and respond intelligently to player actions.

---

## Core Competencies

### 1. Behavior Modeling Systems

#### Finite State Machines (FSM)
```
Simple Enemy FSM:
┌──────────┐  detect player  ┌──────────┐  in range  ┌──────────┐
│  PATROL  │───────────────►│  CHASE   │──────────►│  ATTACK  │
│          │◄───────────────│          │◄──────────│          │
└──────────┘  lost player    └──────────┘  too far   └──────────┘
      │                            │                       │
      │         low health         │     low health        │
      └────────────┐───────────────┘──────────┐────────────┘
                   ▼                          ▼
             ┌──────────┐              ┌──────────┐
             │  FLEE    │              │  HEAL    │
             └──────────┘              └──────────┘

Hierarchical FSM (HFSM):
├── COMBAT (parent state)
│   ├── APPROACH
│   ├── ATTACK
│   │   ├── LIGHT_ATTACK
│   │   ├── HEAVY_ATTACK
│   │   └── SPECIAL_ATTACK
│   ├── DEFEND
│   │   ├── BLOCK
│   │   └── DODGE
│   └── RETREAT
├── EXPLORATION
│   ├── PATROL
│   ├── INVESTIGATE
│   └── SEARCH
└── SOCIAL
    ├── TALK
    ├── TRADE
    └── IDLE
```

#### Behavior Trees
```
Behavior Tree Node Types:
├── Composite Nodes
│   ├── Sequence (AND) — Run children left-to-right, fail on first failure
│   ├── Selector (OR) — Run children left-to-right, succeed on first success
│   ├── Parallel — Run all children simultaneously
│   └── Random Selector/Sequence — Random order execution
│
├── Decorator Nodes
│   ├── Inverter — Flip success/failure
│   ├── Repeater — Run child N times or until fail
│   ├── Cooldown — Prevent re-execution for N seconds
│   ├── Conditional — Only run child if condition is true
│   └── Force Success/Failure — Override child result
│
├── Leaf Nodes (Actions & Conditions)
│   ├── Actions: MoveTo, Attack, PlayAnimation, Wait, SetVariable
│   └── Conditions: IsInRange, HasLineOfSight, IsHealthLow, HasAmmo
│
└── Blackboard (shared data)
    ├── TargetActor: reference to current enemy/player
    ├── LastKnownPosition: where target was last seen
    ├── AlertLevel: 0-100 awareness scale
    ├── CombatState: enum of current combat phase
    └── Custom keys for game-specific data

Example Boss AI Behavior Tree:
Root (Selector)
├── [Phase 3] Sequence (HP < 25%)
│   ├── Condition: Health Below 25%
│   ├── Action: Enrage (buff stats, new attacks)
│   ├── Selector
│   │   ├── Sequence [AOE Attack]
│   │   │   ├── Condition: Multiple Players Nearby
│   │   │   └── Action: AOE Slam
│   │   ├── Sequence [Summon Adds]
│   │   │   ├── Condition: Cooldown Ready
│   │   │   └── Action: Summon Minions
│   │   └── Action: Aggressive Melee Combo
│
├── [Phase 2] Sequence (HP < 60%)
│   ├── Condition: Health Below 60%
│   ├── Selector
│   │   ├── Sequence [Ranged Attack]
│   │   │   ├── Condition: Player Distance > 5m
│   │   │   └── Action: Projectile Barrage
│   │   ├── Sequence [Counter Attack]
│   │   │   ├── Condition: Player Just Attacked
│   │   │   └── Action: Parry → Riposte
│   │   └── Action: Standard Attack Pattern B
│
└── [Phase 1] Selector (Default)
    ├── Sequence [Basic Attack]
    │   ├── Condition: Player In Range
    │   └── Action: Standard Attack Pattern A
    └── Sequence [Approach]
        ├── Condition: Player Visible
        └── Action: Move To Player
```

#### Utility AI
```
Utility AI Decision Making:
│
│  For each possible action, score it based on multiple factors:
│
│  Action: "Attack Nearest Enemy"
│  ├── Distance to target:  score(d) = 1.0 - (d / maxRange)     → 0.8
│  ├── Target health:       score(h) = 1.0 - (h / maxHealth)     → 0.6
│  ├── Own health:          score(h) = h / maxHealth              → 0.9
│  ├── Ammo available:      score(a) = a > 0 ? 1.0 : 0.0        → 1.0
│  └── TOTAL = 0.8 * 0.6 * 0.9 * 1.0 = 0.432
│
│  Action: "Heal Self"
│  ├── Own health:          score(h) = 1.0 - (h / maxHealth)     → 0.1
│  ├── Has healing item:    score = hasItem ? 1.0 : 0.0          → 1.0
│  ├── Safety:              score = nearestEnemy > 10m ? 1.0 : 0.3 → 0.3
│  └── TOTAL = 0.1 * 1.0 * 0.3 = 0.03
│
│  Action: "Flee"
│  ├── Own health:          score(h) = 1.0 - (h / maxHealth)     → 0.1
│  ├── Enemy count:         score(n) = min(n / 5, 1.0)           → 0.4
│  ├── Escape route:        score = hasEscape ? 1.0 : 0.2        → 1.0
│  └── TOTAL = 0.1 * 0.4 * 1.0 = 0.04
│
│  Winner: "Attack Nearest Enemy" (0.432)
│
│  Response Curves: Linear, Quadratic, Logistic, Step, Bell Curve
│  Combine with: Multiply, Average, Min, Max, Custom weighting
```

### 2. Pathfinding & Navigation

#### Navigation Mesh (NavMesh)
```
NavMesh Pipeline:
├── Generation
│   ├── Voxelize world geometry (rasterize into voxel grid)
│   ├── Filter walkable voxels (height, slope thresholds)
│   ├── Build distance field (for erosion / agent radius)
│   ├── Erode walkable area by agent radius
│   ├── Build contours (outline walkable regions)
│   ├── Triangulate (create navmesh polygons)
│   └── Build adjacency graph (polygon connectivity)
│
├── Pathfinding
│   ├── A* on navmesh polygon graph
│   ├── Funnel algorithm for path smoothing (string pulling)
│   ├── Path cost modifiers (terrain type, danger zones, preferences)
│   └── Hierarchical pathfinding for large worlds
│
├── Steering
│   ├── Path following (follow waypoints with lookahead)
│   ├── Obstacle avoidance (local avoidance, RVO / ORCA)
│   ├── Crowd simulation (shared velocity obstacles)
│   └── Off-mesh links (jump points, ladders, teleporters)
│
└── Dynamic Updates
    ├── NavMesh obstacles (carve holes in real-time)
    ├── Partial rebuild for destructible environments
    └── NavMesh tiles for streaming/large worlds
```

#### A* Algorithm
```
A* Pathfinding:
│
│  OPEN list (priority queue, sorted by f = g + h)
│  CLOSED list (already evaluated)
│
│  g(n) = actual cost from start to node n
│  h(n) = heuristic estimate from node n to goal
│  f(n) = g(n) + h(n)
│
│  Heuristics:
│  ├── Manhattan distance: |dx| + |dy| (grid, 4-directional)
│  ├── Euclidean distance: sqrt(dx² + dy²) (any-angle)
│  ├── Octile distance: max(|dx|,|dy|) + (√2-1)*min(|dx|,|dy|) (grid, 8-dir)
│  └── Must be admissible (never overestimate) for optimal paths
│
│  Variants:
│  ├── Weighted A*: f = g + w*h (w>1 = faster, suboptimal)
│  ├── IDA*: Iterative deepening (memory-efficient)
│  ├── JPS (Jump Point Search): Optimized for uniform-cost grids
│  ├── Theta*: Any-angle pathfinding (smoother paths)
│  ├── D* Lite: Incremental replanning (changing environments)
│  └── Flow Fields: Precompute for many agents to same goal (RTS)
```

### 3. Perception Systems

```
AI Perception System:
│
├── Vision
│   ├── Field of View cone (angle + distance)
│   ├── Line-of-sight raycast (blocked by obstacles)
│   ├── Peripheral vision (wider angle, reduced detection)
│   ├── Detection speed (time to notice, varies by distance)
│   ├── Stealth modifiers (crouching, darkness, cover)
│   └── Last known position tracking
│
├── Hearing
│   ├── Sound propagation (radius from source)
│   ├── Sound intensity (gunshot > footstep > whisper)
│   ├── Occlusion (walls reduce sound)
│   ├── Alert radius (attract AI within range)
│   └── Sound type classification (combat, movement, environmental)
│
├── Touch / Damage
│   ├── Immediate full detection on being hit
│   ├── Bump detection (walked into)
│   └── Area effect detection (in explosion radius)
│
├── Communication
│   ├── AI-to-AI alerts (one spots player, warns nearby allies)
│   ├── Radio/squad communication (alert distant allies)
│   ├── Investigation squads (multiple AI investigate together)
│   └── Alarm systems (trigger global alert state)
│
└── Alert Levels
    ├── Unaware (0-20): Normal patrol, no suspicion
    ├── Suspicious (20-50): Noticed something, investigate
    ├── Alerted (50-80): Knows something is wrong, searching
    ├── Combat (80-100): Actively engaging target
    └── Decay: Alert level decreases over time without stimuli
```

### 4. Strategic & Tactical AI

#### Squad Tactics
```
Squad AI System:
│
├── Formation System
│   ├── Line formation (advancing)
│   ├── Wedge/V formation (breaching)
│   ├── Circle formation (defending)
│   ├── Column formation (moving through corridors)
│   └── Dynamic reformation based on terrain
│
├── Tactical Position Evaluation
│   ├── Cover scoring (protection value, flanking exposure)
│   ├── Height advantage
│   ├── Line of sight to target
│   ├── Distance to allies (don't cluster, don't isolate)
│   ├── Retreat routes available
│   └── Environmental hazards
│
├── Coordinated Actions
│   ├── Suppressive fire while allies move
│   ├── Flanking maneuvers
│   ├── Synchronized breaching
│   ├── Distraction + ambush
│   └── Focus fire on priority targets
│
└── Communication & Roles
    ├── Leader: Makes tactical decisions
    ├── Assault: Engages directly
    ├── Support: Provides covering fire
    ├── Flanker: Moves to side/rear positions
    └── Medic: Prioritizes healing downed allies
```

### 5. Director AI / Dynamic Difficulty

```
AI Director System (Left 4 Dead style):
│
├── Player Performance Metrics
│   ├── Damage dealt per minute
│   ├── Damage taken per minute
│   ├── Deaths / downs count
│   ├── Resources remaining (health, ammo)
│   ├── Time to complete objectives
│   └── Skill rating (composite metric)
│
├── Intensity Curve
│   ├── Build-up phase (increasing enemy count/difficulty)
│   ├── Peak (hardest encounter, boss, swarm)
│   ├── Relax phase (reduced enemies, pickups, safe areas)
│   └── Repeat with escalating peaks
│
├── Dynamic Adjustments
│   ├── Enemy spawn rate and count
│   ├── Enemy health and damage multipliers
│   ├── Special enemy frequency
│   ├── Item/resource drop rates
│   ├── Hidden rubber-banding (damage reduction when struggling)
│   └── Encounter composition
│
└── Implementation
    ├── Track "stress level" (0-100)
    ├── Increase stress: Damage taken, low health, deaths
    ├── Decrease stress: Kills, pickups, safe zones
    ├── Spawn decisions based on stress level
    └── Never let player know difficulty is adjusting
```

### 6. Machine Learning in Game AI

```
ML Approaches for Game AI:
│
├── Reinforcement Learning (RL)
│   ├── Train AI agents through trial and error
│   ├── Unity ML-Agents toolkit
│   ├── Applications: Racing opponents, combat AI, game testing
│   ├── Pros: Can discover novel strategies
│   └── Cons: Long training, unpredictable behavior, hard to tune
│
├── Imitation Learning
│   ├── Train on human gameplay recordings
│   ├── Behavioral cloning (supervised learning on actions)
│   ├── Applications: Realistic NPC behavior, driving AI
│   └── Pros: More natural behavior than hand-crafted
│
├── LLM-Powered NPCs
│   ├── Claude/GPT for dynamic dialogue generation
│   ├── Context-aware conversation (game state → prompt)
│   ├── Personality consistency through system prompts
│   ├── Knowledge boundaries (NPC doesn't know everything)
│   └── Considerations: Latency, cost, content safety, consistency
│
├── Neural Network Applications
│   ├── Procedural animation (motion matching, style transfer)
│   ├── Difficulty prediction (predict player skill from behavior)
│   ├── Player modeling (predict preferences, churn risk)
│   └── Content generation (level layouts, item stats)
│
└── When NOT to Use ML
    ├── When hand-crafted AI provides better gameplay
    ├── When behavior must be 100% predictable/debuggable
    ├── When training data is insufficient
    └── When the added complexity isn't justified
```

---

## AI Architecture Patterns

```
Recommended Architecture:
│
├── Blackboard System (shared knowledge)
│   ├── Per-agent blackboard (individual knowledge)
│   ├── Squad blackboard (shared tactical info)
│   └── World blackboard (global game state)
│
├── AI Manager / Controller
│   ├── Budgets AI processing per frame
│   ├── LOD-based AI complexity (distant = simpler)
│   ├── Distributes AI updates across frames
│   └── Manages spawning and despawning
│
├── Behavior System (choose what to do)
│   ├── Behavior Trees for complex characters
│   ├── Utility AI for dynamic decision-making
│   ├── FSM for simple enemies
│   └── GOAP for emergent behavior
│
├── Navigation System (how to get there)
│   ├── NavMesh for 3D navigation
│   ├── A* grid for 2D games
│   ├── Flow fields for mass movement
│   └── Local avoidance for crowd behavior
│
└── Perception System (what do I know)
    ├── Vision, hearing, communication
    ├── Memory (remember past observations)
    └── Alert state management
```

---

## Example Prompt for AI-Assisted Game AI Development

```
You are a Game AI Programmer. I'm building a stealth action game in
Unreal Engine 5 where enemies need sophisticated AI. Help me implement:

1. A perception system with vision cones, hearing radius, and alert
   levels (Unaware → Suspicious → Searching → Combat → Lost Contact)
2. A behavior tree for guards with: patrol routes, investigation of
   suspicious activity, search patterns, combat engagement, calling
   for reinforcements, and returning to patrol
3. A squad coordination system where enemies flank, use cover, and
   communicate player position to nearby allies
4. A stealth detection system that accounts for light level, player
   movement speed, noise, disguises, and line of sight
5. A director AI that manages encounter intensity, ensuring tension
   builds and releases naturally throughout each level

For each system:
- Provide UE5 C++ and Blueprint implementation
- Use the Behavior Tree and EQS systems
- Include debug visualization tools
- Ensure performance scales with 50+ simultaneous AI agents
- Include difficulty scaling parameters
```
