# API Integration Specialist

## Role Definition

The API Integration Specialist designs, implements, and maintains connections between a video game and external services, platforms, SDKs, and web APIs. This role ensures seamless integration with platform services (Steam, PlayStation, Xbox, Nintendo, Epic Games Store), backend-as-a-service providers, analytics platforms, social features, cloud services, AI/ML APIs, and third-party tools — enabling features like authentication, leaderboards, matchmaking, cloud saves, analytics, payments, and live-ops.

---

## Core Competencies

### 1. Platform SDK Integration

#### Steam (Steamworks SDK)
- **Authentication**: Implement Steam login, session tickets, and auth tokens for secure multiplayer.
- **Achievements & Stats**: Define achievement schemas, track player stats, display progress notifications.
- **Leaderboards**: Create global/friend/nearby leaderboards with score upload and pagination.
- **Cloud Saves**: Integrate Steam Cloud for cross-device save synchronization. Handle conflict resolution.
- **Workshop (UGC)**: Enable user-generated content upload, download, voting, and in-game loading via Steam Workshop.
- **Matchmaking & Lobbies**: Implement lobby creation, search, join, and P2P/dedicated server matchmaking.
- **Overlay & Rich Presence**: Show in-game status, invite friends, and use the Steam overlay.
- **DLC & Microtransactions**: Check DLC ownership, implement Steam Inventory for tradable items.
- **Steam Input**: Support Steam Input API for universal controller support.

#### Epic Games Store (Epic Online Services - EOS)
- **EOS SDK Integration**: Auth (Epic, Steam, console cross-auth), sessions, matchmaking, lobbies, stats, achievements, leaderboards, voice chat, anti-cheat.
- **Cross-Platform**: EOS provides cross-platform multiplayer, friends, and presence across PC and consoles.

#### Console Platforms
- **PlayStation (PS4/PS5)**:
  - PSN authentication, trophies, activity cards (PS5), cloud saves, matchmaking
  - DualSense API (haptic feedback, adaptive triggers, speaker, lightbar)
  - PlayStation Store integration (DLC, microtransactions)
- **Xbox (Xbox One/Series X|S)**:
  - Xbox Live authentication, achievements, Game Pass integration
  - Xbox Play Anywhere and Smart Delivery
  - Xbox Cloud Gaming compatibility
- **Nintendo Switch**:
  - Nintendo Account authentication
  - Joy-Con features (HD Rumble, gyro, IR)
  - Nintendo Switch Online integration

#### Mobile Platforms
- **Apple (iOS/macOS)**:
  - Game Center (achievements, leaderboards, multiplayer)
  - App Store Connect API (in-app purchases, subscriptions)
  - Sign in with Apple, StoreKit 2
  - App Tracking Transparency (ATT) compliance
- **Google Play (Android)**:
  - Google Play Games Services (achievements, leaderboards, saved games)
  - Google Play Billing (in-app purchases, subscriptions)
  - Google Play Integrity API (anti-tamper)

### 2. Backend-as-a-Service (BaaS) Integration

#### PlayFab (Microsoft Azure)
```
Key APIs:
├── Player Authentication (multiple identity providers)
├── Player Data (title data, player data, entity data)
├── Economy V2 (virtual currencies, catalogs, stores, transactions)
├── Leaderboards (dynamic, resettable, segmented)
├── Matchmaking (rule-based, skill-based)
├── CloudScript / Azure Functions (server-side logic)
├── Push Notifications
├── LiveOps (scheduled events, title news, A/B testing)
└── Multiplayer Servers (managed game servers)
```

#### Firebase (Google)
```
Key Services:
├── Authentication (email, social, anonymous, custom tokens)
├── Firestore (real-time NoSQL database)
├── Realtime Database (low-latency sync)
├── Cloud Functions (server-side logic)
├── Cloud Messaging (push notifications)
├── Remote Config (feature flags, A/B testing)
├── Crashlytics (crash reporting)
├── Analytics (event tracking, funnels, cohorts)
└── Cloud Storage (user-generated content, replays)
```

#### Nakama (Open Source)
```
Key Features:
├── Authentication (device, social, custom)
├── Realtime Multiplayer (authoritative, relayed)
├── Matchmaking (custom property-based)
├── Leaderboards & Tournaments
├── Chat (realtime, persistent)
├── Friends & Groups (social graph)
├── Storage Engine (user/game data)
├── Notifications (in-app, push)
└── Server Runtime (Go, Lua, TypeScript plugins)
```

### 3. Analytics & Telemetry Integration

| Service | Integration Method | Key Metrics |
|---------|-------------------|-------------|
| **Unity Analytics** | Unity SDK | DAU, retention, funnels, revenue |
| **GameAnalytics** | REST API / SDK | Custom events, progression, errors, design events |
| **Amplitude** | REST API / SDK | Behavioral analytics, cohorts, A/B testing |
| **Mixpanel** | REST API / SDK | Event analytics, user profiles, funnels |
| **AWS GameAnalytics** | AWS SDK | Custom telemetry pipeline |
| **Google Analytics 4** | REST API / SDK | Web/mobile game analytics |

### 4. AI & Machine Learning API Integration

#### Cloud AI Services
| Provider | APIs | Game Applications |
|----------|------|-------------------|
| **OpenAI** | GPT-4, DALL-E, Whisper, TTS | NPC dialogue generation, content creation, voice recognition, text-to-speech |
| **Anthropic Claude** | Claude API | NPC conversations, quest generation, game master AI, content moderation |
| **Google AI** | Gemini, Cloud Vision, Speech-to-Text, Text-to-Speech | Image recognition, voice commands, NPC speech |
| **Azure AI** | Cognitive Services, OpenAI Service | Speech, vision, language understanding, content safety |
| **Eleven Labs** | Voice API | Dynamic NPC voice generation |
| **Stability AI** | Stable Diffusion API | Procedural texture/asset generation |

#### Integration Patterns for AI APIs
```csharp
// Example: NPC Dialogue via Claude API
public class NPCDialogueService
{
    private readonly HttpClient _client;

    public async Task<string> GenerateDialogue(NPCContext context, string playerInput)
    {
        var request = new
        {
            model = "claude-sonnet-4-6-20250514",
            max_tokens = 300,
            system = $"You are {context.Name}, a {context.Role} in a {context.Setting}. " +
                     $"Personality: {context.Personality}. " +
                     $"Current quest state: {context.QuestState}.",
            messages = new[]
            {
                new { role = "user", content = playerInput }
            }
        };

        var response = await _client.PostAsJsonAsync(
            "https://api.anthropic.com/v1/messages", request);
        // Parse and return NPC dialogue
    }
}
```

### 5. Payment & Monetization APIs

| Service | Use Case | Integration |
|---------|----------|-------------|
| **Stripe** | Web store, out-of-game purchases | REST API, webhooks |
| **PayPal** | Alternative payment | REST API |
| **Xsolla** | Game-specific payment platform | SDK, REST API |
| **Steam Microtransactions** | In-game purchases via Steam | Steamworks SDK |
| **Apple StoreKit 2** | iOS in-app purchases | Native SDK |
| **Google Play Billing** | Android in-app purchases | Native SDK |

### 6. Social & Community APIs

| Service | Features | Integration |
|---------|----------|-------------|
| **Discord** | Rich Presence, OAuth2, bot API, embedded social | Discord Game SDK, REST API |
| **Twitch** | Extensions, drops, stream integration | Twitch API, EventSub |
| **Twitter/X** | Share screenshots, achievements | REST API v2 |
| **YouTube** | Video upload, livestream integration | YouTube Data API v3 |

### 7. Cloud Infrastructure APIs

#### Game Server Hosting
| Service | Description |
|---------|-------------|
| **AWS GameLift** | Managed game server hosting with FlexMatch matchmaking |
| **Azure PlayFab Multiplayer Servers** | Managed game servers on Azure |
| **Google Cloud Game Servers** | Agones-based managed game servers |
| **Multiplay (Unity)** | Managed game server hosting |
| **Hathora** | Serverless game server hosting |

#### Content Delivery
| Service | Use Case |
|---------|----------|
| **AWS CloudFront** | Asset delivery, patch distribution |
| **Azure CDN** | Global content delivery |
| **Cloudflare** | DDoS protection, CDN, Workers for edge logic |
| **Fastly** | Real-time CDN |

---

## API Integration Best Practices

### Authentication Flow Architecture
```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│  Client  │────►│ Auth Provider │────►│ Game Server │
│  (Game)  │     │ (Steam/Epic/ │     │  (Validate  │
│          │◄────│  PSN/Xbox)   │     │   Token)    │
│          │     └──────────────┘     └──────┬──────┘
│          │                                  │
│          │◄─────── Session Token ───────────┘
│          │
│          │────► Use session token for all subsequent API calls
└─────────┘
```

### Rate Limiting & Retry Strategy
```
Retry with exponential backoff:
  Attempt 1: Immediate
  Attempt 2: Wait 1s + random(0-500ms)
  Attempt 3: Wait 2s + random(0-500ms)
  Attempt 4: Wait 4s + random(0-500ms)
  Attempt 5: Wait 8s + random(0-500ms)
  After 5 failures: Queue for later, notify player
```

### Offline-First Design
- Cache API responses locally for offline play
- Queue mutations (achievement unlocks, stat updates) when offline
- Sync queued operations when connectivity returns
- Design graceful degradation for every online feature

---

## Example Prompt for AI-Assisted API Integration

```
You are an API Integration Specialist for game development. I'm building
a Unity-based multiplayer RPG targeting PC (Steam) and mobile (iOS/Android).

I need to integrate:
1. Steam authentication + Epic Games cross-login (PC)
2. Apple Sign-In + Google Play Games (mobile)
3. PlayFab for backend (player data, leaderboards, economy)
4. Claude API for dynamic NPC dialogue generation
5. GameAnalytics for player behavior tracking
6. Discord Rich Presence for PC players

For each integration:
- Provide the Unity C# implementation approach
- Show the authentication/initialization flow
- Handle error cases and offline scenarios
- Ensure cross-platform compatibility
- Address security considerations (token storage, API key protection)

Include a unified authentication service that supports all providers
and maps to a single player identity in PlayFab.
```
