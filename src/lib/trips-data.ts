import rawTrips from "@/data/trips.json";
import rawTripsPt from "@/data/trips.pt.json";

export type TripActivity =
  | "kite"
  | "surf"
  | "horseback"
  | "wildlife"
  | "martial-arts"
  | "river-cruise";

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
  source_url: string;
  status: "coming-soon" | "active";
};

type TripPtOverlay = Partial<
  Pick<Trip, "destination" | "country" | "continent" | "price_range" | "level" | "summary">
> & { seasonDisplay?: string };

const tripOverlays = (rawTripsPt as { trips: Record<string, TripPtOverlay> }).trips;
export const ALL_TRIPS = (rawTrips as Trip[]).map((trip) => {
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
  "martial-arts": "Artes marciais",
  "river-cruise": "Cruzeiro fluvial",
};

/** Curated Unsplash photo IDs, picked per activity + country combo. */
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

const FALLBACK_BY_ACTIVITY: Record<TripActivity, string> = {
  kite: "photo-1502933691298-84fc14542831",
  surf: "photo-1502680390469-be75c86b636f",
  horseback: "photo-1553284965-83fd3e82fa5a",
  wildlife: "photo-1456926631375-92c8ce872def",
  "martial-arts": "photo-1555597673-b21d5c935865",
  "river-cruise": "photo-1539635278303-d4002c07eae3",
};

export function tripImage(trip: Trip, w = 1600, h = 900): string {
  if (trip.id === "alaska-wildlife-geographic") {
    return "/images/alaska-whale.jpg";
  }
  const id = IMAGE_KEY[`${trip.activity}|${trip.country}`] ?? FALLBACK_BY_ACTIVITY[trip.activity];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
}

/** Extra placeholder photos for trip detail page. */
export function tripExtraImages(trip: Trip): string[] {
  const base = tripImage(trip, 1200, 800);
  // vary by appending different sig via crop tweaks
  return [
    base,
    `https://images.unsplash.com/${FALLBACK_BY_ACTIVITY[trip.activity]}?auto=format&fit=crop&w=1200&h=800&q=70`,
    `https://images.unsplash.com/${IMAGE_KEY[`${trip.activity}|${trip.country}`] ?? FALLBACK_BY_ACTIVITY[trip.activity]}?auto=format&fit=crop&w=1200&h=800&q=70&sat=-20`,
  ];
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
  "martial-arts": "em treinamento",
  "river-cruise": "no rio",
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

const BOAT_RE = /\b(boat|cruise|charter|live[- ]?aboard|yacht|ship|safari)\b/i;
const REMOTE_RE = /\b(remote|desert|wilderness|nomad|backcountry|expedition)\b/i;
const CULTURE_RE = /\b(temple|heritage|nomadic|tradition|ancient|monastery)\b/i;

export const THEMES: Theme[] = [
  {
    slug: "asks-something",
    title: "Viagens que exigem algo de você",
    subtitle: "Para o corpo, não para o resort.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&h=1000&q=70",
    matches: (t) =>
      /advanced|intermediate/i.test(t.level) ||
      durationMinDays(t) >= 7 ||
      t.activity === "martial-arts",
  },
  {
    slug: "live-aboard",
    title: "Viver a bordo",
    subtitle: "Durma onde você navega.",
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1600&h=1000&q=70",
    matches: (t) => BOAT_RE.test(`${t.destination} ${t.operator} ${t.summary}`),
  },
  {
    slug: "off-grid",
    title: "Fora da rede",
    subtitle: "Onde o sinal deixa de importar.",
    image:
      "https://images.unsplash.com/photo-1531176175-2c2fda35d5b8?auto=format&fit=crop&w=1600&h=1000&q=70",
    matches: (t) =>
      ["Kyrgyzstan", "USA (Alaska)"].includes(t.country) ||
      REMOTE_RE.test(`${t.destination} ${t.summary}`),
  },
  {
    slug: "cultural-depth",
    title: "Profundidade cultural",
    subtitle: "O lugar faz parte da prática.",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1600&h=1000&q=70",
    matches: (t) =>
      t.activity === "martial-arts" ||
      t.activity === "river-cruise" ||
      CULTURE_RE.test(`${t.destination} ${t.summary}`),
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

export const FEATURED: Featured[] = [
  {
    trip: findTrip("kyrgyzstan-horse-tatosh")!,
    line: "Onde a estepe ainda pertence a quem a atravessa.",
  },
  {
    trip: findTrip("egypt-kite-dragonfly")!,
    line: "Um vento que dura mais do que o seu medo dele.",
  },
  {
    trip: findTrip("maldives-surf-surftribe")!,
    line: "Um oceano que paga em uma moeda que o escritório não aceita.",
  },
  {
    trip: findTrip("alaska-wildlife-geographic")!,
    line: "O silêncio é uma espécie de catedral.",
  },
].filter((f): f is Featured => !!f.trip);

/** Continents & countries (sorted unique). */
export function allContinents(): string[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.continent))).sort();
}

export function allCountries(): string[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.country))).sort();
}

export function allActivities(): TripActivity[] {
  return Array.from(new Set(ALL_TRIPS.map((t) => t.activity))) as TripActivity[];
}

/** Duration buckets. */
export type DurationBucket = "short" | "mid" | "long";
export function durationBucket(t: Trip): DurationBucket {
  const d = durationMinDays(t);
  if (d <= 3) return "short";
  if (d <= 7) return "mid";
  return "long";
}
