/**
 * GardenMap local API — stdlib-only Node server.
 * Persists garden data to a local JSON file and proxies Trefle plant
 * lookups so the Trefle token never ships in the browser bundle.
 *
 * Usage: node server/index.js
 */
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 4001;
const DATA_FILE = path.join(__dirname, "data", "garden-data.json");
const CONFIG_FILE = path.join(__dirname, "config.json");
const CONFIG_EXAMPLE = path.join(__dirname, "config.example.json");

function loadConfig() {
  const file = fs.existsSync(CONFIG_FILE) ? CONFIG_FILE : CONFIG_EXAMPLE;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { trefleToken: "" };
  }
}

function readGarden() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { beds: [] };
  }
}

function writeGarden(state) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function trefleGet(pathAndQuery) {
  const { trefleToken } = loadConfig();
  return new Promise((resolve, reject) => {
    if (!trefleToken) {
      reject({ status: 412, error: "No Trefle API token configured in server/config.json" });
      return;
    }
    const sep = pathAndQuery.includes("?") ? "&" : "?";
    const url = `https://trefle.io/api/v1${pathAndQuery}${sep}token=${trefleToken}`;
    https
      .get(url, (r) => {
        let data = "";
        r.on("data", (c) => (data += c));
        r.on("end", () => {
          if (r.statusCode >= 400) {
            reject({ status: r.statusCode, error: `Trefle API error ${r.statusCode}` });
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject({ status: 502, error: "Bad JSON from Trefle" });
          }
        });
      })
      .on("error", (e) => reject({ status: 502, error: e.message }));
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (u.pathname === "/api/garden" && req.method === "GET") {
    sendJson(res, 200, readGarden());
    return;
  }

  if (u.pathname === "/api/garden" && req.method === "PUT") {
    try {
      const body = await readBody(req);
      const parsed = JSON.parse(body);
      writeGarden(parsed);
      sendJson(res, 200, { ok: true });
    } catch (e) {
      sendJson(res, 400, { ok: false, error: e.message });
    }
    return;
  }

  if (u.pathname === "/api/cultivar/search" && req.method === "GET") {
    const q = u.searchParams.get("q") || "";
    if (!q.trim()) {
      sendJson(res, 200, { data: [] });
      return;
    }
    try {
      const result = await trefleGet(`/plants/search?q=${encodeURIComponent(q)}`);
      sendJson(res, 200, result);
    } catch (e) {
      sendJson(res, e.status || 500, { error: e.error || "lookup failed" });
    }
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  const hasToken = !!loadConfig().trefleToken;
  console.log(`[gardenmap-server] http://localhost:${PORT}  (Trefle token: ${hasToken ? "configured" : "MISSING — copy server/config.example.json to server/config.json and add it"})`);
});
