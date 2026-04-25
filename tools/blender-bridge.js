const fs = require("fs");
const net = require("net");

const host = process.env.BLENDER_HOST || "127.0.0.1";
const port = Number(process.env.BLENDER_PORT || 9876);
const mode = process.argv[2] || "scene";
const target = process.argv[3];

function buildRequest() {
  if (mode === "scene") return { type: "get_scene_info", params: {} };
  if (mode === "object") return { type: "get_object_info", params: { name: target || "Cube" } };
  if (mode === "exec-file") {
    if (!target) throw new Error("Missing Python file path.");
    return { type: "execute_code", params: { code: fs.readFileSync(target, "utf8") } };
  }
  if (mode === "exec") {
    return { type: "execute_code", params: { code: process.argv.slice(3).join(" ") } };
  }
  throw new Error(`Unknown mode: ${mode}`);
}

const request = buildRequest();
const timeoutMs = Number(process.env.BLENDER_TIMEOUT_MS || 180000);
const client = net.createConnection(port, host);
let data = "";
let finished = false;

function finish(exitCode = 0) {
  if (finished) return;
  finished = true;
  if (data) console.log(data);
  client.destroy();
  process.exit(exitCode);
}

client.on("connect", () => {
  client.write(JSON.stringify(request));
});

client.on("data", (chunk) => {
  data += chunk.toString("utf8");
  finish();
});

client.on("end", () => finish());
client.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});

setTimeout(() => {
  console.error(data || `Timed out waiting for Blender after ${timeoutMs}ms.`);
  finish(1);
}, timeoutMs);
