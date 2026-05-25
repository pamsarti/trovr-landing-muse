import rawSpots from "@/data/spots.json";

export type SpotStatus = "active" | "coming-soon";
export type Activity = "kite" | "surf" | "snow" | "dive" | "climb" | "sail";

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
  };
  description: string;
  descriptionRaw?: string;
  sourceUrl?: string;
  status: SpotStatus;
};

const ALL_SPOTS = rawSpots as Spot[];

/** Single data accessor. Filter by activity FIRST, always. */
export function getSpotsByActivity(activity: Activity): Spot[] {
  return ALL_SPOTS.filter((s) => s.activity === activity);
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
  Asia:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=70",
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

export function getContinents(activity: Activity): Continent[] {
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

export function findContinent(activity: Activity, slug: string) {
  return getContinents(activity).find((c) => c.slug === slug) ?? null;
}

export type RegionGroup = {
  name: string; // city field
  slug: string;
  count: number;
};

export function getRegions(activity: Activity, continentName: string): RegionGroup[] {
  const spots = getSpotsByActivity(activity).filter((s) => s.region === continentName);
  const map = new Map<string, number>();
  for (const s of spots) map.set(s.city, (map.get(s.city) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findRegion(activity: Activity, continentName: string, regionSlug: string) {
  return getRegions(activity, continentName).find((r) => r.slug === regionSlug) ?? null;
}

export function getSpotsInRegion(
  activity: Activity,
  continentName: string,
  regionName: string,
): Spot[] {
  return getSpotsByActivity(activity)
    .filter((s) => s.region === continentName && s.city === regionName)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findSpot(
  activity: Activity,
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

export const ACTIVITIES: { id: Activity; label: string; active: boolean }[] = [
  { id: "kite", label: "Kite", active: true },
  { id: "surf", label: "Surf", active: false },
  { id: "snow", label: "Snow", active: false },
  { id: "dive", label: "Dive", active: false },
  { id: "climb", label: "Climb", active: false },
  { id: "sail", label: "Sail", active: false },
];