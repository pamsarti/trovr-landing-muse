#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const spotsPath = resolve(__dirname, "../src/data/spots.json");
const outPath = resolve(__dirname, "../src/data/home-stats.json");

const spots = JSON.parse(readFileSync(spotsPath, "utf8"));
const active = spots.filter((s) => s.status === "active");
const activeSpots = active.length;
const activeContinents = new Set(active.map((s) => s.region)).size;

const stats = { activeSpots, activeContinents };
writeFileSync(outPath, JSON.stringify(stats, null, 2) + "\n");
console.log("[generate-stats]", stats);