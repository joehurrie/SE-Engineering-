import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { after, before, test } from "node:test";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const rootDir = process.cwd();
let serverProcess;
let baseUrl;
let serverOutput = "";

async function getAvailablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  await new Promise((resolve) => server.close(resolve));
  return address.port;
}

before(async () => {
  const port = await getAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverProcess = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: rootDir, env: process.env, stdio: ["ignore", "pipe", "pipe"] }
  );
  serverProcess.stdout.setEncoding("utf8").on("data", (chunk) => {
    serverOutput = (serverOutput + chunk).slice(-5000);
  });
  serverProcess.stderr.setEncoding("utf8").on("data", (chunk) => {
    serverOutput = (serverOutput + chunk).slice(-5000);
  });

  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Next server exited before startup.\n${serverOutput}`);
    }
    try {
      const response = await fetch(`${baseUrl}/api/admin/stats`);
      if (response.status === 401) return;
    } catch {
      // The server is not accepting requests yet.
    }
    await delay(250);
  }
  throw new Error(`Next server did not become ready.\n${serverOutput}`);
}, { timeout: 60_000 });

after(async () => {
  if (!serverProcess || serverProcess.exitCode !== null) return;
  serverProcess.kill();
  await Promise.race([
    new Promise((resolve) => serverProcess.once("exit", resolve)),
    delay(3000),
  ]);
});

test("administrator collection APIs reject requests without a valid session", async () => {
  const paths = [
    "/api/admin/stats",
    "/api/admin/content",
    "/api/admin/elevators",
    "/api/admin/inquiries",
    "/api/admin/news",
    "/api/admin/projects",
    "/api/admin/services",
  ];

  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 401, `${path} must require an administrator session`);
  }

  const uploadResponse = await fetch(`${baseUrl}/api/upload`, { method: "POST" });
  assert.equal(uploadResponse.status, 401, "CMS uploads must require an administrator session");
});

test("malformed credentials are rejected before database lookup", async () => {
  const response = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "", password: "" }),
  });
  assert.equal(response.status, 400);
});

test("an invalid cookie cannot enter the admin interface", async () => {
  const response = await fetch(`${baseUrl}/admin/projects`, {
    headers: { Cookie: "se_admin_token=invalid.signature" },
    redirect: "manual",
  });
  assert.equal(response.status, 307);
  assert.match(response.headers.get("location") ?? "", /\/admin\/login/);
});