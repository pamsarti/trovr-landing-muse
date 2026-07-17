import rawSpots from "@/data/spots.json";

export type SpotStatus = "active" | "coming-soon";
export type Activity =
  | "kite"
  | "surf"
  | "snow"
  | "dive"
  | "climb"
  | "sail"
  | "hike"
  | "run"
  | "bike"
  | "horseback";

export type Spot = {
  id: string;
  activity: Activity;
  name: string;
  region: string; // continent
  city: string; // sub-region (country/island group)
  country: string;
  coordinates: { lat: number; lng: number } | null;
  conditions: {
    windConsistency: number | null;
    waterType: string[];
    waterTemp: string | null;
    bestMonths: string[];
    activitySpecific?: Record<string, string>;
    fieldStatus?: Record<string, "verified" | "source_claims" | "estimate">;
  };
  description: string;
  descriptionRaw?: string;
  sourceUrl?: string;
  sources?: string[];
  status: SpotStatus;
  /** Optional link to a Journal article slug covering this spot. */
  journalSlug?: string;
  /** Optional link to a Trip id (see trips-data). Renders a Trip CTA on the spot card. */
  relatedTripId?: string;
  /** Optional link to a Journal article slug. Renders a Journal CTA on the spot card. */
  relatedArticleSlug?: string;
};

const ALL_SPOTS = rawSpots as Spot[];

/**
 * A spot is considered "public" once it has curated editorial content.
 * Legacy imports without a `descriptionRaw` (rich body) are hidden from
 * every public listing/map/detail until an editor fills them in. Nothing
 * is deleted — flip the data and they reappear.
 */
function isPublic(spot: Spot): boolean {
  // A spot is only public once an editor has added curated conditions
  // (activitySpecific fields) AND a written description. Legacy scraped
  // entries — even those with a raw source blob or just a sourceUrl — stay
  // hidden until they are properly filled in. Nothing is deleted.
  const hasDescription = typeof spot.description === "string" && spot.description.trim().length > 0;
  const activitySpecific = spot.conditions?.activitySpecific;
  const hasCuratedConditions = !!activitySpecific && Object.keys(activitySpecific).length > 0;
  return hasDescription && hasCuratedConditions;
}

const PUBLIC_SPOTS = ALL_SPOTS.filter(isPublic);

/** Optional activity filter. When null/undefined, returns every spot. */
export type ActivityFilter = Activity | null | undefined;

/** Single data accessor. Pass an Activity to filter; pass null/undefined for all. */
export function getSpotsByActivity(activity: ActivityFilter): Spot[] {
  return activity ? PUBLIC_SPOTS.filter((s) => s.activity === activity) : PUBLIC_SPOTS;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type Continent = {
  name: string;
  slug: string;
  count: number;
  image: string;
};

const CONTINENT_IMAGES: Record<string, string> = {
  Africa:
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=70",
  Asia: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=70",
  Caribbean:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=70",
  "Central America":
    "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=70",
  Europe:
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "North America":
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=70",
  Oceania:
    "https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118?auto=format&fit=crop&w=1600&q=70",
  "South America":
    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=70",
};

export function getContinents(activity: ActivityFilter): Continent[] {
  const spots = getSpotsByActivity(activity);
  const map = new Map<string, number>();
  for (const s of spots) map.set(s.region, (map.get(s.region) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
      image: CONTINENT_IMAGES[name] ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findContinent(activity: ActivityFilter, slug: string) {
  return getContinents(activity).find((c) => c.slug === slug) ?? null;
}

export type RegionGroup = {
  name: string; // city field
  slug: string;
  count: number;
};

export function getRegions(activity: ActivityFilter, continentName: string): RegionGroup[] {
  const spots = getSpotsByActivity(activity).filter((s) => s.region === continentName);
  const map = new Map<string, number>();
  for (const s of spots) map.set(s.city, (map.get(s.city) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findRegion(activity: ActivityFilter, continentName: string, regionSlug: string) {
  return getRegions(activity, continentName).find((r) => r.slug === regionSlug) ?? null;
}

export function getSpotsInRegion(
  activity: ActivityFilter,
  continentName: string,
  regionName: string,
): Spot[] {
  return getSpotsByActivity(activity)
    .filter((s) => s.region === continentName && s.city === regionName)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findSpot(
  activity: ActivityFilter,
  continentName: string,
  regionName: string,
  spotSlug: string,
): Spot | null {
  return (
    getSpotsInRegion(activity, continentName, regionName).find(
      (s) => slugify(s.name) === spotSlug,
    ) ?? null
  );
}

/**
 * Static metadata for every supported activity. Whether an activity is
 * available in the UI (`active`) is derived below from real data — a filter
 * chip appears/enables the moment a spot with that activity exists.
 */
const ACTIVITY_META: {
  id: Activity;
  label: string;
  icon?: string;
  color?: string;
}[] = [
  { id: "kite", label: "Kite", color: "#0369a1" },
  { id: "surf", label: "Surf", color: "#0891b2" },
  { id: "snow", label: "Snow", color: "#64748b" },
  { id: "dive", label: "Dive", color: "#155e75" },
  { id: "climb", label: "Climb", color: "#7c2d12" },
  { id: "sail", label: "Sail", color: "#1e40af" },
  { id: "hike", label: "Hiking", icon: "footprints", color: "#4a7c59" },
  { id: "run", label: "Trail Running", icon: "activity", color: "#c2410c" },
  { id: "bike", label: "MTB", icon: "bike", color: "#a16207" },
  { id: "horseback", label: "Horseback", icon: "horse", color: "#8b4a2b" },
];

export const DEFAULT_MAP_ACTIVITY: Activity = "kite";

export function colorForActivity(activity: Activity): string {
  return ACTIVITY_META.find((a) => a.id === activity)?.color ?? "#1a1a1a";
}

const ACTIVITY_IDS: readonly Activity[] = ACTIVITY_META.map((a) => a.id);

const ACTIVITIES_WITH_SPOTS: ReadonlySet<Activity> = new Set(
  PUBLIC_SPOTS.map((s) => s.activity).filter((a): a is Activity =>
    (ACTIVITY_IDS as readonly string[]).includes(a),
  ),
);

export const ACTIVITIES: {
  id: Activity;
  label: string;
  /** True when at least one spot with this activity is registered. */
  active: boolean;
  icon?: string;
  color?: string;
}[] = ACTIVITY_META.map((meta) => ({
  ...meta,
  active: ACTIVITIES_WITH_SPOTS.has(meta.id),
}));

/** Parse an unknown value as an Activity; returns null when absent/invalid. */
export function parseActivity(value: unknown): Activity | null {
  return typeof value === "string" && (ACTIVITY_IDS as readonly string[]).includes(value)
    ? (value as Activity)
    : null;
}

/**
 * Validator for TanStack Router `validateSearch` on the /spots/* routes.
 * When the URL has no `activity`, no filter is applied.
 */
export function validateSpotsSearch(search: Record<string, unknown>): {
  activity?: Activity;
} {
  const parsed = parseActivity(search.activity);
  return parsed ? { activity: parsed } : {};
}

/** Human label for an activity (e.g. "surf" -> "Surf", "run" -> "Trail Running"). */
export function activityLabel(activity: Activity): string {
  return ACTIVITY_META.find((a) => a.id === activity)?.label ?? activity;
}

/**
 * Placeholder photography per activity, curated on Unsplash — the spots data
 * carries no images yet, so the home/hero borrow a coherent shot by sport
 * (the same approach trips-data uses). Swap for real spot photos when available.
 */
const SPOT_ACTIVITY_IMAGE: Record<Activity, string> = {
  kite: "photo-1502933691298-84fc14542831",
  surf: "photo-1502680390469-be75c86b636f",
  snow: "photo-1551524559-8af4e6624178",
  dive: "photo-1544551763-46a013bb70d5",
  climb: "photo-1522163182402-834f871fd851",
  sail: "photo-1502680390469-be75c86b636f",
  hike: "photo-1464822759023-fed622ff2c3b",
  run: "photo-1571008887538-b36bb32f4571",
  bike: "photo-1544191696-15693072e0b5",
  horseback: "photo-1553284965-83fd3e82fa5a",
};

export function spotImage(spot: Spot, w = 1600, h = 1000): string {
  const id = SPOT_ACTIVITY_IMAGE[spot.activity] ?? SPOT_ACTIVITY_IMAGE.hike;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

/** All public spots, for the homepage. */
export function getPublicSpots(): Spot[] {
  return PUBLIC_SPOTS;
}

/**
 * Four dossier metrics drawn from the spot's REAL data — no invented numbers.
 * Chosen so every public spot has all four: activity, country, region
 * (continent), and best time (bestMonths). recommended_level is only present on
 * a few spots, so it is NOT used here (it would show blank on most).
 */
export function spotHomeMetrics(spot: Spot): { label: string; value: string }[] {
  const best = spot.conditions.bestMonths?.[0] ?? null;
  // Keep values compact for the small dossier cells.
  const shorten = (s: string, n = 42) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  return [
    { key: "activity", value: activityLabel(spot.activity) },
    { key: "country", value: spot.country },
    { key: "region", value: spot.region },
    { key: "best", value: best ? shorten(best) : "—" },
  ].map((m) => ({ label: m.key, value: m.value }));
}
