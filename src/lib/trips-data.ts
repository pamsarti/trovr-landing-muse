import rawTrips from "@/data/trips.json";
import rawTripsPt from "@/data/trips.pt.json";

export type TripActivity =
  | "kite"
  | "surf"
  | "horseback"
  | "wildlife"
  | "ski-sail"
  | "rail"
  | "balloon"
  | "diving";

export type Trip = {
  id: string;
  activity: TripActivity;
  destination: string;
  country: string;
  continent: string;
  operator: string;
  operator_url: string;
  duration_days: number | string;
  season: string;
  seasonSource?: string;
  price_range: string;
  level: string;
  summary: string;
  detail: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  source_url: string;
  status: "coming-soon" | "active";
  hidden?: boolean;
};

type TripPtOverlay = Partial<
  Pick<Trip, "destination" | "country" | "continent" | "price_range" | "level" | "summary">
> & { seasonDisplay?: string };

const tripOverlays = (rawTripsPt as { trips: Record<string, TripPtOverlay> }).trips;
export const ALL_TRIPS = (rawTrips as Trip[]).filter((trip) => !trip.hidden).map((trip) => {
  const overlay = tripOverlays[trip.id];
  return {
    ...trip,
    ...overlay,
    seasonSource: trip.season,
    season: overlay?.seasonDisplay ?? trip.season,
  };
});

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ACTIVITY_LABEL: Record<TripActivity, string> = {
  kite: "Kite",
  surf: "Surf",
  horseback: "Cavalgada",
  wildlife: "Vida selvagem",
  "ski-sail": "Esqui e vela",
  rail: "Viagem de trem",
  balloon: "Balonismo",
  diving: "Mergulho",
};

export function tripImage(trip: Trip): string {
  return trip.image;
}

/** Duration helpers. */
export function durationMinDays(trip: Trip): number {
  const d = trip.duration_days;
  if (typeof d === "number") return d;
  const m = String(d).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

export function durationLabel(trip: Trip): string {
  const d = trip.duration_days;
  if (d === "") return "Duração a consultar";
  if (typeof d === "number") return `${d} ${d === 1 ? "dia" : "dias"}`;
  if (/^\d+$/.test(String(d))) return `${d} ${String(d) === "1" ? "dia" : "dias"}`;
  if (String(d).toLowerCase() === "varies") return "duração variável";
  if (String(d).toLowerCase() === "flexible") return "duração flexível";
  return `${d} dias`;
}

/** Activity → preposition for "X days on Y" tag. */
const ACTIVITY_TAG: Record<TripActivity, string> = {
  kite: "na água",
  surf: "na água",
  horseback: "a cavalo",
  wildlife: "em vida selvagem",
  "ski-sail": "nos fiordes",
  rail: "a bordo",
  balloon: "na savana",
  diving: "no recife",
};

export function tripTag(trip: Trip): string {
  return `${trip.country} · ${durationLabel(trip)} ${ACTIVITY_TAG[trip.activity]}`;
}

/** Season parsing: returns 1-indexed months covered. */
const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function monthIndex(name: string): number | null {
  const i = MONTHS.indexOf(name.toLowerCase());
  return i === -1 ? null : i + 1;
}

export function seasonMonths(season: string): Set<number> {
  const s = season.toLowerCase();
  const out = new Set<number>();
  if (s.includes("year-round") || s.includes("year round")) {
    for (let i = 1; i <= 12; i++) out.add(i);
  }
  // find all ranges like "May-October"
  const re = /([a-z]+)\s*[-–to]+\s*([a-z]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(season)) !== null) {
    const a = monthIndex(m[1]);
    const b = monthIndex(m[2]);
    if (a && b) {
      let i = a;
      // inclusive, wraps if b<a
      while (true) {
        out.add(i);
        if (i === b) break;
        i = (i % 12) + 1;
      }
    }
  }
  return out;
}

export function isInSeason(trip: Trip, month: number): boolean {
  return seasonMonths(trip.seasonSource ?? trip.season).has(month);
}

/** Accessors. */
export function getTripsByActivity(activity: TripActivity): Trip[] {
  return ALL_TRIPS.filter((t) => t.activity === activity);
}

export function findTrip(id: string): Trip | null {
  return ALL_TRIPS.find((t) => t.id === id) ?? null;
}

export function relatedTrips(trip: Trip, n = 3): Trip[] {
  return ALL_TRIPS.filter(
    (t) => t.id !== trip.id && (t.activity === trip.activity || t.continent === trip.continent),
  ).slice(0, n);
}

/** Themes. */
export type Theme = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  matches: (t: Trip) => boolean;
};

export const THEMES: Theme[] = [
  {
    slug: "asks-something",
    title: "Nas ondas",
    subtitle: "Surfe a longa esquerda de Chicama.",
    image: "/images/hero/chicama-surfe-v3.webp",
    matches: (t) => t.activity === "surf",
  },
  {
    slug: "live-aboard",
    title: "Dias a bordo",
    subtitle: "Navegue entre pontos de kitesurf.",
    image: "/images/hero/kite-licensed.webp",
    matches: (t) => t.activity === "kite",
  },
  {
    slug: "cultural-depth",
    title: "Encontros debaixo d’água",
    subtitle: "Nade com jubartes em Tonga ou mergulhe com tubarões em Providencia.",
    image: "/images/hero/providencia-licensed.webp",
    matches: (t) => t.activity === "wildlife" || t.activity === "diving",
  },
];

export function findTheme(slug: string): Theme | null {
  return THEMES.find((t) => t.slug === slug) ?? null;
}

export function tripsByTheme(theme: Theme): Trip[] {
  return ALL_TRIPS.filter(theme.matches);
}

/** Featured (hero rotator) trips + editorial lines. */
export type Featured = { trip: Trip; line: string };

export const FEATURED: Featured[] = ALL_TRIPS.map((trip) => ({ trip, line: trip.summary }));

/** Continents & countries (sorted unique). */
export function allContinents(): string[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.continent).filter(Boolean))).sort();
}

export function allCountries(): string[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.country).filter(Boolean))).sort();
}

export function allActivities(): TripActivity[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.activity))) as TripActivity[];
}

/** Duration buckets. */
export type DurationBucket = "short" | "mid" | "long" | "consult";
export function durationBucket(t: Trip): DurationBucket {
  const d = durationMinDays(t);
  if (!d) return "consult";
  if (d <= 3) return "short";
  if (d <= 7) return "mid";
  return "long";
}
