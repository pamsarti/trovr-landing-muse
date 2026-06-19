/**
 * Generates supabase/seed.sql from the repo's demo JSON so a fresh local
 * Supabase has the exact same content structure as the Lovable project.
 *
 * Run with:  npm run seed:gen   (which is: tsx scripts/generate-seed.ts)
 *
 * Data sources (these ARE the demo data, replaced later by the real Lovable export):
 *   - src/data/trips.json            -> public.trips
 *   - src/data/spots.json            -> public.spots
 *   - src/data/journal-articles.json -> public.journal_articles
 *   - src/data/trip-editorials.ts    -> trips.editorial_paragraph
 *   - site_config defaults below     -> public.site_config
 *
 * The admin auth user + role is created separately by scripts/seed-admin.mjs
 * (auth.users can't be created from plain SQL reliably across GoTrue versions).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { TRIP_EDITORIALS } from "../src/data/trip-editorials";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../src/data");
const outFile = resolve(here, "../supabase/seed.sql");

type Trip = {
  id: string;
  activity: string;
  destination: string;
  country: string;
  continent: string;
  operator: string;
  operator_url: string;
  duration_days: number | string;
  season: string;
  price_range: string;
  level: string;
  summary: string;
  source_url: string;
  status: string;
};

type Spot = {
  id: string;
  activity: string;
  name: string;
  region: string;
  city: string;
  country: string;
  coordinates: { lat: number; lng: number } | null;
  conditions: Record<string, unknown>;
  description: string;
  descriptionRaw?: string;
  sourceUrl?: string;
  status: string;
};

type Article = {
  slug: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: number;
  heroImage: string;
  body: string;
  status: string;
};

// Drop duplicate rows by their unique key (keep first), since the DB enforces
// UNIQUE on trip_id / spot_id / slug. Reports how many were dropped.
function dedupe<T>(rows: T[], keyOf: (r: T) => string, label: string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  let dropped = 0;
  for (const r of rows) {
    const k = keyOf(r);
    if (seen.has(k)) {
      dropped++;
      continue;
    }
    seen.add(k);
    out.push(r);
  }
  if (dropped) console.warn(`  (dropped ${dropped} duplicate ${label})`);
  return out;
}

const trips: Trip[] = dedupe(
  JSON.parse(readFileSync(resolve(dataDir, "trips.json"), "utf8")),
  (t) => t.id,
  "trip_id(s)",
);
const spots: Spot[] = dedupe(
  JSON.parse(readFileSync(resolve(dataDir, "spots.json"), "utf8")),
  (s) => s.id,
  "spot_id(s)",
);
const articles: Article[] = dedupe(
  JSON.parse(readFileSync(resolve(dataDir, "journal-articles.json"), "utf8")),
  (a) => a.slug,
  "article slug(s)",
);

// --- Hero image logic mirrored from src/lib/trips-data.ts (tripImage) ---
const IMAGE_KEY: Record<string, string> = {
  "kite|Egypt": "photo-1530541930197-ff16ac917b0e",
  "kite|Venezuela": "photo-1502933691298-84fc14542831",
  "surf|Maldives": "photo-1505228395891-9a51e7e86bf6",
  "surf|Costa Rica": "photo-1502680390469-be75c86b636f",
  "horseback|Egypt": "photo-1518709268805-4e9042af2176",
  "horseback|Kyrgyzstan": "photo-1547471080-7cc2caa01a7e",
  "wildlife|USA (Alaska)": "photo-1531176175-2c2fda35d5b8",
  "martial-arts|China": "photo-1555597673-b21d5c935865",
  "river-cruise|Egypt": "photo-1568797629192-aa3d54e5e0a3",
};
const FALLBACK_BY_ACTIVITY: Record<string, string> = {
  kite: "photo-1502933691298-84fc14542831",
  surf: "photo-1502680390469-be75c86b636f",
  horseback: "photo-1553284965-83fd3e82fa5a",
  wildlife: "photo-1456926631375-92c8ce872def",
  "martial-arts": "photo-1555597673-b21d5c935865",
  "river-cruise": "photo-1539635278303-d4002c07eae3",
};
function tripImage(activity: string, country: string, w = 1600, h = 900): string {
  const id =
    IMAGE_KEY[`${activity}|${country}`] ??
    FALLBACK_BY_ACTIVITY[activity] ??
    FALLBACK_BY_ACTIVITY.surf;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

// --- SQL value helpers ---
const q = (v: unknown): string =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;
const num = (v: unknown): string =>
  v === null || v === undefined || v === "" ? "NULL" : String(v);
const jsonb = (v: unknown): string =>
  v === null || v === undefined ? "NULL" : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

// --- site_config demo defaults (structure matches admin homepage/about editors) ---
const siteConfig: Record<string, unknown> = {
  homepage_hero_headline: "Travel that asks something of you.",
  homepage_hero_subline:
    "A short, edited list of trips for the body — not the resort.",
  homepage_manifesto_p1:
    "We don't list every operator. We list the ones we would book ourselves.",
  homepage_manifesto_p2:
    "Each trip here is run by people who know the place, the season, and the risk.",
  homepage_manifesto_p3:
    "The list stays short on purpose. That restraint is the whole point.",
  homepage_stats: [
    { value: String(trips.length), label: "Curated trips" },
    { value: String(new Set(trips.map((t) => t.country)).size), label: "Countries" },
    { value: String(new Set(trips.map((t) => t.activity)).size), label: "Disciplines" },
  ],
  newsletter_heading: "Dispatches from the field.",
  newsletter_subline:
    "Occasional notes on new trips and the places behind them. No noise.",
  footer_text: "© Trovr. Travel that asks something of you.",
  about_hero_headline: "We send people to the places that change them.",
  about_hero_subline:
    "Trovr is a curated index of operator-run trips for people who want the real thing.",
  about_why_p1:
    "Most travel sites optimise for volume. We optimise for trust.",
  about_why_p2:
    "Every trip is run by an operator with a track record we can stand behind.",
  about_why_p3:
    "If a trip isn't something we'd do ourselves, it isn't here.",
  about_founder_quote:
    "I wanted a list I could send a friend without a disclaimer.",
  about_founder_name: "— Pamela Sarti, founder",
  about_founder_p1:
    "Trovr started as a private spreadsheet of operators I trusted.",
  about_founder_p2:
    "It grew into a small, edited index — and a promise to keep it small.",
  about_curate_heading: "How we curate.",
  about_curate_principles: [
    { title: "Operators, not aggregators.", body: "We link to the people who run the trip, not a reseller skimming the margin." },
    { title: "Compliance, in practice.", body: "Permits, insurance, and local law are table stakes, not fine print." },
    { title: "Track record over branding.", body: "Years on the water beat a slick website every time." },
    { title: "Trips that earn the word 'immersive.'", body: "The place has to be part of the practice, not a backdrop." },
  ],
};

// --- Build SQL ---
const lines: string[] = [];
lines.push("-- AUTO-GENERATED by scripts/generate-seed.ts — do not edit by hand.");
lines.push("-- Regenerate with: npm run seed:gen");
lines.push("-- Loads demo content into the CMS tables for local development.");
lines.push("");
lines.push("BEGIN;");
lines.push("");
lines.push(
  "TRUNCATE TABLE public.trips, public.spots, public.journal_articles, public.site_config;",
);
lines.push("");

// trips
lines.push("-- trips ------------------------------------------------------------");
trips.forEach((t, i) => {
  const cols =
    "trip_id, activity, destination, country, continent, operator, operator_url, " +
    "duration_days, season, price_range, level, summary, editorial_paragraph, " +
    "source_url, status, hero_image_url, sort_order";
  const vals = [
    q(t.id),
    q(t.activity),
    q(t.destination),
    q(t.country),
    q(t.continent),
    q(t.operator),
    q(t.operator_url),
    q(String(t.duration_days)),
    q(t.season),
    q(t.price_range),
    q(t.level),
    q(t.summary),
    q(TRIP_EDITORIALS[t.id] ?? null),
    q(t.source_url),
    q(t.status),
    q(tripImage(t.activity, t.country)),
    String(i),
  ].join(", ");
  lines.push(`INSERT INTO public.trips (${cols}) VALUES (${vals});`);
});
lines.push("");

// spots
lines.push("-- spots ------------------------------------------------------------");
spots.forEach((s) => {
  const cols =
    "spot_id, activity, name, country, region, city, lat, lng, conditions, " +
    "description, description_raw, source_url, status";
  const vals = [
    q(s.id),
    q(s.activity),
    q(s.name),
    q(s.country),
    q(s.region),
    q(s.city),
    num(s.coordinates?.lat ?? null),
    num(s.coordinates?.lng ?? null),
    jsonb(s.conditions ?? {}),
    q(s.description ?? ""),
    q(s.descriptionRaw ?? null),
    q(s.sourceUrl ?? null),
    q(s.status),
  ].join(", ");
  lines.push(`INSERT INTO public.spots (${cols}) VALUES (${vals});`);
});
lines.push("");

// journal_articles
lines.push("-- journal_articles -------------------------------------------------");
articles.forEach((a) => {
  const cols =
    "slug, category, title, dek, author, published_date, read_time_minutes, " +
    "hero_image_url, body, status";
  const vals = [
    q(a.slug),
    q(a.category),
    q(a.title),
    q(a.dek),
    q(a.author),
    q(a.date),
    num(a.readTime),
    q(a.heroImage),
    q(a.body),
    q(a.status),
  ].join(", ");
  lines.push(`INSERT INTO public.journal_articles (${cols}) VALUES (${vals});`);
});
lines.push("");

// site_config
lines.push("-- site_config -----------------------------------------------------");
for (const [key, value] of Object.entries(siteConfig)) {
  lines.push(
    `INSERT INTO public.site_config (key, value) VALUES (${q(key)}, ${jsonb(value)});`,
  );
}
lines.push("");
lines.push("COMMIT;");
lines.push("");

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, lines.join("\n"), "utf8");

console.log(
  `Wrote ${outFile}\n  trips: ${trips.length}\n  spots: ${spots.length}\n  articles: ${articles.length}\n  site_config keys: ${Object.keys(siteConfig).length}`,
);
