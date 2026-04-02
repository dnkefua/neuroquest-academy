# Multiplayer & Networking Specialist

## Role Definition

The Multiplayer & Networking Specialist architects and implements all online and networked features in video games — from real-time multiplayer combat and matchmaking to lobby systems, voice chat, leaderboards, anti-cheat, server infrastructure, and cross-play. This role ensures smooth, fair, and responsive online experiences across varying network conditions and platforms.

---

## Core Competencies

### 1. Network Architecture Models

#### Client-Server (Authoritative Server)
```
Client-Server Architecture:
┌──────────┐     ┌──────────────────┐     ┌──────────┐
│ Client 1 │◄───►│  Game Server     │◄───►│ Client 2 │
│ (Player) │     │  (Authoritative) │     │ (Player) │
└──────────┘     │                  │     └──────────┘
                 │ - Owns game state│
┌──────────┐     │ - Validates input│     ┌──────────┐
│ Client 3 │◄───►│ - Replicates to │◄───►│ Client 4 │
│ (Player) │     │   all clients   │     │ (Player) │
└──────────┘     └──────────────────┘     └──────────┘

Pros: Cheat-resistant, single source of truth
Cons: Server cost, latency dependency
Used by: FPS, MMO, battle royale, competitive games
```

#### Peer-to-Peer
```
Peer-to-Peer Architecture:
┌──────────┐◄──────────────►┌──────────┐
│ Client 1 │                │ Client 2 │
│ (Host?)  │                │          │
└──────┬───┘                └───┬──────┘
       │                        │
       │    ┌──────────┐        │
       └───►│ Client 3 │◄──────┘
            │          │
            └──────────┘

Pros: No server cost, lower latency between nearby peers
Cons: Host advantage, cheat-vulnerable, NAT traversal issues
Used by: Fighting games, co-op games, small-scale multiplayer
```

#### Hybrid (Listen Server)
```
One player acts as both client and server:
- Lower cost than dedicated servers
- Host has latency advantage
- Common in co-op games (1-4 players)
- Fallback when dedicated servers unavailable
```

### 2. Latency Compensation Techniques

#### Client-Side Prediction
```
Client-Side Prediction:
│
│ Problem: Waiting for server confirmation = input delay (50-200ms)
│
│ Solution: Client immediately applies input locally, then reconciles
│
│ Frame 10: Player presses "move right"
│   Client: Immediately moves character right
│   Client: Sends input to server
│
│ Frame 15: Server processes input from frame 10
│   Server: Validates and applies movement
│   Server: Sends authoritative position back
│
│ Frame 17: Client receives server state for frame 10
│   Client: Compares predicted position vs. server position
│   If match: No correction needed (common case)
│   If mismatch: Snap or interpolate to server position
│                Re-simulate frames 10-17 with corrected state
│
│ Result: Player feels responsive (0ms input delay)
│         Server maintains authority (cheat prevention)
```

#### Server Reconciliation
```
Server Reconciliation:
│
│ Client keeps history of:
│ ├── Input buffer: All inputs sent to server (with frame numbers)
│ └── State buffer: Predicted state at each frame
│
│ When server confirms state for frame N:
│ 1. Compare server state vs. predicted state at frame N
│ 2. If different:
│    a. Set state to server's authoritative state
│    b. Re-apply all inputs from frame N+1 to current frame
│    c. This "catches up" prediction to current time
│ 3. Apply smoothing to prevent visual jitter
```

#### Entity Interpolation
```
Entity Interpolation (for other players / remote entities):
│
│ Problem: Network updates arrive at irregular intervals
│
│ Solution: Buffer received states, interpolate between them
│
│ Time: ────────────────────────────────────────────►
│ Server updates:    S1         S2         S3
│ Received at:       t=0        t=100ms    t=200ms
│
│ Render at:         ◄── Interpolation window ──►
│                    (render 100ms in the past)
│
│ At render time t=150ms:
│   Interpolate between S1 (t=0) and S2 (t=100ms)
│   Progress = (150-100) / (100-0) = 0.5
│   Position = Lerp(S1.pos, S2.pos, 0.5)
│
│ Tradeoff: Visual smoothness vs. 100ms display delay
│ (Players don't notice 50-150ms delay on other entities)
```

#### Rollback Netcode
```
Rollback Netcode (Fighting Games):
│
│ Designed for deterministic games where every frame matters
│
│ 1. Both clients simulate locally using predicted inputs
│ 2. When actual remote input arrives:
│    a. If predicted correctly: No correction needed
│    b. If predicted wrong:
│       - Roll back game state to the frame of the input
│       - Re-simulate forward with correct input
│       - Apply corrections (may cause brief visual "snap")
│
│ Advantages:
│ ├── Zero input delay (critical for fighting games)
│ ├── Works well with < 150ms latency
│ └── Industry standard: GGPO, Rollback implementations
│
│ Requirements:
│ ├── Deterministic simulation (same inputs → same outputs)
│ ├── Fast state save/restore (snapshot entire game state)
│ ├── Fast re-simulation (replay N frames quickly)
│ └── Input prediction heuristics (repeat last input)
│
│ Used by: Street Fighter 6, Guilty Gear Strive, most modern fighters
```

### 3. Replication & Synchronization

#### State Replication
```
Efficient State Replication:
│
├── Full State Sync
│   └── Send entire game state (simple, wasteful)
│
├── Delta Compression
│   └── Only send what changed since last acknowledged state
│       Reduces bandwidth 70-90%
│
├── Interest Management (Relevancy)
│   └── Only replicate entities relevant to each client
│       ├── Distance-based: Entities within X meters
│       ├── Area-based: Entities in same zone/room
│       ├── Importance-based: Always replicate important entities
│       └── Reduces bandwidth and CPU for large worlds
│
├── Prioritized Bandwidth
│   └── When bandwidth is limited, prioritize:
│       1. Player's own state (highest priority)
│       2. Nearby enemies in combat
│       3. Nearby players
│       4. Important world events
│       5. Distant entities (lowest priority)
│
├── Quantization
│   └── Compress values to fewer bits:
│       Position: Float32 → 16-bit fixed point
│       Rotation: Quaternion → Smallest-3 encoding (29 bits)
│       Health: Float → 8-bit (0-255)
│
└── Reliability Modes
    ├── Reliable Ordered: TCP-like (critical events, chat, RPC)
    ├── Reliable Unordered: Guaranteed delivery, any order
    ├── Unreliable: UDP-like (position updates, voice)
    └── Unreliable Sequenced: Latest only, drop outdated
```

### 4. Matchmaking & Lobby Systems

```
Matchmaking Architecture:
│
├── Matchmaking Criteria
│   ├── Skill Rating (ELO, Glicko-2, TrueSkill)
│   ├── Latency / Region (prefer low-ping servers)
│   ├── Party size (match groups fairly)
│   ├── Game mode preference
│   ├── Platform (cross-play opt-in/out)
│   └── Queue time (relax criteria over time)
│
├── Rating Systems
│   ├── ELO: Simple, chess-derived
│   │   New Rating = Old + K * (Actual - Expected)
│   │   Expected = 1 / (1 + 10^((OpponentRating - MyRating) / 400))
│   │
│   ├── Glicko-2: ELO + confidence interval + volatility
│   │   More accurate with fewer games
│   │   Accounts for rating reliability
│   │
│   └── TrueSkill (Microsoft): Designed for team games
│       Skill (μ) and Uncertainty (σ)
│       Supports team matchmaking and free-for-all
│       Display Rating = μ - 3σ
│
├── Queue Flow
│   1. Player enters queue with preferences
│   2. Matchmaker groups compatible players
│   3. Expand search criteria as wait time increases
│   4. Create match when group is complete
│   5. Notify all players, start countdown
│   6. Allocate/spin up game server
│   7. Players connect to game server
│
└── Lobby System
    ├── Create / Join / Leave / Kick
    ├── Ready-up system
    ├── Host migration (if host leaves)
    ├── Party system (group queue together)
    ├── Invite system (friends, link, code)
    └── Lobby chat and voice
```

### 5. Anti-Cheat Strategies

```
Anti-Cheat Layers:
│
├── Server Authority (Most Important)
│   ├── Server validates ALL gameplay-affecting actions
│   ├── Never trust client data (position, damage, health)
│   ├── Server-side hit detection for competitive games
│   ├── Rate limiting (max actions per second)
│   └── Sanity checks (speed limits, damage caps, teleport detection)
│
├── Statistical Detection
│   ├── Aimbot detection: Inhuman accuracy, snap-to-head patterns
│   ├── Speed hacking: Movement speed anomalies
│   ├── Wallhacking: Statistically impossible awareness
│   ├── Economy exploits: Abnormal currency/item accumulation
│   └── Machine learning models trained on cheater behavior
│
├── Client-Side Anti-Cheat
│   ├── Easy Anti-Cheat (EAC) — Epic Games
│   ├── BattlEye — industry standard
│   ├── Vanguard (Riot Games) — kernel-level
│   ├── VAC (Valve Anti-Cheat) — Steam
│   └── Custom integrity checks
│
├── Report & Review System
│   ├── Player reporting with replay evidence
│   ├── Overwatch/tribunal systems (community review)
│   ├── Manual review for edge cases
│   └── Progressive penalties (warning → temp ban → permanent ban)
│
└── Network Security
    ├── Encrypted communication (TLS/DTLS)
    ├── Packet validation and sequence checking
    ├── Session token authentication
    ├── DDoS protection (Cloudflare, AWS Shield)
    └── API rate limiting
```

### 6. Server Infrastructure

```
Game Server Infrastructure:
│
├── Dedicated Game Servers
│   ├── AWS GameLift (managed fleet, FlexMatch)
│   ├── Azure PlayFab Multiplayer (managed containers)
│   ├── Google Cloud / Agones (Kubernetes-based)
│   ├── Multiplay (Unity) — global fleet management
│   ├── Self-hosted (bare metal or VMs)
│   └── Hathora (serverless game hosting)
│
├── Server Scaling
│   ├── Auto-scale based on player demand
│   ├── Geographic distribution (US, EU, Asia, OCE, SA)
│   ├── Warm standby servers for instant allocation
│   ├── Spot/preemptible instances for cost saving (non-competitive)
│   └── Container orchestration (Docker + K8s)
│
├── Backend Services
│   ├── Authentication service
│   ├── Matchmaking service
│   ├── Leaderboard service
│   ├── Inventory/economy service
│   ├── Social service (friends, parties, chat)
│   ├── Analytics service
│   └── Content delivery (patches, assets)
│
└── Monitoring & Operations
    ├── Server health monitoring (CPU, memory, network)
    ├── Player experience monitoring (ping, packet loss, disconnects)
    ├── Real-time player count dashboards
    ├── Automated alerts for issues
    ├── Graceful server shutdown (migrate players before restart)
    └── Rolling deployments (update servers without downtime)
```

### 7. Cross-Play Implementation

```
Cross-Play Architecture:
│
├── Platform Account Linking
│   ├── Central game account (your backend)
│   ├── Link: Steam, Epic, PSN, Xbox Live, Nintendo, Apple, Google
│   ├── Cross-progression (shared save data across platforms)
│   └── Platform-specific entitlements (DLC, skins purchased on one platform)
│
├── Input Fairness
│   ├── Separate pools: Controller vs. Mouse+Keyboard
│   ├── Mixed pools: Opt-in with consent
│   ├── Input-based matchmaking (not platform-based)
│   └── Aim assist balancing for controller players
│
├── Voice Chat
│   ├── Vivox (industry standard, cross-platform)
│   ├── Discord GameSDK
│   ├── Platform native (PSN Party, Xbox Party)
│   └── Cross-platform voice: Vivox or custom WebRTC
│
├── Platform Requirements
│   ├── Sony: PSN account required, cross-play opt-in
│   ├── Microsoft: Xbox Live required, generally cross-play friendly
│   ├── Nintendo: Nintendo Account, limited cross-play support
│   └── PC: Steam/Epic/standalone, most flexible
│
└── Text Chat
    ├── Content filtering (profanity, harassment)
    ├── Platform compliance (Sony/MS/Nintendo text policies)
    ├── Translation support (optional)
    └── Moderation tools (mute, block, report)
```

---

## Networking Libraries & Frameworks

| Library | Language | Type | Best For |
|---------|----------|------|----------|
| **Netcode for GameObjects** | C# (Unity) | High-level | Unity multiplayer games |
| **Mirror** | C# (Unity) | High-level | Unity, community-driven |
| **Photon (PUN/Fusion)** | C# (Unity) | Cloud-hosted | Unity, easy setup, CCU-based |
| **EOS SDK** | C/C++ | Mid-level | Cross-platform, Epic integration |
| **SteamNetworkingSockets** | C++ | Low-level | Valve's networking (open source) |
| **GameNetworkingSockets** | C++ | Low-level | Open-source Valve network library |
| **yojimbo** | C++ | Low-level | Custom engines, reliable UDP |
| **GGPO** | C | Rollback | Fighting games, rollback netcode |
| **Colyseus** | TypeScript | Server framework | Node.js game servers |
| **Nakama** | Go | Full backend | Open-source game backend |

---

## Example Prompt for AI-Assisted Networking

```
You are a Multiplayer Networking Specialist. I'm building a 16-player
co-op action RPG in Unity, targeting PC and consoles with cross-play.

Design and implement:
1. Server architecture: Dedicated servers with client-side prediction
   and server reconciliation for responsive combat
2. Replication system: Efficient state sync with delta compression,
   interest management (only replicate nearby entities), and
   prioritized bandwidth allocation
3. Matchmaking: Skill-based matchmaking with region preference,
   party support, and cross-platform play
4. Anti-cheat: Server-authoritative validation for combat, movement
   speed checks, and damage sanity checks
5. Server infrastructure: AWS GameLift setup with auto-scaling,
   multi-region deployment, and cost optimization

For each system:
- Provide Unity C# implementation using Netcode for GameObjects
- Handle edge cases (high latency, packet loss, disconnections)
- Include bandwidth budgets and optimization strategies
- Address console-specific networking requirements
- Include monitoring and debugging tools
```
