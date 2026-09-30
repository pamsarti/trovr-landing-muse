#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const spotsPath = resolve(__dirname, "../src/data/spots.json");
const outPath = resolve(__dirname, "../src/data/home-stats.json");

const spots = JSON.parse(readFileSync(spotsPath, "utf8"));
const publicSpots = spots.filter((spot) => {
  const hasDescription = typeof spot.description === "string" && spot.description.trim().length > 0;
  const activitySpecific = spot.conditions?.activitySpecific;
  return hasDescription && activitySpecific && Object.keys(activitySpecific).length > 0;
});
const activeSpots = publicSpots.length;
const activeContinents = new Set(publicSpots.map((s) => s.region)).size;

const stats = { activeSpots, activeContinents };
writeFileSync(outPath, JSON.stringify(stats, null, 2) + "\n");
console.log("[generate-stats]", stats);
