# MCP Game Development Specialist

## Role Definition

The MCP (Model Context Protocol) Game Development Specialist designs and implements MCP servers and clients that extend AI-assisted game development workflows. This role bridges AI capabilities with game development tools, enabling Claude and other AI assistants to directly interact with game engines, asset pipelines, version control systems, project management tools, and live game services through standardized MCP interfaces.

---

## Core Competencies

### 1. MCP Protocol Fundamentals

#### What is MCP?
The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external tools and data sources. In game development, MCP servers can expose:
- **Tools**: Actions the AI can perform (build game, run tests, deploy to platform, modify assets)
- **Resources**: Data the AI can read (game configs, analytics dashboards, asset databases, documentation)
- **Prompts**: Pre-built prompt templates for common game dev tasks

#### MCP Architecture for Game Development
```
┌─────────────────────────────────────────────────────┐
│                  AI ASSISTANT (Claude)                │
│                                                      │
│  "Build the game for PS5"  "Show me crash analytics" │
│  "Run the combat unit tests"  "Deploy to staging"    │
└────────────────────┬────────────────────────────────┘
                     │ MCP Protocol (JSON-RPC over stdio/SSE)
                     │
    ┌────────────────┼────────────────────────┐
    │                │                        │
    ▼                ▼                        ▼
┌─────────┐  ┌──────────────┐  ┌──────────────────┐
│ Engine   │  │ Asset        │  │ DevOps           │
│ MCP      │  │ Pipeline     │  │ MCP Server       │
│ Server   │  │ MCP Server   │  │                  │
├─────────┤  ├──────────────┤  ├──────────────────┤
│ • Build  │  │ • Import     │  │ • CI/CD trigger  │
│ • Test   │  │ • Validate   │  │ • Deploy         │
│ • Run    │  │ • Convert    │  │ • Monitor        │
│ • Debug  │  │ • Catalog    │  │ • Logs           │
└─────────┘  └──────────────┘  └──────────────────┘
    │                │                        │
    ▼                ▼                        ▼
┌─────────┐  ┌──────────────┐  ┌──────────────────┐
│ Unreal/  │  │ Blender/     │  │ GitHub Actions/  │
│ Unity/   │  │ Substance/   │  │ Jenkins/         │
│ Godot    │  │ Asset DB     │  │ Cloud Services   │
└─────────┘  └──────────────┘  └──────────────────┘
```

### 2. Game Engine MCP Servers

#### Unity MCP Server
```typescript
// Unity MCP Server - exposes Unity Editor operations to AI
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "unity-game-dev",
  version: "1.0.0",
  description: "MCP server for Unity game development operations"
});

// Tool: Build Unity project
server.tool(
  "unity-build",
  "Build Unity project for specified platform",
  {
    platform: z.enum(["windows", "macos", "linux", "android", "ios", "webgl", "ps5", "xbox"]),
    configuration: z.enum(["debug", "release", "profile"]).default("debug"),
    scenes: z.array(z.string()).optional().describe("Specific scenes to include"),
    cleanBuild: z.boolean().default(false)
  },
  async ({ platform, configuration, scenes, cleanBuild }) => {
    // Execute Unity CLI build command
    const buildArgs = [
      "-batchmode", "-nographics",
      "-buildTarget", mapPlatform(platform),
      "-configuration", configuration,
      cleanBuild ? "-clean" : "",
      scenes ? `-scenes ${scenes.join(",")}` : ""
    ].filter(Boolean).join(" ");

    const result = await exec(`unity-editor ${buildArgs}`);
    return { content: [{ type: "text", text: result }] };
  }
);

// Tool: Run Unity tests
server.tool(
  "unity-test",
  "Run Unity Test Framework tests",
  {
    testMode: z.enum(["editmode", "playmode", "all"]).default("all"),
    filter: z.string().optional().describe("Test name filter pattern"),
    category: z.string().optional().describe("Test category to run")
  },
  async ({ testMode, filter, category }) => {
    // Execute Unity test runner
    const result = await exec(`unity-editor -runTests -testPlatform ${testMode}`);
    return { content: [{ type: "text", text: formatTestResults(result) }] };
  }
);

// Tool: Analyze scene hierarchy
server.tool(
  "unity-scene-info",
  "Get information about a Unity scene's hierarchy and components",
  {
    scenePath: z.string().describe("Path to the Unity scene file"),
    depth: z.number().default(3).describe("Hierarchy depth to traverse")
  },
  async ({ scenePath, depth }) => {
    // Parse Unity scene YAML and return hierarchy
    const sceneData = await parseUnityScene(scenePath);
    return { content: [{ type: "text", text: JSON.stringify(sceneData, null, 2) }] };
  }
);

// Resource: Project settings
server.resource(
  "unity://project-settings",
  "Unity project settings and configuration",
  async () => {
    const settings = await readProjectSettings();
    return { contents: [{ uri: "unity://project-settings", text: settings }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

#### Unreal Engine MCP Server
```typescript
const server = new McpServer({
  name: "unreal-game-dev",
  version: "1.0.0"
});

// Tool: Build Unreal project
server.tool(
  "unreal-build",
  "Build Unreal Engine project",
  {
    target: z.enum(["editor", "game", "client", "server"]),
    platform: z.enum(["Win64", "Linux", "Mac", "PS5", "XboxSeriesX", "Switch"]),
    configuration: z.enum(["Debug", "DebugGame", "Development", "Shipping", "Test"]),
    cook: z.boolean().default(false).describe("Cook content for target platform")
  },
  async ({ target, platform, configuration, cook }) => {
    const uat = "RunUAT.bat";
    const cmd = cook
      ? `${uat} BuildCookRun -project=MyGame.uproject -platform=${platform} -configuration=${configuration}`
      : `UnrealBuildTool ${target} ${platform} ${configuration}`;
    const result = await exec(cmd);
    return { content: [{ type: "text", text: result }] };
  }
);

// Tool: Blueprint analysis
server.tool(
  "unreal-blueprint-info",
  "Analyze Unreal Blueprint assets",
  {
    assetPath: z.string().describe("Path to Blueprint asset (e.g., /Game/Blueprints/BP_Enemy)"),
    includeGraph: z.boolean().default(false)
  },
  async ({ assetPath, includeGraph }) => {
    // Use Unreal commandlet to export Blueprint info
    const info = await analyzeBlueprintAsset(assetPath);
    return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
  }
);

// Tool: Run Gauntlet automated tests
server.tool(
  "unreal-test",
  "Run Unreal automated tests",
  {
    testFilter: z.string().optional(),
    testType: z.enum(["unit", "functional", "performance", "all"]).default("all")
  },
  async ({ testFilter, testType }) => {
    const result = await exec(
      `UnrealEditor-Cmd MyGame.uproject -ExecCmds="Automation RunTests ${testFilter || testType}"`
    );
    return { content: [{ type: "text", text: result }] };
  }
);
```

#### Godot MCP Server
```typescript
const server = new McpServer({
  name: "godot-game-dev",
  version: "1.0.0"
});

// Tool: Export Godot project
server.tool(
  "godot-export",
  "Export Godot project for target platform",
  {
    preset: z.string().describe("Export preset name (e.g., 'Windows Desktop', 'Android', 'Web')"),
    debug: z.boolean().default(true),
    outputPath: z.string().optional()
  },
  async ({ preset, debug, outputPath }) => {
    const debugFlag = debug ? "--export-debug" : "--export-release";
    const result = await exec(
      `godot --headless ${debugFlag} "${preset}" ${outputPath || ""}`
    );
    return { content: [{ type: "text", text: result }] };
  }
);

// Tool: Run GDScript tests (GUT framework)
server.tool(
  "godot-test",
  "Run Godot unit tests using GUT framework",
  {
    testScript: z.string().optional().describe("Specific test script to run"),
    verbose: z.boolean().default(true)
  },
  async ({ testScript, verbose }) => {
    const result = await exec(
      `godot --headless -s addons/gut/gut_cmdln.gd ${testScript ? `-gtest=${testScript}` : ""}`
    );
    return { content: [{ type: "text", text: result }] };
  }
);
```

### 3. Asset Pipeline MCP Server

```typescript
const server = new McpServer({
  name: "game-asset-pipeline",
  version: "1.0.0"
});

// Tool: Validate game assets
server.tool(
  "validate-assets",
  "Validate game assets against project standards",
  {
    assetPath: z.string().describe("Path to asset or asset directory"),
    rules: z.array(z.enum([
      "texture-power-of-two",
      "texture-max-size",
      "mesh-polycount-limit",
      "naming-convention",
      "missing-materials",
      "animation-fps-check"
    ])).default(["naming-convention", "texture-max-size"])
  },
  async ({ assetPath, rules }) => {
    const results = await validateAssets(assetPath, rules);
    return { content: [{ type: "text", text: formatValidationResults(results) }] };
  }
);

// Tool: Convert asset formats
server.tool(
  "convert-asset",
  "Convert game assets between formats",
  {
    inputPath: z.string(),
    outputFormat: z.enum(["fbx", "gltf", "glb", "obj", "png", "jpg", "webp", "ogg", "wav"]),
    options: z.object({
      scale: z.number().optional(),
      compression: z.enum(["none", "low", "medium", "high"]).optional(),
      generateLODs: z.boolean().optional()
    }).optional()
  },
  async ({ inputPath, outputFormat, options }) => {
    const result = await convertAsset(inputPath, outputFormat, options);
    return { content: [{ type: "text", text: result }] };
  }
);

// Tool: Search asset database
server.tool(
  "search-assets",
  "Search the project's asset database",
  {
    query: z.string().describe("Search query (name, tag, type)"),
    assetType: z.enum(["mesh", "texture", "material", "animation", "audio", "prefab", "all"]).default("all"),
    maxResults: z.number().default(20)
  },
  async ({ query, assetType, maxResults }) => {
    const results = await searchAssetDB(query, assetType, maxResults);
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }
);

// Resource: Asset statistics
server.resource(
  "assets://statistics",
  "Project asset statistics (counts, sizes, types)",
  async () => {
    const stats = await getAssetStatistics();
    return { contents: [{ uri: "assets://statistics", text: JSON.stringify(stats) }] };
  }
);
```

### 4. Game Analytics MCP Server

```typescript
const server = new McpServer({
  name: "game-analytics",
  version: "1.0.0"
});

// Tool: Query player analytics
server.tool(
  "query-analytics",
  "Query game analytics data",
  {
    metric: z.enum([
      "dau", "mau", "retention", "session-length", "revenue",
      "level-completion", "item-usage", "crash-rate", "fps-distribution"
    ]),
    dateRange: z.object({
      start: z.string().describe("ISO date string"),
      end: z.string().describe("ISO date string")
    }),
    segmentBy: z.enum(["platform", "country", "version", "device", "none"]).default("none"),
    granularity: z.enum(["hourly", "daily", "weekly", "monthly"]).default("daily")
  },
  async ({ metric, dateRange, segmentBy, granularity }) => {
    const data = await queryAnalytics(metric, dateRange, segmentBy, granularity);
    return { content: [{ type: "text", text: formatAnalyticsReport(data) }] };
  }
);

// Tool: Get crash reports
server.tool(
  "get-crashes",
  "Retrieve and analyze game crash reports",
  {
    platform: z.enum(["all", "pc", "ps5", "xbox", "switch", "ios", "android"]).default("all"),
    severity: z.enum(["all", "critical", "high", "medium", "low"]).default("all"),
    limit: z.number().default(25),
    version: z.string().optional()
  },
  async ({ platform, severity, limit, version }) => {
    const crashes = await getCrashReports({ platform, severity, limit, version });
    return { content: [{ type: "text", text: JSON.stringify(crashes, null, 2) }] };
  }
);

// Resource: Live game dashboard
server.resource(
  "analytics://live-dashboard",
  "Real-time game metrics dashboard",
  async () => {
    const liveData = await getLiveDashboard();
    return { contents: [{ uri: "analytics://live-dashboard", text: JSON.stringify(liveData) }] };
  }
);
```

### 5. DevOps & Deployment MCP Server

```typescript
const server = new McpServer({
  name: "game-devops",
  version: "1.0.0"
});

// Tool: Trigger CI/CD pipeline
server.tool(
  "trigger-build-pipeline",
  "Trigger a game build pipeline",
  {
    pipeline: z.enum(["nightly", "release", "hotfix", "platform-cert"]),
    platform: z.enum(["all", "pc", "ps5", "xbox", "switch", "ios", "android"]),
    branch: z.string().default("main"),
    parameters: z.record(z.string()).optional()
  },
  async ({ pipeline, platform, branch, parameters }) => {
    const result = await triggerPipeline(pipeline, platform, branch, parameters);
    return { content: [{ type: "text", text: `Pipeline ${result.id} triggered: ${result.status}` }] };
  }
);

// Tool: Deploy to staging/production
server.tool(
  "deploy-game",
  "Deploy game build to staging or production",
  {
    environment: z.enum(["staging", "production"]),
    buildId: z.string(),
    platform: z.string(),
    notes: z.string().optional()
  },
  async ({ environment, buildId, platform, notes }) => {
    const result = await deployBuild(environment, buildId, platform, notes);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Tool: Check server health
server.tool(
  "server-health",
  "Check game server health and performance",
  {
    region: z.enum(["all", "us-east", "us-west", "eu-west", "eu-central", "asia-east", "asia-south"]).default("all")
  },
  async ({ region }) => {
    const health = await checkServerHealth(region);
    return { content: [{ type: "text", text: formatServerHealth(health) }] };
  }
);
```

### 6. MCP Configuration for Game Dev

#### Claude Desktop / Claude Code Configuration
```json
{
  "mcpServers": {
    "unity-dev": {
      "command": "node",
      "args": ["./mcp-servers/unity-mcp/build/index.js"],
      "env": {
        "UNITY_EDITOR_PATH": "C:/Program Files/Unity/Hub/Editor/2023.3/Editor/Unity.exe",
        "PROJECT_PATH": "C:/Projects/MyRPG"
      }
    },
    "game-assets": {
      "command": "node",
      "args": ["./mcp-servers/asset-pipeline-mcp/build/index.js"],
      "env": {
        "ASSET_DB_PATH": "./AssetDatabase.db",
        "BLENDER_PATH": "/usr/bin/blender"
      }
    },
    "game-analytics": {
      "command": "node",
      "args": ["./mcp-servers/analytics-mcp/build/index.js"],
      "env": {
        "ANALYTICS_API_KEY": "${GAMEANALYTICS_KEY}",
        "SENTRY_TOKEN": "${SENTRY_AUTH_TOKEN}"
      }
    },
    "game-devops": {
      "command": "node",
      "args": ["./mcp-servers/devops-mcp/build/index.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "AWS_PROFILE": "game-dev"
      }
    }
  }
}
```

---

## MCP Game Dev Workflow Examples

### Daily Development Flow
```
Developer: "Build the game for PC in debug mode and run the combat tests"
    │
    ├─► MCP Tool: unity-build (platform: windows, configuration: debug)
    │   └─► Result: Build succeeded (2m 34s), output: builds/win64/MyRPG.exe
    │
    └─► MCP Tool: unity-test (testMode: playmode, category: "Combat")
        └─► Result: 47/47 tests passed (12s)
```

### Analytics Investigation
```
Developer: "Why did our D7 retention drop last week?"
    │
    ├─► MCP Tool: query-analytics (metric: retention, dateRange: last 2 weeks)
    │   └─► Result: D7 dropped from 32% to 24% starting March 21
    │
    ├─► MCP Tool: get-crashes (severity: critical, version: "1.2.3")
    │   └─► Result: Spike in crash at TutorialManager.cs:142
    │
    └─► MCP Resource: analytics://live-dashboard
        └─► Result: Tutorial completion rate dropped 40%
```

---

## Example Prompt for AI-Assisted MCP Development

```
You are an MCP Game Development Specialist. I need to build a suite of
MCP servers for my Unity RPG project. The project uses:
- Unity 2023.3 LTS
- GitHub for version control
- GitHub Actions for CI/CD
- PlayFab for backend
- GameAnalytics for telemetry
- Blender for 3D assets

Create MCP server implementations for:
1. Unity Editor operations (build, test, scene analysis, prefab inspection)
2. Asset pipeline (Blender batch operations, texture optimization, asset validation)
3. PlayFab management (player lookup, economy tuning, LiveOps events)
4. GameAnalytics queries (retention, engagement, crash reports)
5. GitHub Actions integration (trigger builds, check status, deploy)

For each server:
- Define all tools with proper Zod schemas
- Define relevant resources
- Include error handling and timeouts
- Provide the Claude Code MCP configuration
- Show example AI-assisted workflows
```
