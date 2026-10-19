#!/usr/bin/env node
// Read-only HTTP checks. With no base URL, start and stop an isolated local dev server.
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const index = process.argv.indexOf("--base-url");
const base = new URL(index >= 0 ? process.argv[index + 1] : "http://127.0.0.1:4175");
if (
  base.pathname !== "/" ||
  base.search ||
  base.hash ||
  !["http:", "https:"].includes(base.protocol)
) {
  throw new Error("Use an HTTP(S) origin as --base-url");
}
const failures = [];
async function get(path) {
  return fetch(new URL(path, base), { redirect: "manual", signal: AbortSignal.timeout(30000) });
}

async function check() {
  const sitemap = await get("/sitemap.xml");
  if (sitemap.status !== 200) throw new Error(`sitemap: HTTP ${sitemap.status}`);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length || new Set(urls).size !== urls.length)
    throw new Error("Empty or duplicate sitemap URLs");
  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== "https://trovr.com.br" || parsed.search || parsed.hash) {
      failures.push(`${url}: invalid canonical sitemap URL`);
      continue;
    }
    const response = await get(parsed.pathname);
    const html = await response.text();
    if (response.status !== 200)
      failures.push(`${url}: HTTP ${response.status} ${response.headers.get("location") ?? ""}`);
    const directive = response.headers.get("x-robots-tag") ?? "";
    if (/\b(noindex|none)\b/i.test(directive)) failures.push(`${url}: X-Robots-Tag ${directive}`);
    for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
      if (
        /\bname=["'](?:robots|googlebot)["']/i.test(tag[0]) &&
        /\bcontent=["'][^"']*\b(?:noindex|none)\b/i.test(tag[0])
      ) {
        failures.push(`${url}: noindex meta`);
      }
    }
    const text = html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .trim();
    if (!text || !/<title>[^<]+<\/title>/i.test(html))
      failures.push(`${url}: empty HTML or missing title`);
    for (const tag of html.matchAll(/<link\b[^>]*>/gi)) {
      if (/\brel=["']canonical["']/i.test(tag[0])) {
        const href = tag[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
        if (href !== url) failures.push(`${url}: canonical differs (${href})`);
      }
    }
  }
  // Never allow missing content to become a successful home-page redirect.
  const knownTrip = JSON.parse(
    readFileSync(new URL("../src/data/trips.json", import.meta.url), "utf8"),
  )[0].id;
  for (const path of [
    `/trips/${encodeURIComponent(knownTrip)}`,
    "/trips/theme/asks-something",
    "/indexing-check-missing-page",
    "/journal/indexing-check-missing",
    "/spots/asia/indonesia/indexing-check-missing",
    "/trips/indexing-check-missing",
    "/trips/theme/indexing-check-missing",
  ]) {
    const response = await get(path);
    if (response.status !== 404)
      failures.push(`${path}: expected 404, received ${response.status}`);
  }
  const trips = await get("/trips");
  if (
    trips.status !== 307 ||
    new URL(trips.headers.get("location") ?? "", base).pathname !== "/viagem"
  ) {
    failures.push("/trips: expected temporary redirect to /viagem");
  }
  if (failures.length) {
    failures.forEach((line) => console.error(line));
    process.exitCode = 1;
  } else {
    console.log(
      `[indexing] PASS: ${urls.length} sitemap pages, missing routes and legacy redirect at ${base.origin}`,
    );
  }
}

let server;
let serverOutput = "";
let serverError;
try {
  if (index < 0) {
    server = spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "dev",
        "--host",
        "127.0.0.1",
        "--port",
        "4175",
        "--strictPort",
      ],
      {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    server.on("error", (error) => {
      serverError = error;
    });
    for (const stream of [server.stdout, server.stderr]) {
      stream.on("data", (chunk) => {
        serverOutput = (serverOutput + chunk).slice(-8000);
      });
    }
    const deadline = Date.now() + 60000;
    while (!/Local:.*http:\/\/127\.0\.0\.1:4175/.test(serverOutput)) {
      if (serverError || server.exitCode !== null || Date.now() > deadline) {
        throw new Error(`Local indexing server failed: ${serverError ?? serverOutput}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  await check();
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    const timeout = setTimeout(() => server.kill("SIGKILL"), 5000);
    await exited;
    clearTimeout(timeout);
  }
}
