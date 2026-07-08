#!/usr/bin/env node
// Generates public/sitemap.xml from data files. No external deps.
// Run automatically by `npm run build` before `vite build`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://trovr.com.br";
const LIVE_TRIP_STATUSES = ["active"];

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// NOTE: keep in sync with slugify() in src/lib/spots-data.ts and
// src/lib/trips-data.ts. Duplicated here because this script is plain
// Node ESM and cannot import the TS module without a transpiler.
function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readJson(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf8"));
}

const journal = readJson("src/data/journal-articles.json");
const trips = readJson("src/data/trips.json");
const spots = readJson("src/data/spots.json");

const urls = [];
const push = (path) => urls.push(`${SITE}${path}`);

// Static routes
const staticPaths = ["/", "/about", "/journal"];
staticPaths.forEach(push);

// Journal (published only)
const publishedJournal = journal.filter((a) => a.status === "published");
publishedJournal.forEach((a) => push(`/journal/${a.slug}`));

// Trips (only publishable statuses)
const publishableTrips = trips.filter((t) => LIVE_TRIP_STATUSES.includes(t.status));
publishableTrips.forEach((t) => push(`/trips/${t.id}`));

// Trip themes — derived only from publishable trips
const themes = Array.from(new Set(publishableTrips.map((t) => t.activity)));
themes.forEach((a) => push(`/trips/theme/${a}`));

// Spots (active only) — /spots/{continent}/{region}/{spot}
const activeSpots = spots.filter((s) => s.status === "active");
activeSpots.forEach((s) => {
  const continent = slugify(s.region);
  const region = slugify(s.city);
  const spot = slugify(s.name);
  push(`/spots/${continent}/${region}/${spot}`);
});

// Build XML
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
  `</urlset>`,
  "",
].join("\n");

const outDir = resolve(root, "public");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "sitemap.xml"), xml, "utf8");

console.log("[sitemap] Written to public/sitemap.xml");
console.log(`  static routes : ${staticPaths.length}`);
console.log(`  journal posts : ${publishedJournal.length}`);
console.log(`  trips         : ${publishableTrips.length}`);
console.log(`  trip themes   : ${themes.length}`);
console.log(`  spots         : ${activeSpots.length}`);
console.log(`  TOTAL urls    : ${urls.length}`);