# Game Testing & QA Specialist

## Role Definition

The Game Testing & QA Specialist ensures that video games meet quality standards through systematic testing, automated test frameworks, performance profiling, bug tracking, and certification compliance. This role catches crashes, gameplay bugs, performance issues, visual glitches, and UX problems before they reach players — covering everything from unit tests and integration tests to full playtesting protocols and platform certification.

---

## Core Competencies

### 1. Testing Strategy & Planning

#### Test Pyramid for Games
```
Game Testing Pyramid:
│
│         /\
│        /  \        Manual Playtesting
│       / PT \       (Exploratory, UX, Game Feel, Fun Factor)
│      /──────\
│     / System \     System / Integration Tests
│    /  Tests   \    (Quest flows, combat encounters, save/load, multiplayer)
│   /────────────\
│  /  Functional  \  Functional Tests
│ /    Tests       \ (Component behavior, state machines, UI interactions)
│/──────────────────\
│    Unit Tests      Unit Tests
│    (Pure logic)    (Damage calc, loot generation, pathfinding, stat formulas)
│
│ ◄── More automated, faster, cheaper ──────────────────── More manual, slower, expensive ──►
│ ◄── Run frequently (every commit) ──────────────────── Run periodically (milestone) ──►
```

#### Test Plan Structure
```
Game Test Plan:
│
├── 1. Scope & Objectives
│   ├── What is being tested (feature, build, milestone)
│   ├── Platforms and configurations to test
│   ├── Quality gates (criteria for pass/fail)
│   └── Risk areas requiring extra attention
│
├── 2. Test Categories
│   ├── Functional Testing (features work as designed)
│   ├── Regression Testing (old features still work)
│   ├── Compatibility Testing (hardware, OS, drivers)
│   ├── Performance Testing (FPS, load times, memory)
│   ├── Localization Testing (translations, text overflow, cultural)
│   ├── Compliance Testing (platform cert requirements)
│   ├── Security Testing (exploits, data protection)
│   ├── Accessibility Testing (against accessibility guidelines)
│   └── Multiplayer Testing (netcode, sync, matchmaking, stress)
│
├── 3. Test Environment
│   ├── Hardware matrix (min spec, recommended, high-end)
│   ├── Platform dev kits (PS5, Xbox, Switch)
│   ├── Network conditions (LAN, broadband, 4G, packet loss)
│   └── Build delivery and installation process
│
├── 4. Schedule
│   ├── Daily: Smoke tests on nightly builds
│   ├── Sprint: Feature-specific test passes
│   ├── Milestone: Full regression + compliance check
│   └── Pre-cert: Platform-specific certification test pass
│
└── 5. Reporting
    ├── Bug tracking tool (Jira, Linear, Shortcut, Mantis)
    ├── Bug severity classification
    ├── Daily test status reports
    ├── Burn-down charts (bugs over time)
    └── Go/no-go criteria for milestones
```

### 2. Bug Classification & Reporting

#### Bug Severity Levels
```
Severity Classification:
│
├── S1 — CRITICAL (Blocker)
│   ├── Game crash / hard lock requiring restart
│   ├── Data loss (save corruption, progress wipe)
│   ├── Security vulnerability (exploits, data exposure)
│   ├── Progression blocker (can't advance, stuck in game)
│   └── Platform certification failure
│
├── S2 — HIGH (Major)
│   ├── Major feature not working as intended
│   ├── Frequent soft locks (must reload save, not restart app)
│   ├── Significant visual corruption (black screen, Z-fighting, T-pose)
│   ├── Multiplayer desync affecting gameplay
│   └── Performance drop below target (< 20 FPS sustained)
│
├── S3 — MEDIUM (Moderate)
│   ├── Feature partially working with workaround available
│   ├── Infrequent visual glitches (clipping, pop-in, LOD issues)
│   ├── Audio issues (missing sounds, incorrect triggers)
│   ├── UI issues (misalignment, overlapping text, wrong icons)
│   └── Minor gameplay imbalance
│
├── S4 — LOW (Minor)
│   ├── Cosmetic issues (typos, minor visual polish)
│   ├── Rare edge-case bugs with easy workaround
│   ├── Suggestions and improvements
│   └── Documentation issues
│
└── S5 — TRIVIAL
    └── Nice-to-have improvements, polish items
```

#### Bug Report Template
```
Bug Report Template:
│
├── Title: [Area] Brief description of the issue
│   Example: [Combat] Player takes double damage when parrying fire attacks
│
├── Severity: S2 - HIGH
├── Priority: P1 (fix this sprint)
├── Platform: PS5, also reproduced on PC
├── Build Version: v0.9.3-nightly-20260315
├── Area: Combat System
├── Assignee: @combat-team
│
├── Steps to Reproduce:
│   1. Equip any shield
│   2. Engage a fire-type enemy (e.g., Fire Imp in Ember Caves)
│   3. Perform a parry (L1) timing the fire projectile
│   4. Observe damage numbers
│
├── Expected Result:
│   Parry should deflect the fire projectile, dealing 0 damage to player
│
├── Actual Result:
│   Player takes 2x the normal fire damage (e.g., 120 instead of 60)
│   Parry animation plays but damage is still applied
│
├── Reproduction Rate: 100% (10/10 attempts)
│
├── Attachments:
│   ├── Screenshot: fire_parry_bug_01.png
│   ├── Video: fire_parry_repro.mp4
│   └── Save file: save_before_bug.sav
│
└── Additional Notes:
    Non-fire attacks parry correctly.
    Issue may be related to the elemental damage rework in build v0.9.2.
```

### 3. Automated Testing

#### Unit Testing (Game Logic)
```csharp
// Unity Test Framework - Example: Damage calculation tests
[TestFixture]
public class DamageCalculationTests
{
    private DamageCalculator _calculator;

    [SetUp]
    public void Setup()
    {
        _calculator = new DamageCalculator();
    }

    [Test]
    public void PhysicalDamage_WithNoDefense_ReturnsFullDamage()
    {
        var attacker = new CombatStats { PhysicalAttack = 100 };
        var defender = new CombatStats { PhysicalDefense = 0 };

        float damage = _calculator.CalculatePhysicalDamage(attacker, defender);

        Assert.AreEqual(100f, damage, 0.01f);
    }

    [Test]
    public void PhysicalDamage_WithDefense_ReducesDamage()
    {
        var attacker = new CombatStats { PhysicalAttack = 100 };
        var defender = new CombatStats { PhysicalDefense = 50 };

        float damage = _calculator.CalculatePhysicalDamage(attacker, defender);

        Assert.That(damage, Is.InRange(50f, 80f)); // Depends on formula
    }

    [Test]
    public void CriticalHit_DoublesBaseDamage()
    {
        var attacker = new CombatStats { PhysicalAttack = 100, CritDamage = 2.0f };
        var defender = new CombatStats { PhysicalDefense = 0 };

        float damage = _calculator.CalculateCriticalDamage(attacker, defender);

        Assert.AreEqual(200f, damage, 0.01f);
    }

    [Test]
    public void Damage_NeverBelowMinimum()
    {
        var attacker = new CombatStats { PhysicalAttack = 1 };
        var defender = new CombatStats { PhysicalDefense = 9999 };

        float damage = _calculator.CalculatePhysicalDamage(attacker, defender);

        Assert.That(damage, Is.GreaterThanOrEqualTo(1f)); // Min damage = 1
    }

    [TestCase(1, 100)]
    [TestCase(10, 1500)]
    [TestCase(50, 125000)]
    [TestCase(99, 970200)]
    public void XPRequirement_ScalesCorrectly(int level, int expectedXP)
    {
        int xp = ProgressionSystem.XPRequiredForLevel(level);
        Assert.AreEqual(expectedXP, xp);
    }

    [Test]
    public void LootTable_RespectsProbabilities()
    {
        var lootTable = new LootTable(/* ... */);
        var results = new Dictionary<Rarity, int>();
        int trials = 100000;

        for (int i = 0; i < trials; i++)
        {
            var item = lootTable.Roll();
            results.TryAdd(item.Rarity, 0);
            results[item.Rarity]++;
        }

        float legendaryRate = results[Rarity.Legendary] / (float)trials;
        Assert.That(legendaryRate, Is.InRange(0.008f, 0.012f)); // ~1% ± tolerance
    }
}
```

#### Integration Tests
```csharp
// Play Mode tests (Unity) - Test actual game behavior
[UnityTest]
public IEnumerator QuestSystem_CompleteObjective_AdvancesQuestStage()
{
    // Setup
    var questManager = Object.Instantiate(questManagerPrefab);
    var quest = ScriptableObject.CreateInstance<QuestData>();
    quest.SetupTestQuest("test_quest", 3); // 3 objectives

    questManager.StartQuest(quest);

    // Act
    questManager.CompleteObjective("test_quest", 0);
    yield return null; // Wait one frame for events to process

    // Assert
    Assert.AreEqual(QuestStage.Stage2, questManager.GetQuestStage("test_quest"));
    Assert.IsTrue(questManager.IsObjectiveComplete("test_quest", 0));
    Assert.IsFalse(questManager.IsObjectiveComplete("test_quest", 1));
}

[UnityTest]
public IEnumerator SaveLoad_PreservesPlayerState()
{
    // Setup: Create player with specific state
    var player = SpawnTestPlayer();
    player.SetHealth(75);
    player.SetPosition(new Vector3(10, 0, 20));
    player.Inventory.AddItem("sword_01");
    player.Inventory.AddItem("potion_hp_01", 5);

    // Save
    SaveSystem.Save("test_save");
    yield return null;

    // Destroy and reload
    Object.Destroy(player.gameObject);
    yield return null;

    SaveSystem.Load("test_save");
    yield return null;

    // Assert
    var loadedPlayer = FindObjectOfType<PlayerController>();
    Assert.AreEqual(75, loadedPlayer.Health);
    Assert.AreEqual(new Vector3(10, 0, 20), loadedPlayer.transform.position);
    Assert.IsTrue(loadedPlayer.Inventory.HasItem("sword_01"));
    Assert.AreEqual(5, loadedPlayer.Inventory.GetItemCount("potion_hp_01"));
}
```

### 4. Performance Testing & Profiling

```
Performance Testing Checklist:
│
├── Frame Rate Testing
│   ├── Target FPS by platform (60fps PC, 30/60fps console, 30fps mobile)
│   ├── Minimum FPS (never below 20fps)
│   ├── 1% low / 0.1% low frame times (stutter detection)
│   ├── Frame time consistency (avoid variable frame pacing)
│   └── Benchmark scenarios: Combat, open world, UI heavy, worst case
│
├── Memory Testing
│   ├── Peak memory usage by platform
│   │   PC: < 8 GB RAM, < 6 GB VRAM
│   │   PS5: < 12 GB (unified)
│   │   Switch: < 3.2 GB
│   │   Mobile: < 1.5 GB
│   ├── Memory leak detection (play for 4+ hours)
│   ├── Asset memory breakdown (textures, meshes, audio, scripts)
│   └── Garbage collection impact (GC spikes in managed code)
│
├── Loading Time Testing
│   ├── Initial boot time (< 10s to interactive menu)
│   ├── Level load time (target per platform)
│   ├── Fast travel / teleport time
│   ├── Save/load operation time
│   └── Asset streaming pop-in evaluation
│
├── GPU Testing
│   ├── Draw call count per scene
│   ├── Triangle count per frame
│   ├── Shader complexity (ALU/TEX operations)
│   ├── Overdraw (transparent layers)
│   ├── GPU memory bandwidth
│   └── Post-processing cost breakdown
│
├── Network Performance (Multiplayer)
│   ├── Bandwidth usage per player
│   ├── Latency sensitivity (playable up to what ping?)
│   ├── Packet loss tolerance (% before noticeable degradation)
│   ├── Server tick rate compliance
│   └── Rubber-banding / desync frequency
│
└── Profiling Tools
    ├── Unity: Profiler, Frame Debugger, Memory Profiler, Profile Analyzer
    ├── Unreal: Unreal Insights, Stat commands, GPU Visualizer
    ├── Cross-platform: RenderDoc, PIX, NSight, Tracy, Superluminal
    ├── Mobile: Xcode Instruments, Android GPU Inspector, Snapdragon Profiler
    └── Custom: In-game frame time graph, memory tracker, stat overlay
```

### 5. Platform Certification Testing

```
Platform Certification Requirements:
│
├── Sony PlayStation (TRC - Technical Requirements Checklist)
│   ├── Title and trophy requirements
│   ├── Save data management and cloud save
│   ├── User account handling (multiple PSN accounts)
│   ├── Activity cards and Game Help (PS5)
│   ├── DualSense features (haptic, adaptive triggers)
│   ├── Error handling and network disconnection
│   ├── Suspend/resume behavior
│   ├── Age rating compliance
│   ├── Accessibility requirements
│   └── Performance: No crashes, no TRC-failing frame rate drops
│
├── Microsoft Xbox (XR - Xbox Requirements)
│   ├── Xbox Live integration requirements
│   ├── Achievement requirements
│   ├── Smart Delivery (Xbox One + Series X versions)
│   ├── Quick Resume support
│   ├── Controller disconnection handling
│   ├── User sign-in/sign-out handling
│   ├── Cloud gaming compatibility
│   ├── Accessibility: Xbox Accessibility Guidelines
│   └── Performance: Series X (4K/60), Series S (1080-1440p)
│
├── Nintendo Switch (Lotcheck)
│   ├── Controller configuration (Joy-Con, Pro, handheld)
│   ├── Sleep mode behavior
│   ├── Dock/undock transitions
│   ├── Display resolution (720p handheld, 1080p docked)
│   ├── Performance targets (30fps minimum)
│   ├── Memory budget (3.2 GB available)
│   ├── Save data size limits
│   ├── Nintendo Account integration
│   └── Content guidelines compliance
│
├── Steam (No formal cert, but checklist)
│   ├── Steam Cloud save integration
│   ├── Achievements
│   ├── Controller support (Steam Input API)
│   ├── Steam Deck verification
│   │   ├── Runs natively on Linux/Proton
│   │   ├── Default resolution: 1280x800
│   │   ├── All text readable on 7" screen
│   │   ├── No external launcher requirements
│   │   └── Controller-friendly (no mandatory keyboard/mouse)
│   ├── Screenshots work correctly
│   └── Install/uninstall cleanly
│
└── Mobile (Apple App Store / Google Play)
    ├── Apple: App Review Guidelines compliance
    │   ├── In-app purchase via Apple IAP only
    │   ├── Privacy policy and data handling
    │   ├── Performance on minimum supported device
    │   └── No private API usage
    ├── Google: Google Play policies
    │   ├── Families policy (if targeting children)
    │   ├── Data safety disclosure
    │   ├── Target API level requirements
    │   └── 64-bit requirement
    └── Both: Content rating (ESRB, PEGI, IARC)
```

### 6. Continuous Testing Pipeline

```
CI/CD Testing Pipeline:
│
├── On Every Commit
│   ├── Code compilation (all platforms)
│   ├── Unit tests (< 5 minutes)
│   ├── Static analysis (lint, code standards)
│   └── Asset validation (naming, sizes, missing references)
│
├── On Pull Request
│   ├── All unit tests
│   ├── Integration tests (< 15 minutes)
│   ├── Build for primary platform
│   ├── Automated smoke test (game boots, menu works, basic gameplay)
│   └── Screenshot regression comparison
│
├── Nightly Build
│   ├── Full build for all platforms
│   ├── Complete unit + integration test suite
│   ├── Automated gameplay test (AI plays through key scenarios)
│   ├── Performance benchmark tests
│   ├── Memory leak tests (extended play session)
│   └── Results published to dashboard
│
├── Sprint / Milestone Build
│   ├── Full regression test pass (manual + automated)
│   ├── Platform-specific testing on dev kits
│   ├── Multiplayer stress testing
│   ├── Localization review
│   ├── Accessibility audit
│   └── Compliance pre-check against platform requirements
│
└── Pre-Certification Build
    ├── Complete platform cert test pass
    ├── 48-hour soak test (continuous play, no memory leaks/crashes)
    ├── All known S1/S2 bugs resolved
    ├── Final performance verification on target hardware
    ├── Content rating verification
    └── Sign-off from QA Lead, Producer, and Platform Engineer
```

---

## Testing Tools

| Category | Tools |
|----------|-------|
| **Bug Tracking** | Jira, Linear, Shortcut, MantisBT, Azure DevOps |
| **Test Management** | TestRail, Zephyr, qTest, PractiTest |
| **Automated Testing** | Unity Test Framework, UE Gauntlet, pytest, Selenium (web) |
| **Performance** | Unity Profiler, UE Insights, RenderDoc, Tracy, PIX |
| **Screenshot Comparison** | Percy, Applitools, BackstopJS, custom diff tools |
| **Crash Reporting** | Sentry, Crashlytics, Backtrace, BugSplat |
| **Network Testing** | Clumsy (Windows), Network Link Conditioner (Mac), Charles Proxy |
| **Monkey Testing** | AltTester (Unity), random input generators |

---

## Example Prompt for AI-Assisted QA

```
You are a Game Testing & QA Specialist. I'm shipping a multiplayer
action RPG on PC (Steam), PS5, and Xbox Series X. We're 6 weeks from
Gold Master. Help me:

1. Create a comprehensive test plan covering functional, performance,
   multiplayer, and platform certification testing
2. Set up automated tests for our critical systems: combat damage
   calculation, quest progression, save/load, inventory operations,
   and loot generation (Unity Test Framework)
3. Design a performance test suite that automatically captures FPS,
   memory, and loading times across benchmark scenarios
4. Create platform certification checklists for PS5 (TRC) and Xbox (XR)
   with specific test cases for each requirement
5. Set up a CI/CD testing pipeline that runs unit tests on commit,
   integration tests on PR, and full regression on nightly builds

For each deliverable:
- Provide actionable test cases with expected results
- Include automation scripts where applicable
- Define severity classification criteria
- Specify go/no-go criteria for Gold Master
```
