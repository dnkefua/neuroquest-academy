# Game UI/UX Designer

## Role Definition

The Game UI/UX Designer creates intuitive, visually compelling, and accessible user interfaces and experiences for video games — from HUDs and menus to inventory screens, dialogue boxes, maps, and tutorials. This role combines visual design, interaction design, information architecture, and accessibility expertise to ensure players can easily understand and interact with all game systems.

---

## Core Competencies

### 1. HUD (Heads-Up Display) Design

#### HUD Element Placement
```
HUD Layout Principles:
│
├── Screen Zones (Priority Hierarchy):
│   ┌─────────────────────────────────────┐
│   │ TL: Health/Status │ TC: Objectives  │ TR: Minimap/Compass │
│   │                   │    Notifications│                      │
│   ├───────────────────┼─────────────────┤──────────────────────┤
│   │                   │                 │                      │
│   │ ML: Quick Items   │ CENTER: Clean!  │ MR: Target Info      │
│   │    Abilities      │ Minimal HUD     │    Interaction       │
│   │                   │                 │    Prompts           │
│   ├───────────────────┼─────────────────┤──────────────────────┤
│   │ BL: Chat/Log      │ BC: Ability Bar │ BR: Ammo/Resources   │
│   │                   │    Hotbar       │    Score/Timer       │
│   └───────────────────┴─────────────────┴──────────────────────┘
│
├── Design Rules:
│   ├── Keep center of screen clear for gameplay visibility
│   ├── Critical info (health, ammo) at screen edges for peripheral vision
│   ├── Group related elements (health + stamina + status effects)
│   ├── Consistent placement across all game states
│   ├── Scale with screen resolution and aspect ratio
│   └── Safe zones: Keep UI within 90% of screen (TV overscan)
│
└── HUD Modes:
    ├── Full HUD: All information visible (default)
    ├── Minimal HUD: Only critical info (immersive mode)
    ├── No HUD: Complete removal (photo mode, cinematic)
    ├── Context HUD: Show elements only when relevant
    │   (show health only when damaged, ammo only when aiming)
    └── Customizable: Let players toggle/move individual elements
```

### 2. Menu System Design

#### Menu Architecture
```
Menu Flow Chart:
│
├── Main Menu
│   ├── New Game → Character Creation → Difficulty Select → Loading → Game
│   ├── Continue → Loading → Game (at last save)
│   ├── Load Game → Save Slot List → Loading → Game
│   ├── Settings
│   │   ├── Graphics (resolution, quality presets, individual settings)
│   │   ├── Audio (master, music, SFX, voice, subtitle settings)
│   │   ├── Controls (key bindings, controller config, sensitivity)
│   │   ├── Gameplay (difficulty, HUD options, camera settings)
│   │   └── Accessibility (text size, colorblind mode, screen reader)
│   ├── Credits
│   └── Quit
│
├── Pause Menu (in-game)
│   ├── Resume
│   ├── Inventory / Equipment
│   ├── Quest Log / Journal
│   ├── Map
│   ├── Character / Stats / Skill Tree
│   ├── Save / Load
│   ├── Settings (same as main menu settings)
│   └── Quit to Main Menu / Desktop
│
└── Navigation Patterns
    ├── Tab-based (horizontal tabs for categories)
    ├── Hub-based (central screen with sub-menu access)
    ├── Hierarchical (nested menus with back button)
    ├── Radial (controller-friendly wheel selection)
    └── Cursor-based (PC: mouse pointer, Console: virtual cursor or snap)
```

### 3. Inventory & Equipment UI

```
Inventory UI Patterns:
│
├── Grid Inventory (Diablo/Tarkov style)
│   ├── Fixed grid of slots
│   ├── Items occupy variable cell counts (1x1, 2x1, 2x3)
│   ├── Drag-and-drop arrangement
│   ├── Tetris-like space management
│   ├── Right-click context menu (use, drop, inspect)
│   └── Tooltip on hover showing item stats
│
├── List Inventory (RPG standard)
│   ├── Categorized tabs (Weapons, Armor, Items, Quest Items)
│   ├── Scrollable item list with icons
│   ├── Detail panel showing selected item stats
│   ├── Sort options (type, rarity, name, value, recent)
│   ├── Filter options (type, rarity, equipment slot)
│   └── Compare equipped vs. selected item
│
├── Equipment Screen
│   ├── Character model (paperdoll) with slot overlays
│   ├── Equipment slots around character
│   ├── Stat summary panel (shows stat changes on hover)
│   ├── Set bonus display (if applicable)
│   └── Quick-equip from inventory
│
└── Item Tooltip Design
    ┌──────────────────────────────┐
    │ ★★★ Emberblade Longsword     │ (Name + rarity color)
    │ ────────────────────────────  │
    │ Physical Damage: 45-67       │ (Base stats)
    │ Attack Speed: 1.2            │
    │ ────────────────────────────  │
    │ +12-18 Fire Damage           │ (Affixes in blue)
    │ +5% Critical Hit Chance      │
    │ 15% chance to Burn (3s)      │
    │ ────────────────────────────  │
    │ Forgemaster (2/4)            │ (Set info)
    │ (2) +20% Fire Resistance     │
    │ (4) +30% Fire Damage         │
    │ ────────────────────────────  │
    │ Requires: Level 25, STR 30   │ (Requirements)
    │ ────────────────────────────  │
    │ "Forged in the heart of      │ (Flavor text)
    │  Mount Ember"                │
    │ ────────────────────────────  │
    │ Sell Value: 450 Gold         │
    └──────────────────────────────┘
```

### 4. Map & Navigation UI

```
Map System Components:
│
├── Minimap (HUD element)
│   ├── Circular or rectangular frame
│   ├── Player icon with direction indicator (arrow/cone)
│   ├── Nearby points of interest (icons)
│   ├── Cardinal directions (N/S/E/W)
│   ├── Compass alternative (horizontal bar for immersion)
│   ├── Zoom level appropriate to gameplay
│   └── Edge indicators for off-screen objectives
│
├── World Map (full screen)
│   ├── Zoom levels: World → Region → Area → Local
│   ├── Fog of war (unexplored areas hidden/greyed)
│   ├── Icon legend (filterable by category)
│   ├── Waypoint/marker system (player-placed pins)
│   ├── Fast travel points (highlight available destinations)
│   ├── Quest objective markers with paths
│   ├── Discovered points of interest
│   └── Dynamic markers (player party, enemies, events)
│
├── Map Icon Categories
│   ├── 🗡️ Quests (main quest, side quest, daily)
│   ├── 🏠 Locations (towns, dungeons, camps)
│   ├── 🛒 Services (shops, blacksmith, inn)
│   ├── ⚔️ Encounters (enemies, bosses, events)
│   ├── 📦 Collectibles (chests, secrets, lore)
│   ├── 🏔️ Landmarks (viewpoints, fast travel)
│   └── ❓ Undiscovered (question marks, silhouettes)
│
└── Waypoint / Navigation
    ├── On-screen marker (arrow/icon pointing to objective)
    ├── Distance counter (150m, 1.2km)
    ├── Path line on minimap (GPS-style)
    ├── 3D world markers (floating icons at objective)
    └── Toggle-able for immersion seekers
```

### 5. Dialogue & Story UI

```
Dialogue UI Patterns:
│
├── Text Box (Classic RPG)
│   ├── Character portrait + name
│   ├── Text with typewriter effect
│   ├── Advance indicator (press A / click to continue)
│   ├── Auto-advance option (timed)
│   └── Log button (review past dialogue)
│
├── Dialogue Choices
│   ├── Numbered list of options
│   ├── Skill check indicators ([Persuasion 15])
│   ├── Consequence hints (icons for combat, reputation, etc.)
│   ├── Timed choices (pressure decisions)
│   └── Greyed-out locked options (show what's unavailable)
│
├── Dialogue Wheel (BioWare style)
│   ├── Tone indicators (icon for aggressive, diplomatic, funny)
│   ├── Short summary (paraphrase, not exact words)
│   ├── 2-6 options arranged in a wheel
│   └── Consistent position = consistent tone (left=gentle, right=firm)
│
├── Subtitles
│   ├── Speaker name with color coding
│   ├── Size options (small, medium, large, extra large)
│   ├── Background opacity options
│   ├── Font: Clean, readable sans-serif (no decorative fonts)
│   ├── Position: Bottom center (default), adjustable
│   └── Direction indicators ([behind you], [above], [distant])
│
└── Quest Journal
    ├── Active quests with current objective highlighted
    ├── Quest categories (main, side, faction, daily)
    ├── Quest detail view (description, objectives checklist)
    ├── Quest tracking (pin to HUD)
    ├── Completed quests archive
    └── Quest chain visualization
```

### 6. Accessibility Design

#### Accessibility Guidelines
```
Game Accessibility Features:
│
├── Visual Accessibility
│   ├── Colorblind modes (Protanopia, Deuteranopia, Tritanopia)
│   │   - Don't rely on color alone for critical information
│   │   - Add shapes, patterns, or labels alongside color coding
│   │   - Item rarity: Color + icon border + text label
│   ├── Text sizing (50%-200% scaling, minimum 28px at 1080p for body)
│   ├── High contrast mode (enhanced UI contrast)
│   ├── Screen reader support (narrate menus, UI elements)
│   ├── Dyslexia-friendly font option (OpenDyslexic)
│   ├── UI zoom / magnification
│   └── Reduce visual noise options (screen shake, flash, particles)
│
├── Audio Accessibility
│   ├── Subtitles for all dialogue (default ON)
│   ├── Closed captions for sound effects [sword clang], [footsteps approaching]
│   ├── Visual audio indicators (sound radar, directional indicators)
│   ├── Mono audio option
│   ├── Independent volume controls per category
│   └── Visual cue alternatives for all audio-only information
│
├── Motor Accessibility
│   ├── Full key remapping (keyboard and controller)
│   ├── Toggle vs. hold options for all held inputs
│   ├── One-handed control schemes
│   ├── Adjustable input timing (QTE windows, combo timing)
│   ├── Aim assist options (strength, snap, slowdown)
│   ├── Auto-lock-on option
│   ├── Adjustable dead zones and sensitivity
│   └── Co-pilot mode (second controller assists)
│
├── Cognitive Accessibility
│   ├── Tutorial replay option
│   ├── Objective reminders (what am I doing?)
│   ├── Navigation assistance (waypoint systems, GPS lines)
│   ├── Difficulty options (separate combat, puzzle, exploration)
│   ├── Save anywhere (not just checkpoints)
│   ├── Clear, concise UI text
│   └── Consistent button prompts (show correct input device)
│
└── Standards & Resources
    ├── Xbox Accessibility Guidelines (XAGs)
    ├── IGDA Game Accessibility SIG
    ├── AbleGamers Charity guidelines
    ├── SpecialEffect resources
    └── WCAG 2.1 adapted for games
```

### 7. UI Art & Visual Design

```
UI Art Direction:
│
├── Style Consistency
│   ├── Match game's visual theme (medieval = parchment, sci-fi = holographic)
│   ├── Color palette derived from game art (primary, secondary, accent)
│   ├── Border/frame styles consistent across all menus
│   ├── Icon style: Consistent line weight, perspective, detail level
│   └── Typography: Max 2-3 fonts (title, body, numbers)
│
├── Responsive Layouts
│   ├── Support 16:9, 16:10, 21:9 (ultrawide), 4:3
│   ├── Scale UI elements based on screen size
│   ├── Anchor points: Center, corners, edges with margins
│   ├── Safe area compliance (TV overscan, notches, rounded corners)
│   └── DPI awareness (crisp UI at all resolutions)
│
├── Animation & Feedback
│   ├── Micro-animations on hover/select (scale, glow, bounce)
│   ├── Transition animations between menus (slide, fade, dissolve)
│   ├── Loading indicators (progress bars, spinners, tips)
│   ├── Confirmation feedback (color flash, sound, haptic)
│   └── Keep animations fast (< 200ms for transitions)
│
├── Controller vs. Mouse Design
│   ├── Controller: Selection-based navigation (D-pad/stick movement)
│   ├── Mouse: Hover states, click targets, scroll wheels
│   ├── Touch: Large tap targets (44x44px minimum), swipe gestures
│   ├── Auto-detect input device and switch prompts
│   └── All UI must work with ALL supported input methods
│
└── Common UI Components
    ├── Button (normal, hover, pressed, disabled, selected states)
    ├── Slider (horizontal, vertical, with value display)
    ├── Toggle / Checkbox
    ├── Dropdown / Select
    ├── Scroll view (scrollbar + mouse wheel + stick)
    ├── Tab bar (horizontal navigation)
    ├── Tooltip (hover-triggered info panel)
    ├── Modal / Dialog (confirmation, alerts)
    ├── Progress bar (XP, loading, cooldown)
    └── Notification / Toast (temporary pop-up messages)
```

---

## UI Implementation Technologies

| Engine | UI System | Approach |
|--------|-----------|----------|
| **Unity** | UI Toolkit (UXML + USS) | Web-inspired (HTML/CSS-like), recommended |
| **Unity** | uGUI (Canvas) | Traditional Unity UI, still widely used |
| **Unreal** | UMG (Unreal Motion Graphics) | Blueprint/C++ widgets, WYSIWYG editor |
| **Unreal** | Common UI Plugin | Enhanced UMG with gamepad-first design |
| **Godot** | Control Nodes | Node-based, built-in theming system |
| **Custom** | Dear ImGui | Immediate-mode, great for debug/tools UI |
| **Web/Mobile** | React/HTML | For launcher, web companions, overlay |

---

## Example Prompt for AI-Assisted UI/UX

```
You are a Game UI/UX Designer. I'm building a 3D action RPG in Unity.
Design the complete UI system:

1. HUD layout: Design the in-game HUD showing health, stamina, mana,
   ability cooldowns, minimap, quest tracker, and interaction prompts.
   Must support 16:9 and 21:9 aspect ratios
2. Inventory system UI: Grid-based inventory with equipment paperdoll,
   item tooltips showing stat comparisons, drag-and-drop, and sorting
3. Skill tree UI: Interactive node graph for 3 specialization paths,
   with prerequisite visualization, point allocation, and preview
4. Dialogue UI: Character portraits, typewriter text, branching choices
   with skill check indicators, and conversation log
5. Accessibility: Implement colorblind modes, text scaling, button
   remapping UI, and subtitle options

For each screen:
- Provide wireframe layout with dimensions and anchoring
- Specify UI Toolkit (UXML + USS) implementation
- Include all interaction states (hover, selected, disabled)
- Controller AND mouse navigation support
- Responsive scaling rules
```
