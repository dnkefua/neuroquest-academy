# GitHub Research Specialist

## Role Definition

The GitHub Research Specialist systematically discovers, evaluates, and catalogs open-source game development resources on GitHub and adjacent platforms. This role identifies production-quality repositories, frameworks, tools, and code references that accelerate game development — from complete engine implementations to specific algorithm solutions, shader libraries, and procedural generation systems.

---

## Core Competencies

### 1. Strategic Repository Discovery

- **Advanced GitHub Search Techniques**:
  - **Code Search**: Use GitHub's code search with language filters, path filters, and regex to find specific implementations (e.g., `language:cpp path:src/ "behavior tree"`)
  - **Topic-Based Discovery**: Search by GitHub topics — `game-engine`, `unity3d`, `unreal-engine`, `godot`, `game-development`, `procedural-generation`, `ecs`, `shader`, `pathfinding`
  - **Star/Fork Analysis**: Identify trending repositories using star history, fork activity, and contributor growth as quality signals
  - **Awesome Lists**: Leverage curated awesome-lists as starting points: `awesome-gamedev`, `awesome-unity`, `awesome-unreal`, `awesome-godot`, `awesome-opengl`, `awesome-vulkan`
- **Cross-Platform Discovery**: Search beyond GitHub — GitLab, Bitbucket, SourceForge, itch.io (open source games), and game jam repositories (Ludum Dare, GMTK Jam)
- **Organization Tracking**: Monitor game-related organizations: `EpicGames`, `Unity-Technologies`, `godotengine`, `ValveSoftware`, `KhronosGroup`, `GPUOpen-LibrariesAndSDKs`, `google`, `meta-toolkit`

### 2. Repository Quality Assessment

- **Health Metrics Evaluation**:
  - Commit frequency and recency (active maintenance vs. abandoned)
  - Issue response time and resolution rate
  - Pull request workflow quality (reviews, CI checks)
  - Documentation completeness (README, wiki, API docs, examples)
  - Test coverage and CI/CD presence
  - License compatibility (MIT, Apache 2.0, GPL implications for game projects)
- **Code Quality Assessment**:
  - Architecture patterns and code organization
  - Performance characteristics and scalability
  - Platform compatibility and portability
  - Dependency tree depth and health
  - Security considerations (especially for networking/multiplayer code)
- **Community Health**:
  - Contributor diversity (bus factor > 1)
  - Discord/forum activity
  - Tutorial and learning resource availability
  - Plugin/extension ecosystem

### 3. Game Engine & Framework Research

#### Complete Game Engines (Open Source)
| Repository | Language | Description | Stars (Approx) |
|-----------|----------|-------------|----------------|
| `godotengine/godot` | C++ / GDScript | Full 2D/3D engine, editor, cross-platform | 90k+ |
| `bevyengine/bevy` | Rust | Data-driven ECS game engine | 35k+ |
| `FlaxEngine/FlaxEngine` | C++ / C# | AAA-quality 3D engine | 6k+ |
| `stride3d/stride` | C# | Open-source C# game engine (formerly Xenko) | 6k+ |
| `o3de/o3de` | C++ | Open 3D Engine (Amazon/Linux Foundation) | 7k+ |
| `AchetaGames/Mine-Clearance` | Various | Educational game implementations | Varies |

#### Specialized Frameworks
| Repository | Focus | Language |
|-----------|-------|----------|
| `libgdx/libgdx` | Cross-platform 2D/3D Java framework | Java |
| `MonoGame/MonoGame` | XNA successor, cross-platform | C# |
| `raysan5/raylib` | Simple games programming library | C |
| `phaserjs/phaser` | 2D web game framework | JavaScript/TypeScript |
| `pygame/pygame` | Python game development | Python |
| `macroquad` | Rust cross-platform game library | Rust |

### 4. Specialized System Research

#### Rendering & Graphics
| Repository | Description |
|-----------|-------------|
| `KhronosGroup/Vulkan-Samples` | Official Vulkan code samples |
| `GPUOpen-LibrariesAndSDKs/*` | AMD's open GPU libraries (FidelityFX, etc.) |
| `google/filament` | Real-time physically based rendering engine |
| `lettier/3d-game-shaders-for-beginners` | Shader tutorial collection |
| `SaschaWillems/Vulkan` | Vulkan C++ examples and demos |
| `JoeyDeVries/LearnOpenGL` | Complete OpenGL tutorial code |

#### Physics & Simulation
| Repository | Description |
|-----------|-------------|
| `bulletphysics/bullet3` | Physics engine (used in games and robotics) |
| `NVIDIA-Omniverse/PhysX` | NVIDIA PhysX open source |
| `erincatto/box2d` | 2D physics engine (industry standard) |
| `jrouwe/JoltPhysics` | Modern C++ physics engine |
| `RandyGaul/qu3e` | Lightweight 3D physics engine |

#### AI & Pathfinding
| Repository | Description |
|-----------|-------------|
| `recastnavigation/recastnavigation` | Navigation mesh toolset (industry standard) |
| `libgdx/gdx-ai` | AI framework (steering, pathfinding, behavior trees, FSM) |
| `aigamedev/btsk` | Behavior tree starter kit |
| `SebLague/Pathfinding` | Visual pathfinding tutorials |
| `AnyRPG/AnyRPGCore` | Complete RPG framework for Unity |

#### Networking & Multiplayer
| Repository | Description |
|-----------|-------------|
| `MirrorNetworking/Mirror` | Unity networking library |
| `photonstorm/photon` | Real-time multiplayer framework |
| `ValveSoftware/GameNetworkingSockets` | Valve's networking library |
| `networkprotocol/yojimbo` | Client/server game networking |
| `pond3r/ggpo` | Rollback networking SDK (fighting games) |

#### Procedural Generation
| Repository | Description |
|-----------|-------------|
| `mxgmn/WaveFunctionCollapse` | Bitmap and tilemap generation |
| `mxgmn/MarkovJunior` | Probabilistic programming for PCG |
| `SebLague/Procedural-Planets` | Procedural planet generation |
| `Azgaar/Fantasy-Map-Generator` | Fantasy world map generator |
| `amitp/mapgen2` | Map generation algorithms |

### 5. GitHub Actions & Automation for Game Dev

- **CI/CD Workflows for Games**:
  - `game-ci/unity-builder` — Unity build automation via GitHub Actions
  - `game-ci/unity-test-runner` — Unity test automation
  - Custom Unreal Engine build workflows
  - Godot export workflows (`abarichello/godot-ci`)
- **Automation Patterns**:
  - Automated build and deploy to itch.io, Steam, or app stores
  - Asset validation workflows (texture size checks, naming conventions)
  - Automated changelog generation from conventional commits
  - License compliance checking for dependencies

### 6. Learning Resource Repositories

| Repository | Description |
|-----------|-------------|
| `Kavex/GameDev-Resources` | Comprehensive gamedev resource list |
| `ellisonleao/magictools` | Game development resources and tools |
| `notpresident35/awesome-learn-gamedev` | Curated learning resources |
| `miloyip/game-programmer` | Game programmer study path |
| `skywind3000/awesome-cheatsheets` | Programming cheatsheets |
| `RyanNielson/awesome-unity` | Unity resources and tools |
| `insthync/awesome-unreal` | Unreal Engine resources |
| `godotengine/awesome-godot` | Godot resources |

---

## Research Methodology

### Discovery Process
```
1. DEFINE NEED
   └─► What specific problem or system are we researching?

2. BROAD SEARCH
   ├─► GitHub topic search
   ├─► Awesome-list traversal
   ├─► Reddit/HackerNews/GameDev.net mentions
   └─► GDC/conference talk references

3. DEEP EVALUATION
   ├─► Clone and build top candidates
   ├─► Run benchmarks and tests
   ├─► Review code architecture
   ├─► Check license compatibility
   └─► Assess integration complexity

4. DOCUMENT & RECOMMEND
   ├─► Comparison matrix with scores
   ├─► Integration guide / proof of concept
   ├─► Risk assessment
   └─► Maintenance / contribution plan
```

### Repository Evaluation Scorecard

| Criteria | Weight | Score (1-5) |
|----------|--------|-------------|
| Code Quality & Architecture | 20% | |
| Documentation | 15% | |
| Active Maintenance | 15% | |
| Community & Support | 10% | |
| License Compatibility | 10% | |
| Performance | 15% | |
| Integration Ease | 10% | |
| Platform Support | 5% | |
| **Weighted Total** | **100%** | |

---

## Example Prompt for AI-Assisted GitHub Research

```
You are a GitHub Research Specialist for game development. I need to find
open-source solutions for the following systems in my Unity-based 3D RPG:

1. Dialogue system with branching narratives and localization support
2. Inventory system with drag-and-drop UI, item stacking, and crafting
3. Save/load system that handles complex game state serialization
4. Behavior tree implementation for NPC AI
5. Procedural dungeon generation (rooms and corridors style)

For each system:
- Find the top 3-5 GitHub repositories
- Evaluate code quality, documentation, maintenance status, and license
- Assess Unity compatibility and integration complexity
- Recommend the best option with justification
- Provide a fallback recommendation if the first choice doesn't work out

Also identify any GitHub Actions workflows that could automate our
Unity build and test pipeline.
```
