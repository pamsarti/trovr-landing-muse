#!/usr/bin/env node
// Generates public/sitemap.xml from data files. No external deps.
// Run automatically by `npm run build` before `vite build`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PUBLIC_STATIC_PATHS } from "../src/lib/public-content.ts";

const SITE = "https://trovr.com.br";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function readJson(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf8"));
}

const journal = readJson("src/data/journal-articles.json");

const urls = [];
const push = (path) => urls.push(`${SITE}${path}`);

// Static routes
const staticPaths = PUBLIC_STATIC_PATHS;
staticPaths.forEach(push);

// Journal (published only)
const publishedJournal = journal.filter((a) => a.status === "published");
publishedJournal.forEach((a) => push(`/journal/${a.slug}`));

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
console.log(`  TOTAL urls    : ${urls.length}`);
