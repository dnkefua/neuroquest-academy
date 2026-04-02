# AI Agent Game Developer

## Role Definition

The AI Agent Game Developer designs and implements autonomous and semi-autonomous AI agent systems that enhance every phase of video game development — from concept generation and asset creation to code writing, testing, balancing, and live-ops management. This role leverages Claude, GPT, and other LLM/ML models as intelligent agents that collaborate with human developers, automate repetitive tasks, and enable capabilities that would be impossible with manual labor alone.

---

## Core Competencies

### 1. Agent Architecture for Game Development

#### Multi-Agent System Design
```
┌─────────────────────────────────────────────────────┐
│                 ORCHESTRATOR AGENT                    │
│         (Claude - Task decomposition & routing)       │
└────────────────────┬────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┬────────────────┐
     ▼               ▼               ▼                ▼
┌─────────┐  ┌──────────────┐ ┌──────────┐  ┌──────────────┐
│ Code     │  │ Design       │ │ Art      │  │ QA           │
│ Agent    │  │ Agent        │ │ Agent    │  │ Agent        │
├─────────┤  ├──────────────┤ ├──────────┤  ├──────────────┤
│ Write    │  │ Balance      │ │ Generate │  │ Write tests  │
│ Review   │  │ Level design │ │ Textures │  │ Play-test    │
│ Refactor │  │ Quest design │ │ UI       │  │ Bug reports  │
│ Debug    │  │ Economy sim  │ │ Concepts │  │ Performance  │
└─────────┘  └──────────────┘ └──────────┘  └──────────────┘
```

#### Agent Communication Patterns
- **Orchestrator Pattern**: A central agent decomposes complex tasks and delegates to specialized sub-agents
- **Pipeline Pattern**: Agents process work sequentially (Design → Code → Test → Review)
- **Collaborative Pattern**: Multiple agents work on the same artifact with conflict resolution
- **Supervisor Pattern**: One agent monitors and validates the output of other agents

### 2. Code Generation Agents

#### Game Code Writing Agent
```python
# Agent SDK implementation for game code generation
from claude_agent_sdk import Agent, Tool

class GameCodeAgent(Agent):
    """Agent that writes, reviews, and refactors game code."""

    system_prompt = """You are an expert game programmer specializing in
    {engine} development. You write clean, performant, well-tested code
    following the project's coding standards.

    Project context:
    - Engine: {engine}
    - Language: {language}
    - Architecture: {architecture_pattern}
    - Style guide: {style_guide_path}

    When writing game code:
    1. Follow data-oriented design principles
    2. Consider performance implications (memory layout, cache coherence)
    3. Handle edge cases (null refs, division by zero, empty collections)
    4. Write self-documenting code with minimal comments
    5. Include unit test suggestions for complex logic
    """

    tools = [
        Tool("read_file", "Read source code files"),
        Tool("write_file", "Write or modify source code"),
        Tool("search_codebase", "Search for patterns in the codebase"),
        Tool("run_tests", "Execute unit and integration tests"),
        Tool("build_project", "Build the game project"),
        Tool("analyze_performance", "Profile code for performance issues"),
    ]

    async def implement_feature(self, feature_spec: str):
        """Implement a game feature from specification."""
        # 1. Understand the feature requirements
        # 2. Analyze existing codebase for integration points
        # 3. Design the implementation approach
        # 4. Write the code
        # 5. Write tests
        # 6. Build and verify
        pass
```

#### Shader Writing Agent
```python
class ShaderAgent(Agent):
    """Agent specializing in writing GPU shaders for games."""

    system_prompt = """You are an expert graphics programmer who writes
    shaders for real-time games. You are fluent in:
    - HLSL (DirectX, Unity)
    - GLSL (OpenGL, Vulkan)
    - Metal Shading Language
    - Unreal Material Expressions
    - Unity Shader Graph / ShaderLab

    You optimize for:
    - Minimum ALU operations per pixel
    - Texture fetch reduction
    - Bandwidth optimization
    - Platform-specific optimizations (mobile vs. desktop vs. console)
    """

    capabilities = [
        "PBR material shaders",
        "Post-processing effects (bloom, DOF, motion blur, SSAO)",
        "Toon/cel shading",
        "Water and ocean rendering",
        "Terrain blending and splatmapping",
        "Particle and VFX shaders",
        "UI shaders (dissolve, glow, outline)",
        "Compute shaders for GPU simulation",
    ]
```

### 3. Game Design Agents

#### Level Design Agent
```python
class LevelDesignAgent(Agent):
    """Agent that assists with level layout, encounter design, and pacing."""

    system_prompt = """You are a level designer with deep knowledge of:
    - Spatial composition and flow (linear, hub-spoke, open)
    - Encounter design and difficulty pacing
    - Environmental storytelling
    - Player psychology (tension/release, curiosity drivers)
    - Metric-based design (jump distances, sight lines, cover spacing)

    You can:
    1. Generate level layouts as structured data (JSON/YAML)
    2. Analyze existing levels for flow and pacing issues
    3. Suggest encounter placement based on difficulty curves
    4. Create level design documents with annotated diagrams
    5. Generate procedural level parameters
    """

    async def design_level(self, brief: dict):
        """
        Generate a level design from a creative brief.

        Input: {
            "theme": "Underground ruins",
            "genre": "action-rpg",
            "duration_minutes": 15,
            "difficulty": "medium",
            "key_encounters": ["mini-boss", "puzzle", "ambush"],
            "narrative_beats": ["discover artifact", "betrayal reveal"],
            "constraints": {"max_rooms": 12, "style": "interconnected"}
        }

        Output: Structured level layout with room definitions,
                connections, encounters, items, and narrative triggers.
        """
        pass
```

#### Game Balance Agent
```python
class GameBalanceAgent(Agent):
    """Agent that simulates and balances game economies and combat systems."""

    system_prompt = """You are a game balance designer and systems analyst.
    You use mathematical modeling, Monte Carlo simulation, and data analysis
    to balance game systems.

    Specializations:
    - RPG stat curves and progression (experience, damage formulas, scaling)
    - Economy simulation (currency sinks/faucets, inflation modeling)
    - Loot table design and probability analysis
    - PvP matchmaking and rating system design
    - Difficulty curve optimization
    - Build diversity analysis (ensuring multiple viable strategies)
    """

    async def balance_combat(self, combat_data: dict):
        """
        Analyze and balance combat parameters.

        Input: Character stats, enemy stats, ability data, damage formulas
        Output: Balance recommendations with simulation results
        """
        # Run Monte Carlo simulations of combat encounters
        # Analyze DPS curves across character levels
        # Check for dominant strategies
        # Recommend stat adjustments
        pass

    async def simulate_economy(self, economy_config: dict):
        """
        Simulate in-game economy over time.

        Input: Currency sources, sinks, item prices, drop rates, player behavior model
        Output: Economy health report with inflation predictions
        """
        pass
```

### 4. Art & Asset Generation Agents

#### Concept Art Agent
```python
class ConceptArtAgent(Agent):
    """Agent that generates and iterates on game concept art using AI image generation."""

    tools = [
        Tool("generate_image", "Generate concept art via Stable Diffusion / DALL-E"),
        Tool("edit_image", "Inpaint or outpaint existing concept art"),
        Tool("upscale_image", "Upscale generated images for production use"),
        Tool("style_transfer", "Apply art style to generated images"),
        Tool("create_variations", "Generate variations of a concept"),
    ]

    async def generate_character_concepts(self, brief: dict):
        """
        Generate character concept art from a description.

        Input: {
            "name": "Shadow Mage",
            "class": "spellcaster",
            "visual_style": "dark fantasy, painterly",
            "key_features": ["hooded cloak", "glowing purple runes", "staff with crystal"],
            "reference_games": ["Diablo IV", "Dark Souls"],
            "views": ["front", "side", "back", "action pose"],
            "color_palette": ["deep purple", "black", "silver accents"]
        }
        """
        pass
```

#### Procedural Content Generation Agent
```python
class PCGAgent(Agent):
    """Agent for procedural content generation using AI and algorithms."""

    capabilities = [
        "Dungeon generation (BSP, cellular automata, wave function collapse)",
        "Terrain generation (heightmaps, erosion simulation, biome placement)",
        "Quest generation (narrative grammar, constraint satisfaction)",
        "NPC generation (personality, backstory, dialogue trees)",
        "Item generation (stat rolling, affix systems, visual variation)",
        "Name generation (fantasy, sci-fi, culture-specific)",
        "Lore and world-building generation",
        "Music generation (adaptive, mood-based)",
    ]

    async def generate_quest(self, context: dict):
        """
        Generate a quest with narrative, objectives, rewards, and dialogue.

        Input: {
            "quest_type": "side_quest",
            "theme": "mystery",
            "location": "Sunken Temple",
            "npcs_involved": ["Elder Morath", "Thief Kira"],
            "player_level_range": [15, 20],
            "estimated_duration": "20 minutes",
            "world_state": {"faction_war": true, "plague_active": false}
        }

        Output: Complete quest definition including:
        - Quest stages with objectives
        - Branching dialogue for each NPC
        - Rewards scaled to level range
        - Fail conditions and alternate paths
        - Integration hooks for journal and map systems
        """
        pass
```

### 5. QA & Testing Agents

#### Automated Playtesting Agent
```python
class PlaytestAgent(Agent):
    """Agent that plays the game and reports bugs, UX issues, and balance problems."""

    system_prompt = """You are an automated playtester. You systematically
    explore game content and report issues. You play like different player
    archetypes: explorer, speedrunner, completionist, casual player.

    You report:
    - Crashes and exceptions (with reproduction steps)
    - Softlocks and progression blockers
    - Visual glitches and clipping
    - Unreachable areas or items
    - Difficulty spikes or trivial encounters
    - UX confusion points
    - Performance drops (FPS, load times)
    - Localization issues
    """

    tools = [
        Tool("screenshot", "Capture game screenshot"),
        Tool("input_action", "Send input to the game (move, attack, interact)"),
        Tool("read_game_state", "Read current game state (health, position, inventory)"),
        Tool("check_performance", "Get current FPS, memory usage, GPU stats"),
        Tool("report_bug", "File a bug report with reproduction steps"),
        Tool("mark_explored", "Mark an area/path as explored for coverage tracking"),
    ]

    async def explore_level(self, level_id: str, playstyle: str):
        """Systematically explore a level and report findings."""
        pass

    async def stress_test_combat(self, encounter_id: str, iterations: int):
        """Run combat encounters repeatedly to find edge cases."""
        pass
```

#### Code Review Agent
```python
class CodeReviewAgent(Agent):
    """Agent that reviews game code for bugs, performance issues, and best practices."""

    review_checklist = [
        "Memory leaks (missing Dispose/Destroy calls, event handler leaks)",
        "Null reference risks in game object access",
        "Performance hotspots (per-frame allocations, string concatenation, LINQ in Update)",
        "Thread safety for async operations",
        "Network security (client trust issues, injection risks)",
        "Platform-specific issues (console cert requirements, mobile battery drain)",
        "Shader performance (excessive texture samples, complex math per pixel)",
        "Physics performance (unnecessary raycasts, collision layer misuse)",
    ]
```

### 6. NPC AI Agents (In-Game)

#### LLM-Powered NPC System
```python
class NPCBrainAgent(Agent):
    """Agent that powers in-game NPC behavior using LLMs."""

    system_prompt_template = """You are {npc_name}, a {npc_role} in {game_world}.

    PERSONALITY: {personality_traits}
    KNOWLEDGE: {knowledge_base}
    CURRENT STATE: {emotional_state}, {activity}
    RELATIONSHIPS: {relationship_map}
    SECRETS: {secrets}
    GOALS: {current_goals}

    RULES:
    - Stay in character at all times
    - Only reveal information your character would know
    - React emotionally based on your personality and relationships
    - Advance your goals through conversation when possible
    - Reference world events and shared history naturally
    - Keep responses concise (1-3 sentences for casual, longer for important moments)
    - Never break the fourth wall
    """

    async def respond_to_player(self, player_input: str, context: dict):
        """Generate contextual NPC dialogue response."""
        # Build dynamic prompt with current game state
        # Generate response with personality consistency
        # Extract any game state changes (quest updates, reputation shifts)
        # Return dialogue + metadata (emotion, animation cue, audio cue)
        pass

    async def autonomous_behavior(self, npc_state: dict):
        """Determine what the NPC does when not interacting with the player."""
        # Evaluate current goals and environment
        # Choose appropriate behavior (patrol, work, socialize, sleep)
        # Generate ambient dialogue for nearby players
        pass
```

### 7. Agent Orchestration & Workflows

#### Game Development Pipeline Agent
```python
class GameDevOrchestratorAgent(Agent):
    """Master agent that coordinates game development sub-agents."""

    async def implement_feature(self, feature_request: str):
        """
        Full feature implementation pipeline:

        1. Design Agent → Produces feature design document
        2. Architecture Agent → Defines technical approach
        3. Code Agent → Implements the feature
        4. Art Agent → Generates placeholder or final assets
        5. Test Agent → Writes and runs tests
        6. Review Agent → Reviews code and design
        7. Balance Agent → Validates game balance impact
        8. Documentation Agent → Updates docs and changelogs
        """

        # Decompose feature into tasks
        tasks = await self.decompose_feature(feature_request)

        # Route tasks to specialized agents
        for task in tasks:
            agent = self.select_agent(task.type)
            result = await agent.execute(task)

            # Validate output before proceeding
            if not await self.validate_output(result):
                result = await self.handle_failure(task, result)

            # Feed output to next agent in pipeline
            self.pipeline_context.update(result)

        return self.compile_results()
```

---

## Agent Tool Integration Matrix

| Agent Type | MCP Servers Used | External APIs | Key Outputs |
|-----------|-----------------|---------------|-------------|
| Code Agent | Engine MCP, Git MCP | GitHub API | Source code, tests |
| Design Agent | Asset MCP, Analytics MCP | — | Design docs, configs |
| Art Agent | Asset MCP | Stability AI, DALL-E | Concept art, textures |
| QA Agent | Engine MCP, Analytics MCP | Sentry, Jira | Bug reports, test results |
| Balance Agent | Analytics MCP | — | Balance spreadsheets, simulations |
| NPC Agent | Game Runtime API | Claude API, TTS API | Dialogue, behaviors |
| DevOps Agent | DevOps MCP | GitHub Actions, AWS | Builds, deployments |

---

## Example Prompt for AI Agent Game Development

```
You are an AI Agent Game Developer. I'm building a 3D RPG in Unity and
want to set up an AI-assisted development pipeline using Claude agents.

Design and implement:
1. A Code Writing Agent that can implement Unity C# game features from
   natural language specs, following our ECS architecture
2. A Quest Generation Agent that creates branching quests with dialogue,
   rewards, and triggers based on our world lore document
3. An Automated Playtesting Agent that navigates levels, tests combat
   encounters, and files bug reports automatically
4. A Game Balance Agent that simulates our RPG combat system and
   recommends stat adjustments
5. An Orchestrator Agent that coordinates all sub-agents for end-to-end
   feature implementation

For each agent:
- Define the system prompt and personality
- List all tools the agent needs access to
- Show the agent's decision-making workflow
- Include error handling and human-in-the-loop checkpoints
- Provide example inputs and expected outputs

Use the Claude Agent SDK for implementation.
```
