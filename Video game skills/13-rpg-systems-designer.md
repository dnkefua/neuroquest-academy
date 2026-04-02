# RPG Systems Designer

## Role Definition

The RPG Systems Designer architects and implements the interconnected systems that define role-playing games — character progression, combat mechanics, inventory and equipment, quest systems, dialogue trees, crafting, skill trees, loot generation, economy balancing, and world simulation. This role combines game design theory with technical implementation to create deep, engaging RPG experiences across sub-genres (JRPG, WRPG, Action RPG, CRPG, Roguelike RPG, MMORPG).

---

## Core Competencies

### 1. Character & Progression Systems

#### Stat Systems
```
Core RPG Statistics:
├── Primary Stats (player-controlled growth)
│   ├── Strength (STR) — Physical damage, carry weight
│   ├── Dexterity (DEX) — Attack speed, dodge chance, ranged accuracy
│   ├── Intelligence (INT) — Magic damage, mana pool, skill effectiveness
│   ├── Vitality (VIT) / Constitution (CON) — HP, resistances, stamina
│   ├── Wisdom (WIS) — Mana regen, buff duration, perception
│   └── Charisma (CHA) — NPC prices, dialogue options, companion morale
│
├── Derived Stats (calculated from primaries + equipment)
│   ├── Health Points (HP) = Base + VIT * ScaleFactor + Equipment
│   ├── Mana Points (MP) = Base + INT * ScaleFactor + Equipment
│   ├── Physical Attack = STR * WeaponScale + WeaponBaseDamage
│   ├── Magic Attack = INT * StaffScale + SpellBaseDamage
│   ├── Physical Defense = Armor Rating + VIT * DefenseScale
│   ├── Magic Defense = MagicArmor + WIS * MDefScale
│   ├── Attack Speed = BaseSpeed * (1 + DEX * SpeedScale)
│   ├── Critical Chance = BaseCrit + DEX * CritScale (capped)
│   ├── Critical Damage = 150% + CritDamageBonus
│   ├── Dodge/Evasion = BaseDodge + DEX * DodgeScale (capped)
│   └── Move Speed = BaseSpeed * (1 + SpeedBonuses)
│
└── Stat Scaling Formulas
    ├── Linear: Stat = Base + (Level * GrowthRate)
    ├── Diminishing Returns: Stat = Max * (1 - e^(-Level * Rate))
    ├── Soft Cap: Full growth to cap, reduced growth after
    └── Logarithmic: Stat = Base + Log(Level) * Scale
```

#### Experience & Leveling
```
XP Curve Formulas:
├── Linear: XP(L) = BaseXP * L
├── Quadratic: XP(L) = BaseXP * L²
├── Cubic: XP(L) = BaseXP * L³
├── Custom: XP(L) = Floor(BaseXP * L^Exponent * Multiplier)
│
Example (Quadratic with smoothing):
  Level 1→2:   100 XP
  Level 5→6:   500 XP
  Level 10→11: 1,500 XP
  Level 20→21: 5,000 XP
  Level 50→51: 25,000 XP
  Level 99→100: 100,000 XP

Level-Up Rewards:
├── Stat point allocation (player choice)
├── Automatic stat growth (class-based)
├── New ability unlock (at specific levels)
├── Skill points for skill tree
├── Passive bonuses (HP+, crit+, etc.)
└── Title / Rank upgrades
```

#### Class / Job Systems
```
Class System Archetypes:
│
├── Fixed Class (choose at start, permanent)
│   Example: Diablo, Dragon Age
│   └── Subclass specialization at mid-game
│
├── Job System (switchable, cross-class abilities)
│   Example: Final Fantasy V, Bravely Default, Octopath Traveler
│   └── Learn abilities in one job, use in another
│
├── Classless (freeform skill-based)
│   Example: Elder Scrolls, Path of Exile
│   └── Skills improve through use or point investment
│
├── Multi-Class (combine two or more)
│   Example: D&D, Baldur's Gate 3
│   └── Split levels between classes
│
└── Common RPG Classes:
    ├── Warrior / Fighter — High HP, physical damage, tank
    ├── Mage / Wizard — High magic damage, low HP, AOE spells
    ├── Rogue / Thief — High crit, stealth, debuffs
    ├── Healer / Cleric — Healing, buffs, support
    ├── Ranger / Archer — Ranged physical, summons, traps
    └── Hybrid classes (Paladin, Battlemage, Spellthief, etc.)
```

### 2. Combat Systems

#### Turn-Based Combat
```
Turn-Based Combat Variants:
│
├── Traditional Turn-Based
│   └── Each unit acts once per round in speed order
│       Example: Dragon Quest, Pokémon, early Final Fantasy
│
├── Active Time Battle (ATB)
│   └── ATB gauge fills based on speed; act when full
│       Example: Final Fantasy IV-IX, Chrono Trigger
│
├── Conditional Turn-Based (CTB)
│   └── Actions have different recovery times; no fixed rounds
│       Example: Final Fantasy X, Grandia
│
├── Phase-Based / Team Turn
│   └── All player units act, then all enemies act
│       Example: Fire Emblem, XCOM (tactics variant)
│
└── Press Turn / One More
    └── Exploiting weakness grants extra turns
        Example: Shin Megami Tensei, Persona

Damage Formula Examples:
├── Simple: Damage = ATK - DEF (minimum 1)
├── Multiplicative: Damage = ATK * (ATK / (ATK + DEF))
├── Pokemon-style: ((2*Lvl/5+2) * Power * A/D) / 50 + 2) * Modifier
├── Final Fantasy: Damage = ATK * (random(0.9, 1.1)) - DEF * DefMult
└── Dark Souls: Damage = WeaponBase * ScalingBonus * MotionValue - FlatDef * AbsMult
```

#### Action Combat
```
Action Combat Components:
├── Attack System
│   ├── Light attack → Heavy attack → Special chains
│   ├── Combo counter and combo windows (frame data)
│   ├── Hit detection (hitbox/hurtbox system)
│   ├── Hit-stop (freeze frames on impact for weight)
│   ├── Knockback / Hitstun on enemies
│   └── Damage calculation per hit
│
├── Defense System
│   ├── Block (reduce damage, stamina cost)
│   ├── Parry/Perfect Block (timing-based, counter window)
│   ├── Dodge Roll (i-frames, stamina cost, recovery)
│   ├── Armor / Poise (resist stagger thresholds)
│   └── Shield mechanics (durability, stability)
│
├── Stamina / Resource Management
│   ├── Actions consume stamina/energy
│   ├── Recovery rate (passive + active)
│   ├── Depletion penalties (stagger, slow)
│   └── Management as core skill expression
│
└── Enemy Design
    ├── Attack patterns (telegraphed, learnable)
    ├── Phase transitions (new moves at HP thresholds)
    ├── Weaknesses and resistances
    ├── Stagger/break mechanics
    └── Boss design (arena, gimmicks, spectacle)
```

### 3. Inventory & Equipment Systems

```
Inventory System Architecture:
│
├── Storage Model
│   ├── Slot-Based: Fixed grid (Diablo, Resident Evil)
│   ├── List-Based: Unlimited items in a scrollable list (most JRPGs)
│   ├── Weight-Based: Carry capacity limit (Skyrim, Elden Ring)
│   └── Hybrid: Categories with slot limits + weight
│
├── Item Categories
│   ├── Weapons (swords, bows, staves, etc.)
│   ├── Armor (head, chest, legs, feet, hands)
│   ├── Accessories (rings, necklaces, trinkets)
│   ├── Consumables (potions, food, scrolls)
│   ├── Materials (crafting components)
│   ├── Quest Items (key items, special objects)
│   └── Currency (gold, gems, tokens)
│
├── Equipment Slots
│   ├── Main Hand / Off Hand
│   ├── Head / Chest / Legs / Feet / Hands
│   ├── Ring (1-2 slots) / Necklace / Belt
│   └── Special slots (mount, pet, cosmetic override)
│
├── Item Properties
│   ├── Rarity: Common → Uncommon → Rare → Epic → Legendary → Mythic
│   ├── Base stats (damage, armor, speed, etc.)
│   ├── Bonus stats (random affixes: +STR, +Crit, etc.)
│   ├── Set bonuses (wear multiple pieces for bonus)
│   ├── Unique effects (on-hit procs, passives)
│   ├── Requirements (level, stat minimums, class)
│   ├── Durability (optional, repair mechanic)
│   └── Sockets / Enchantment slots
│
└── Item Data Structure
    {
      "id": "sword_flame_001",
      "name": "Emberforge Blade",
      "type": "weapon",
      "subtype": "sword",
      "rarity": "epic",
      "level_requirement": 25,
      "base_stats": {
        "physical_damage": [45, 67],
        "attack_speed": 1.2
      },
      "affixes": [
        { "type": "fire_damage", "value": [12, 18] },
        { "type": "critical_chance", "value": 0.05 },
        { "type": "on_hit", "effect": "burn", "chance": 0.15, "duration": 3 }
      ],
      "set": "Forgemaster",
      "set_bonus_2pc": { "fire_resistance": 0.20 },
      "set_bonus_4pc": { "fire_damage_mult": 1.30 },
      "flavor_text": "Forged in the heart of Mount Ember, this blade never cools.",
      "icon": "items/weapons/sword_flame_001",
      "model": "models/weapons/sword_flame_001"
    }
```

### 4. Quest Systems

```
Quest System Architecture:
│
├── Quest Types
│   ├── Main Story Quests (linear or branching critical path)
│   ├── Side Quests (optional, world-building, rewards)
│   ├── Faction Quests (reputation-gated questlines)
│   ├── Daily/Weekly Quests (live-ops engagement)
│   ├── Bounties / Hunts (repeatable combat tasks)
│   └── Hidden Quests (discovered through exploration / dialogue)
│
├── Quest Structure
│   ├── Quest Giver → Objectives → Completion → Reward
│   ├── Multi-stage with branching paths
│   ├── Prerequisite chains (quest A unlocks quest B)
│   └── Fail conditions (timer, wrong choice, NPC death)
│
├── Objective Types
│   ├── Kill (defeat N enemies of type X)
│   ├── Collect (gather N items)
│   ├── Deliver (bring item to NPC)
│   ├── Escort (protect NPC through area)
│   ├── Explore (reach location, discover area)
│   ├── Talk (speak to specific NPC)
│   ├── Craft (create specific item)
│   ├── Solve (puzzle, riddle, investigation)
│   └── Choice (make a narrative decision)
│
├── Quest State Machine
│   ├── Unavailable → Available → Active → Completed/Failed
│   ├── Each objective: Inactive → Active → Completed/Failed
│   └── Track all states for save/load
│
├── Reward System
│   ├── Experience points
│   ├── Currency (gold, premium)
│   ├── Items (fixed or chosen from options)
│   ├── Reputation with factions
│   ├── Ability unlocks
│   ├── World state changes
│   └── Story progression
│
└── Quest Data Format
    {
      "id": "quest_lost_heirloom",
      "name": "The Lost Heirloom",
      "description": "Elder Morath's family heirloom was stolen...",
      "type": "side_quest",
      "level_range": [10, 15],
      "prerequisites": ["quest_arrive_village"],
      "giver": "npc_elder_morath",
      "stages": [
        {
          "id": "investigate",
          "objectives": [
            { "type": "talk", "target": "npc_innkeeper", "hint": "Ask around" },
            { "type": "explore", "target": "zone_thief_hideout", "hint": "Follow tracks" }
          ]
        },
        {
          "id": "confront_or_sneak",
          "branch": true,
          "options": [
            {
              "id": "confront",
              "objectives": [{ "type": "kill", "target": "enemy_thief_leader", "count": 1 }],
              "reputation_change": { "village": +10, "thieves_guild": -20 }
            },
            {
              "id": "sneak",
              "objectives": [{ "type": "collect", "target": "item_heirloom_pendant", "count": 1 }],
              "reputation_change": { "village": +5, "thieves_guild": 0 }
            }
          ]
        },
        {
          "id": "return",
          "objectives": [{ "type": "deliver", "item": "item_heirloom_pendant", "target": "npc_elder_morath" }]
        }
      ],
      "rewards": {
        "xp": 500,
        "gold": 200,
        "items": [{ "id": "ring_protection_01", "chance": 1.0 }]
      }
    }
```

### 5. Dialogue Systems

```
Dialogue System Architecture:
│
├── Dialogue Formats
│   ├── Linear: NPC says lines in sequence (simple exposition)
│   ├── Branching: Player choices lead to different responses/outcomes
│   ├── Hub: Central dialogue node with multiple selectable topics
│   ├── Conditional: Lines appear based on game state (quests, stats, items)
│   └── Procedural: AI-generated contextual dialogue (LLM-powered)
│
├── Dialogue Features
│   ├── Character portraits with emotion variants
│   ├── Text typewriter effect with variable speed
│   ├── Voice acting integration (audio clip per line)
│   ├── Lip sync (viseme mapping or AI-driven)
│   ├── Stat/skill checks in dialogue ([Persuasion 15] option)
│   ├── Reputation-gated options
│   ├── Item-gated options ("I have the key" only if carrying key)
│   ├── Consequences tracking (choice → world state change)
│   └── Localization support (string table per language)
│
├── Scripting Tools
│   ├── Ink (inkle) — Powerful narrative scripting language
│   ├── Yarn Spinner — Unity-focused dialogue scripting
│   ├── Twine — Visual dialogue tree editor (prototyping)
│   ├── Articy:draft — Professional narrative design tool
│   └── Custom node-based dialogue editor
│
└── Dialogue Data Example (Yarn Spinner format)
    ```yarn
    title: ElderMorath_QuestStart
    ---
    Elder Morath: Adventurer, I need your help.
    Elder Morath: My family's heirloom — a pendant passed down for generations — has been stolen.
    -> Who would steal from you? #curious
        Elder Morath: I suspect the bandits camped in the eastern caves.
        <<set $quest_lost_heirloom to "active">>
    -> What's in it for me? #mercenary
        <<if $charisma >= 15>>
            Elder Morath: Your reputation precedes you. 300 gold and my personal gratitude.
            <<set $quest_reward_bonus to true>>
        <<else>>
            Elder Morath: 200 gold. That's all this old man can offer.
        <<endif>>
        <<set $quest_lost_heirloom to "active">>
    -> Sorry, I'm busy. #decline
        Elder Morath: I understand. Come back if you change your mind.
    ===
    ```
```

### 6. Loot & Drop Systems

```
Loot Table Architecture:
│
├── Drop Table Structure
│   ├── Guaranteed drops (always drop on kill)
│   ├── Random drops (chance-based per item)
│   ├── Weighted random (higher weight = more common)
│   ├── Tiered drops (roll rarity first, then item within rarity)
│   └── Pity system (guaranteed rare after N rolls without one)
│
├── Rarity Distribution (Example)
│   ├── Common:    60%  (white)
│   ├── Uncommon:  25%  (green)
│   ├── Rare:      10%  (blue)
│   ├── Epic:       4%  (purple)
│   ├── Legendary:  0.9% (orange)
│   └── Mythic:    0.1% (red)
│
├── Affix Generation (Diablo-style)
│   ├── Prefix pool (1-3 prefixes based on rarity)
│   ├── Suffix pool (1-3 suffixes based on rarity)
│   ├── Value ranges per affix (min-max, rolled on drop)
│   ├── Affix weighting (some affixes rarer than others)
│   └── Mutually exclusive affixes (can't have +fire and +ice on same item)
│
└── Smart Loot
    ├── Class-weighted: Higher chance for current class items
    ├── Level-scaled: Items scale to player level (within range)
    ├── Bad luck protection: Increase rare chance with consecutive common drops
    └── Targeted farming: Specific bosses drop specific legendary items
```

### 7. Crafting Systems

```
Crafting System Types:
│
├── Recipe-Based (predefined combinations)
│   └── Example: Combine Iron Ore + Wood = Iron Sword
│       Games: Minecraft, Terraria
│
├── Blueprint / Pattern (learn recipes, then craft)
│   └── Example: Find "Steel Sword" blueprint, gather materials
│       Games: The Witcher 3, Monster Hunter
│
├── Experimentation (discover recipes by combining)
│   └── Example: Try combining items to discover new recipes
│       Games: Breath of the Wild, Atelier series
│
├── Station-Based (specific crafting stations)
│   └── Forge → weapons, Alchemy Table → potions, Workbench → tools
│       Games: Skyrim, New World
│
└── Enchantment / Upgrade (improve existing items)
    └── Add affixes, upgrade rarity, socket gems
        Games: Diablo, Path of Exile
```

---

## RPG Data Architecture

```
RPG Data Schema Overview:
│
├── Characters/
│   ├── PlayerCharacter.json (stats, class, level, equipment refs)
│   ├── NPCs/ (dialogue refs, shop inventory, schedules)
│   └── Enemies/ (stats, AI behavior, loot table refs, abilities)
│
├── Items/
│   ├── Weapons/ (base stats, scaling, requirements)
│   ├── Armor/ (defense stats, set info)
│   ├── Consumables/ (effects, duration, stacking)
│   ├── Materials/ (crafting components)
│   └── AffixPool.json (all possible item affixes)
│
├── Abilities/
│   ├── SkillTree.json (node layout, connections, costs)
│   ├── ActiveAbilities/ (damage, cooldown, mana cost, effects)
│   └── PassiveAbilities/ (stat bonuses, triggers, conditions)
│
├── Quests/
│   ├── MainQuests/ (story quest chains)
│   ├── SideQuests/ (optional quests)
│   └── QuestPrerequisites.json (dependency graph)
│
├── Dialogue/
│   ├── NPC dialogue scripts (Ink/Yarn files)
│   └── Localization/ (string tables per language)
│
├── World/
│   ├── LootTables/ (per enemy, per zone, per chest type)
│   ├── ShopInventories/ (per merchant, refresh rates)
│   ├── EncounterTables/ (per zone, level scaling)
│   └── WorldState.json (flags, variables, reputation)
│
└── Balance/
    ├── XPCurve.json (level → XP required)
    ├── StatScaling.json (level → stat growth per class)
    ├── DamageFormulas.json (calculation parameters)
    └── EconomyConfig.json (gold sinks/faucets, prices)
```

---

## Example Prompt for AI-Assisted RPG Design

```
You are an RPG Systems Designer. I'm building a single-player action RPG
in Unity with the following vision:

- Dark fantasy setting, souls-like combat with RPG depth
- 6 character classes with unique skill trees
- Equipment system with random affixes (Diablo-style loot)
- Crafting and enchanting systems
- 40+ hour main quest with branching narrative
- Faction reputation affecting available quests and endings

Design and implement:
1. Complete stat system with primary stats, derived stats, and scaling
   formulas for all 6 classes (Warrior, Mage, Rogue, Cleric, Ranger, Paladin)
2. Damage formula that accounts for attack type, defense, elemental
   resistances, critical hits, and status effects
3. Loot generation system with rarity tiers, random affixes, set items,
   and legendary uniques — including loot tables for 5 enemy types
4. Skill tree system with 30+ nodes per class, prerequisite paths,
   and synergies between skills
5. Quest system data format with branching stages, reputation consequences,
   and multiple endings based on accumulated choices

For each system, provide:
- Data structures (C# classes / ScriptableObjects)
- Core algorithms with mathematical formulas
- Balance spreadsheets with example values for levels 1-50
- Edge cases and anti-exploit considerations
```
