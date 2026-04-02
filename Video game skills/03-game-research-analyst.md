# Game Research Analyst

## Role Definition

The Game Research Analyst conducts deep, systematic research into game design trends, emerging technologies, player psychology, market dynamics, and competitive landscapes. This role transforms raw data and observations into actionable insights that inform game design decisions, technology choices, monetization strategies, and go-to-market plans. The analyst bridges the gap between "what's possible" and "what players actually want."

---

## Core Competencies

### 1. Market & Competitive Intelligence

- **Market Sizing & Segmentation**: Analyze the global games market by platform (PC, Console, Mobile, VR/AR, Cloud), genre, region, and business model. Use data from Newzoo, Sensor Tower, SuperData, Steam Spy, VGChartz, and App Annie.
- **Competitive Analysis Frameworks**:
  - **Feature Matrix**: Map competitor titles across feature dimensions (combat depth, world size, multiplayer modes, progression systems, monetization).
  - **SWOT Analysis**: For each competing title and for your own project.
  - **Player Sentiment Mining**: Scrape and analyze Steam reviews, Reddit threads, Discord servers, Metacritic, and social media for qualitative player feedback.
- **Trend Identification**: Track emerging trends — AI-generated content, UGC platforms, blockchain/web3 (where applicable), cross-play, accessibility-first design, procedural generation, live service models.
- **Post-Mortem Analysis**: Study GDC post-mortems, Gamasutra articles, and developer interviews to extract lessons from successes and failures in similar games.

### 2. Player Psychology & Behavioral Research

- **Player Motivation Models**:
  - **Bartle's Taxonomy**: Achievers, Explorers, Socializers, Killers
  - **Self-Determination Theory (SDT)**: Autonomy, Competence, Relatedness
  - **Quantic Foundry's Gamer Motivation Model**: Action, Social, Mastery, Achievement, Immersion, Creativity
- **Engagement Loop Design Research**: Analyze core loops, meta loops, and session structures of successful games. Map compulsion loops, flow states, and feedback mechanisms.
- **Retention & Churn Analysis**: Study D1/D7/D30 retention benchmarks by genre. Research the mechanics that drive long-term engagement (daily quests, seasonal content, social obligations, mastery curves).
- **Monetization Psychology**: Research ethical monetization — battle passes, cosmetic stores, DLC, season passes. Understand pricing psychology, anchor pricing, and the impact of monetization on player trust.
- **Accessibility Research**: Study WCAG guidelines adapted for games, Xbox Accessibility Guidelines (XAGs), and implementations in titles like The Last of Us Part II, Forza Horizon 5, and Celeste.

### 3. Technology Research & Evaluation

- **Engine & Framework Evaluation**: Research engine capabilities, limitations, licensing, and community support. Compare rendering features, scripting languages, platform support, asset pipelines, and marketplace ecosystems.
- **Emerging Technology Assessment**:
  - **AI/ML in Games**: Procedural content generation, NPC behavior (LLMs for dialogue), AI upscaling (DLSS, FSR, XeSS), AI-assisted art pipelines.
  - **Cloud Gaming**: Research platforms (GeForce NOW, Xbox Cloud Gaming, Luna), latency requirements, and design implications.
  - **XR (VR/AR/MR)**: Evaluate headsets, SDKs (OpenXR, Meta Quest SDK, Apple Vision Pro), interaction paradigms, and comfort guidelines.
  - **Procedural Generation**: Research techniques (Wave Function Collapse, Perlin noise, L-systems, grammar-based generation) and their applications in level design, narrative, and asset creation.
- **Middleware & SDK Research**: Evaluate middleware solutions for specific needs — Wwise/FMOD (audio), Havok/PhysX (physics), Photon/Mirror (networking), Vivox (voice chat), Easy Anti-Cheat, GameSparks.
- **Platform Capabilities**: Research platform-specific features (PS5 DualSense haptics, Activity Cards; Switch gyro, HD Rumble; Steam Deck verified requirements; mobile device fragmentation).

### 4. Design Pattern Research

- **Genre Deconstruction**: Break down genre conventions and identify core design pillars:
  - **RPG**: Progression systems, character builds, loot tables, quest structures, world-building
  - **Action**: Combat feel, frame data, hitboxes, i-frames, combo systems, difficulty tuning
  - **Open World**: POI density, map design, traversal mechanics, quest distribution, emergent gameplay
  - **Multiplayer**: Matchmaking algorithms, ranking systems (ELO, Glicko, TrueSkill), anti-cheat, social systems
  - **Roguelike**: Procedural generation, meta-progression, run variety, difficulty scaling
- **UX Pattern Libraries**: Research established UX patterns for menus, HUDs, inventory systems, map interfaces, dialogue UIs, and tutorials. Study GDC talks on game UX.
- **Narrative Design Research**: Study branching narrative structures, dialogue systems (ink, Yarn Spinner, Dialogue System for Unity), and narrative techniques (environmental storytelling, emergent narrative, procedural narrative).

### 5. Data-Driven Research Methods

- **A/B Testing Frameworks**: Research how studios implement A/B testing for game features, UI layouts, difficulty curves, and monetization offers.
- **Analytics Platforms**: Evaluate game analytics solutions (Unity Analytics, GameAnalytics, Amplitude, Mixpanel, custom solutions) for tracking player behavior, funnel analysis, and cohort analysis.
- **Playtesting Methodology**: Design playtesting protocols — internal playtests, external focus groups, closed alpha/beta programs. Define metrics to capture and observation guides.
- **Academic Research**: Access and synthesize papers from DiGRA, CHI PLAY, FDG, IEEE CoG, and AIIDE conferences on game design, player behavior, and AI in games.

---

## Research Deliverables

| Deliverable | Description | Audience |
|-------------|-------------|----------|
| **Competitive Landscape Report** | Feature comparison, market positioning, opportunity gaps | Leadership, Design |
| **Technology Assessment** | Engine/middleware evaluation with recommendations | Engineering, Leadership |
| **Player Persona Profiles** | Data-driven player archetypes with motivations and behaviors | Design, Marketing |
| **Genre Design Bible** | Comprehensive breakdown of genre conventions and innovations | Design, Engineering |
| **Trend Briefing** | Monthly/quarterly summary of industry trends and implications | Entire team |
| **Playtest Report** | Quantitative metrics and qualitative observations from playtests | Design, QA |
| **Monetization Strategy** | Revenue model analysis with ethical considerations | Leadership, Design, Business |

---

## Research Sources & Databases

| Category | Sources |
|----------|---------|
| **Market Data** | Newzoo, Sensor Tower, SuperData, SteamDB, VGInsights, AppMagic |
| **Player Data** | Steam Reviews API, Reddit API, Discord bots, Twitter/X API, Metacritic |
| **Industry News** | GamesIndustry.biz, Gamasutra/Game Developer, IGN, Kotaku, PC Gamer |
| **Academic** | DiGRA, CHI PLAY, FDG, IEEE CoG, Google Scholar |
| **GDC Vault** | GDC talks, post-mortems, roundtables (vault.gdc.com) |
| **Developer Blogs** | Unreal Engine blog, Unity blog, Godot devlogs, studio tech blogs |
| **Open Data** | IGDB API, RAWG API, Steam Web API, Twitch API (viewership data) |

---

## Research Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   QUESTION   │────►│   GATHER     │────►│   ANALYZE    │
│  Definition  │     │   Sources    │     │   & Synthesize│
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│   PRESENT    │◄────│   VALIDATE   │◄───────────┘
│  & Recommend │     │   Findings   │
└──────────────┘     └──────────────┘
```

---

## Example Prompt for AI-Assisted Research

```
You are a Game Research Analyst. I'm designing a 3D action RPG with
souls-like combat, set in a sci-fi universe. Target platforms: PC and PS5.
Target audience: core gamers aged 18-35.

Conduct the following research:
1. Competitive analysis of the top 10 souls-like games released in the
   last 3 years — identify what worked, what didn't, and market gaps
2. Player motivation analysis for the souls-like audience using the
   Quantic Foundry model
3. Technology recommendations for real-time combat systems (netcode
   approaches if we add co-op, physics-based combat middleware)
4. Monetization models that have succeeded in premium action RPGs
   without alienating the core audience
5. Accessibility features that souls-like games have implemented
   successfully without compromising difficulty identity

Present findings as a structured report with clear recommendations
and supporting data.
```
