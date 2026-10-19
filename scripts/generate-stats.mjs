#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { applySpotOverlay, isPublicSpot } from "../src/lib/public-content.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const spotsPath = resolve(__dirname, "../src/data/spots.json");
const outPath = resolve(__dirname, "../src/data/home-stats.json");

const spots = JSON.parse(readFileSync(spotsPath, "utf8"));
const overlays = JSON.parse(readFileSync(resolve(__dirname, "../src/data/spots.pt.json"), "utf8")).spots;
const publicSpots = spots.map((spot) => applySpotOverlay(spot, overlays[spot.id])).filter(isPublicSpot);
const activeSpots = publicSpots.length;
const activeContinents = new Set(publicSpots.map((s) => s.region)).size;

const stats = { activeSpots, activeContinents };
writeFileSync(outPath, JSON.stringify(stats, null, 2) + "\n");
console.log("[generate-stats]", stats);
