# Game Deployment & Publishing Specialist

## Role Definition

The Game Deployment & Publishing Specialist manages the entire process of bringing a video game from development builds to live product across all target platforms and storefronts — including build pipelines, store configuration, certification submission, launch coordination, patch management, live-ops infrastructure, and post-launch support. This role ensures smooth, reliable releases and updates across Steam, PlayStation, Xbox, Nintendo, Epic Games Store, mobile app stores, and web platforms.

---

## Core Competencies

### 1. Build Pipeline & Distribution

#### Build Pipeline Architecture
```
Build Pipeline Flow:
│
├── Source (Git/Perforce)
│   └── Trigger: Commit, PR merge, manual, scheduled
│
├── Build Stage
│   ├── Compile game code (all platforms in parallel)
│   ├── Cook/process assets (engine-specific)
│   ├── Generate platform-specific builds
│   ├── Sign executables (code signing certificates)
│   └── Package builds (installer, archive, container)
│
├── Test Stage
│   ├── Automated smoke tests
│   ├── Unit / integration tests
│   ├── Performance benchmark
│   └── Screenshot regression
│
├── Artifact Stage
│   ├── Upload to artifact storage (S3, Azure Blob, GCS)
│   ├── Version tagging and changelog generation
│   ├── Build notification (Slack, email, dashboard)
│   └── Retain N builds, cleanup old artifacts
│
└── Distribution Stage
    ├── Internal: QA builds → test environment
    ├── Staging: Staging branch → platform staging
    └── Production: Release branch → live stores
```

### 2. Platform Store Configuration

#### Steam (Steamworks)
```
Steam Publishing Checklist:
│
├── Partner Setup
│   ├── Steamworks partner account
│   ├── Tax and payment information
│   ├── App ID created ($100 fee per app)
│   └── Team member permissions configured
│
├── Store Page Setup
│   ├── App name and type (Game, DLC, Demo, Playtest)
│   ├── Description (short and long, supports BBCode)
│   ├── Screenshots (minimum 5, 1920x1080 recommended)
│   ├── Capsule images (header, small, hero, logo)
│   ├── Trailers (1-3 videos, MP4/WebM)
│   ├── System requirements (minimum + recommended)
│   ├── Genre and tag selection
│   ├── Content descriptor survey (mature content)
│   ├── Release date (coming soon, date, or unlisted)
│   └── Pricing (by region, Steamworks pricing tool)
│
├── Technical Configuration
│   ├── Depots (content packages per platform/language)
│   ├── Branches (default, beta, testing)
│   ├── Launch options (executable path, arguments)
│   ├── DRM (Steam DRM wrapper or third-party)
│   ├── Cloud saves configuration (per-file paths)
│   ├── Achievements (name, description, icon, hidden flag)
│   ├── Leaderboards setup
│   ├── Trading cards and badges (optional)
│   ├── Steam Input configuration (controller support)
│   ├── Workshop support (UGC, if applicable)
│   └── Remote Play / Steam Link configuration
│
├── Build Upload
│   ├── SteamPipe (steamcmd tool for uploading)
│   ├── Upload depots to staging branch
│   ├── Test on staging
│   ├── Set build live on default branch
│   └── Verify CDN distribution complete
│
├── Steam Deck Verification
│   ├── Submit for Deck Verified review
│   ├── Input: Full controller support
│   ├── Display: Correct resolution (1280x800)
│   ├── Seamlessness: No external launchers required
│   ├── System: Runs on Linux via Proton
│   └── Text is readable on 7" screen
│
└── Launch
    ├── Set release date and time
    ├── Prepare launch discount (10-20% common)
    ├── Enable community hub / discussions
    ├── Monitor community feedback
    └── Prepare Day-1 patch if needed
```

#### Console Publishing
```
Console Publishing Process:
│
├── PlayStation (Sony Interactive Entertainment)
│   ├── Become licensed PlayStation developer
│   │   └── Apply at partners.playstation.net
│   ├── Obtain PS5 dev kit(s)
│   ├── PlayStation Partners portal setup
│   ├── TRC compliance testing (Technical Requirements Checklist)
│   ├── Age rating (ESRB, PEGI, CERO, etc.)
│   ├── Submission to QA testing (Sony QA)
│   ├── Address Sony QA feedback / resubmit
│   ├── Mastering and manufacturing (if physical)
│   ├── PS Store configuration
│   │   ├── Pricing, descriptions, images
│   │   ├── Trophies, DLC, bundles
│   │   └── Pre-order configuration
│   └── Release on PS Store
│
├── Xbox (Microsoft)
│   ├── Join ID@Xbox program (indie) or managed partner
│   │   └── Apply at developer.microsoft.com
│   ├── Obtain Xbox dev kit(s)
│   ├── Partner Center configuration
│   ├── XR compliance testing (Xbox Requirements)
│   ├── Age rating submission
│   ├── Submission to Xbox certification
│   ├── Address cert feedback / resubmit
│   ├── Microsoft Store listing
│   │   ├── Game Pass negotiation (if applicable)
│   │   └── Smart Delivery configuration (One + Series)
│   └── Release on Xbox Store
│
├── Nintendo Switch
│   ├── Apply to Nintendo Developer Portal
│   │   └── developer.nintendo.com
│   ├── Obtain Switch dev kit(s)
│   ├── Lotcheck compliance testing
│   ├── Age rating
│   ├── Submission to Nintendo QA
│   ├── Nintendo eShop configuration
│   │   ├── Pricing, descriptions, screenshots
│   │   └── Demo configuration (if applicable)
│   └── Release on eShop
│
└── Timeline (Typical)
    ├── Account/dev kit: 2-8 weeks
    ├── Development with cert requirements: Ongoing
    ├── First submission: 4-6 weeks before target launch
    ├── QA review: 1-3 weeks
    ├── Fixes and resubmission: 1-2 weeks (if needed)
    └── Store setup and launch prep: 1-2 weeks
```

#### Mobile Publishing
```
Mobile Publishing:
│
├── Apple App Store (iOS)
│   ├── Apple Developer Program ($99/year)
│   ├── App Store Connect configuration
│   │   ├── App name, subtitle, keywords
│   │   ├── Description, screenshots per device
│   │   ├── Privacy policy URL
│   │   ├── Age rating questionnaire
│   │   ├── In-app purchase configuration
│   │   ├── App privacy details (data collection disclosure)
│   │   └── Pricing and availability by region
│   ├── Build upload via Xcode or Transporter
│   ├── TestFlight beta testing
│   ├── Submit for App Review
│   │   ├── Review time: 24-48 hours typical
│   │   ├── Common rejections: IAP issues, crashes, metadata, privacy
│   │   └── Appeal process available
│   ├── Phased release option (gradual rollout)
│   └── App Analytics monitoring
│
├── Google Play Store (Android)
│   ├── Google Play Developer account ($25 one-time)
│   ├── Google Play Console configuration
│   │   ├── Store listing (title, descriptions, graphics)
│   │   ├── Content rating (IARC questionnaire)
│   │   ├── Data safety disclosure
│   │   ├── Target audience and content
│   │   ├── Pricing and distribution
│   │   ├── In-app products and subscriptions
│   │   └── App signing (Google Play App Signing)
│   ├── Testing tracks
│   │   ├── Internal testing (up to 100 testers, instant publish)
│   │   ├── Closed testing (limited group, review required)
│   │   ├── Open testing (public beta)
│   │   └── Production (full release)
│   ├── Staged rollout (1% → 5% → 20% → 50% → 100%)
│   ├── Android App Bundle (AAB) format required
│   └── Pre-registration option
│
└── Cross-Platform Considerations
    ├── Consistent pricing (platform parity)
    ├── Cross-platform purchases / entitlements
    ├── Platform-specific IAP compliance
    └── Privacy regulation compliance (GDPR, CCPA, COPPA)
```

### 3. Patch & Update Management

```
Patch Management Workflow:
│
├── Patch Types
│   ├── Hotfix: Critical bug fix (< 1 week turnaround)
│   │   └── Minimal changes, fast QA, emergency cert
│   ├── Patch: Scheduled bug fixes + improvements (2-4 week cycle)
│   │   └── Standard QA, normal cert process
│   ├── Content Update: New content + features (monthly+)
│   │   └── Full QA, marketing, community communication
│   └── Season / Major Update: Significant content drop
│       └── Extended QA, certification, marketing campaign
│
├── Patch Pipeline
│   1. Branch from main: hotfix/v1.0.1 or release/v1.1.0
│   2. Cherry-pick or develop fixes
│   3. Internal QA on patch build
│   4. Platform certification (if console)
│   5. Stage patch on platform CDN
│   6. Communicate patch notes to community
│   7. Release patch (coordinated across platforms)
│   8. Monitor for issues post-release
│   9. Merge back to main
│
├── Patch Notes Best Practices
│   ├── Categorize: Bug Fixes, Balance Changes, New Features, QoL
│   ├── Be specific: "Fixed crash when opening inventory with 200+ items"
│   ├── Acknowledge known issues
│   ├── Thank community for reports
│   ├── Include version number and date
│   └── Translate for all supported languages
│
└── Delta Patching
    ├── Only download changed files (not full game)
    ├── Binary delta (byte-level diff, smallest patches)
    ├── File-level delta (changed files only)
    ├── Steam handles this automatically via SteamPipe
    ├── Console platforms have their own delta systems
    └── Monitor patch sizes (large patches frustrate players)
```

### 4. Live-Ops & Game-as-a-Service

```
Live-Ops Infrastructure:
│
├── Content Delivery
│   ├── CDN for game updates and assets (CloudFront, Akamai, Fastly)
│   ├── Remote configuration (feature flags, tuning values)
│   ├── Hot-loadable content (new items, events, cosmetics)
│   ├── Seasonal content scheduling
│   └── A/B testing framework
│
├── Backend Services
│   ├── Player authentication and profiles
│   ├── Inventory and economy service
│   ├── Leaderboards and rankings
│   ├── Matchmaking service
│   ├── Social features (friends, clans, chat)
│   ├── Push notification service
│   └── Analytics and telemetry pipeline
│
├── Monitoring & Operations
│   ├── Server health monitoring (uptime, CPU, memory, latency)
│   ├── Player experience metrics (login success, match start time)
│   ├── Error and crash monitoring (Sentry, Crashlytics)
│   ├── Real-time player count dashboards
│   ├── Automated alerting (PagerDuty, OpsGenie)
│   ├── Incident response runbooks
│   └── On-call rotation schedule
│
├── Seasonal Events
│   ├── Event calendar planning
│   ├── Limited-time content and rewards
│   ├── Battle pass / season pass progression
│   ├── Special game modes
│   ├── Community challenges
│   └── Event analytics and post-mortems
│
└── Economy Management
    ├── Currency flow monitoring (inflation detection)
    ├── Item rarity and drop rate tuning
    ├── Store inventory rotation
    ├── Sale events and pricing
    ├── Anti-exploit monitoring
    └── Economy health dashboards
```

### 5. Version Control & Release Strategy

```
Branching Strategy for Game Releases:
│
│  main ─────────────────────────────────────────────────►
│    │                    │                    │
│    ├─ release/1.0 ──────┤                    │
│    │    │               │                    │
│    │    ├─ hotfix/1.0.1 │                    │
│    │    │    │           │                    │
│    │    │    └─► release/1.0.1               │
│    │    │                                    │
│    │    └─► (end of life)                    │
│    │                                         │
│    ├─ release/1.1 ─────────────────────────── │
│    │    │                                    │
│    │    ├─ hotfix/1.1.1                      │
│    │    │                                    │
│    │    └─► release/1.1.1                    │
│    │                                         │
│    └─ release/2.0 ──────────────────────────►
│         (major content update)
│
│  Versioning: MAJOR.MINOR.PATCH
│  - MAJOR: New content season, major features
│  - MINOR: Content updates, feature additions
│  - PATCH: Bug fixes, hotfixes
```

### 6. Launch Checklist

```
Game Launch Checklist:
│
├── T-8 Weeks
│   ├── All platform certifications submitted
│   ├── Store pages finalized (all platforms)
│   ├── Marketing materials approved
│   ├── Community channels prepared (Discord, Reddit, forums)
│   ├── Press/influencer build distribution
│   └── Pre-order/wishlist campaigns active
│
├── T-4 Weeks
│   ├── Certification passed (or resubmission underway)
│   ├── Gold Master candidate build identified
│   ├── Day-1 patch scope defined
│   ├── Server infrastructure load tested
│   ├── Customer support team briefed
│   └── Launch trailer finalized
│
├── T-2 Weeks
│   ├── Gold Master build approved
│   ├── Day-1 patch in QA
│   ├── Store pages live with "Coming Soon"
│   ├── Review embargo date set
│   ├── Server infrastructure deployed to all regions
│   └── Monitoring and alerting configured
│
├── T-1 Week
│   ├── Day-1 patch submitted to platforms
│   ├── Pre-load enabled (if applicable)
│   ├── Launch event planned (stream, social media)
│   ├── War room schedule defined (who's on call, when)
│   ├── Rollback plan documented (if critical issue found)
│   └── Success metrics defined (CCU, sales, ratings targets)
│
├── Launch Day (T-0)
│   ├── Monitor store activation across time zones
│   ├── Verify download/install works correctly
│   ├── Monitor server health and scaling
│   ├── Track crash reports and critical bugs
│   ├── Community management (respond to issues quickly)
│   ├── Social media and marketing activation
│   ├── Track sales, CCU, and review scores
│   └── War room active for 24-48 hours
│
└── Post-Launch (T+1 to T+4 Weeks)
    ├── Analyze launch metrics vs. targets
    ├── Prioritize and fix top community-reported issues
    ├── First patch planning (1-2 weeks post-launch typical)
    ├── Community engagement (patch notes, roadmap communication)
    ├── Retrospective: What went well, what to improve
    └── Begin planning for first content update
```

### 7. Analytics & Monitoring

```
Launch Monitoring Dashboard:
│
├── Technical Metrics
│   ├── Crash-free rate (target: > 99.5%)
│   ├── Average load time by platform
│   ├── Server uptime and latency by region
│   ├── Error rates by category
│   └── Patch download completion rate
│
├── Player Metrics
│   ├── Concurrent users (CCU) — peak and average
│   ├── Daily Active Users (DAU)
│   ├── Session length (average, median)
│   ├── Retention: D1, D3, D7, D14, D30
│   ├── Funnel: Download → Install → Launch → Tutorial → First Session
│   ├── Platform distribution
│   └── Geographic distribution
│
├── Business Metrics
│   ├── Total sales / revenue
│   ├── Revenue per platform
│   ├── Conversion rate (wishlist → purchase)
│   ├── Refund rate (Steam: < 2 hours played)
│   ├── Review scores (Steam, Metacritic, platform stores)
│   └── Streamer/content creator coverage
│
├── Community Metrics
│   ├── Steam review score (positive %)
│   ├── Discord member growth
│   ├── Reddit/forum sentiment
│   ├── Social media mentions
│   ├── Support ticket volume and categories
│   └── Top requested features/fixes
│
└── Tools
    ├── GameAnalytics, Amplitude, Mixpanel
    ├── Grafana + Prometheus (server monitoring)
    ├── Sentry (crash reporting)
    ├── SteamDB / VGInsights (public sales estimates)
    ├── Google Analytics 4 (web/marketing)
    └── Custom dashboards (Metabase, Tableau, Looker)
```

---

## Deployment Automation Tools

| Category | Tools |
|----------|-------|
| **CI/CD** | GitHub Actions, Jenkins, GitLab CI, TeamCity, BuildGraph |
| **Build** | Unity Cloud Build, UE BuildGraph, CMake, FASTBuild |
| **Upload** | SteamPipe (Steam), Xbox Partner Center CLI, App Store Connect API |
| **Infrastructure** | AWS (GameLift, CloudFront, EC2), GCP, Azure, Hathora |
| **Monitoring** | Grafana, Datadog, PagerDuty, Sentry, Crashlytics |
| **CDN** | CloudFront, Fastly, Cloudflare, Akamai |
| **Config** | LaunchDarkly, Firebase Remote Config, PlayFab LiveOps |

---

## Example Prompt for AI-Assisted Deployment

```
You are a Game Deployment & Publishing Specialist. I'm launching a
multiplayer action RPG on Steam, PS5, and Xbox Series X in 8 weeks.

Help me:
1. Design the complete CI/CD pipeline from git commit to platform
   stores, using GitHub Actions for builds and SteamPipe/platform
   tools for distribution
2. Create store page configurations for all three platforms with
   proper metadata, screenshots specs, and pricing strategy
3. Build a platform certification preparation checklist with
   specific test cases for PS5 TRC and Xbox XR requirements
4. Design the live-ops infrastructure: server scaling, monitoring,
   crash reporting, remote config, and incident response playbooks
5. Create the complete launch checklist from T-8 weeks to T+4 weeks
   with task ownership and dependencies

For each area:
- Provide specific tool configurations and scripts
- Include rollback/disaster recovery plans
- Address multi-platform coordination challenges
- Define success metrics and monitoring dashboards
```
