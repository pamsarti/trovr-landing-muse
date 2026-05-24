import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

export const Route = createFileRoute("/spots")({
  head: () => ({
    meta: [
      { title: "Spots — Trovr" },
      {
        name: "description",
        content:
          "A growing guide to the world's best kitesurf spots. Conditions, seasons, and editorial notes from people who've been there.",
      },
      { property: "og:title", content: "Spots — Trovr" },
      {
        property: "og:description",
        content:
          "A growing guide to the world's best kitesurf spots. Conditions, seasons, and editorial notes from people who've been there.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trovr-landing-muse.lovable.app/spots" },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Spots — Trovr" },
      {
        name: "twitter:description",
        content:
          "A growing guide to the world's best kitesurf spots. Conditions, seasons, and editorial notes from people who've been there.",
      },
      {
        name: "twitter:image",
        content:
          "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    links: [
      { rel: "canonical", href: "https://trovr-landing-muse.lovable.app/spots" },
    ],
  }),
  component: SpotsPage,
});

// ---------- Data ----------

type WaterType = "Flat" | "Chop" | "Waves";
type WaterTemp = "Warm" | "Mild" | "Cold";
type Wetsuit = "Boardshorts" | "Spring" | "Full" | "Thick";
type Region = "Europe" | "Africa" | "South America" | "North America" | "Asia" | "Oceania";
type Level = "First-timer" | "Intermediate" | "Advanced";
type Length = "Weekend" | "Week" | "10+ days" | "Flexible";
type Connectivity = "Connected" | "Patchy" | "Off-grid";
type Vibe = "Social" | "Balanced" | "Solitude";

type Spot = {
  slug: string;
  countrySlug: string;
  name: string;
  country: string;
  region: Region;
  coords: [number, number]; // [lng, lat]
  bestMonths: number[]; // 1-12
  windConsistency: number; // 0-100
  waterTypes: WaterType[];
  waterTemp: WaterTemp;
  wetsuit: Wetsuit;
  levels: Level[];
  lengths: Length[];
  connectivity: Connectivity;
  vibe: Vibe;
  intensity: number; // 1-5
  tagline: string;
  image: string;
};

const SPOTS: Spot[] = [
  {
    slug: "jericoacoara",
    countrySlug: "brazil",
    name: "Jericoacoara",
    country: "Brazil",
    region: "South America",
    coords: [-40.5119, -2.7986],
    bestMonths: [7, 8, 9, 10, 11, 12, 1],
    windConsistency: 95,
    waterTypes: ["Flat", "Waves"],
    waterTemp: "Warm",
    wetsuit: "Boardshorts",
    levels: ["First-timer", "Intermediate", "Advanced"],
    lengths: ["Week", "10+ days"],
    connectivity: "Patchy",
    vibe: "Social",
    intensity: 3,
    tagline: "Where the dunes meet the most reliable wind on earth.",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "atins",
    countrySlug: "brazil",
    name: "Atins",
    country: "Brazil",
    region: "South America",
    coords: [-42.7339, -2.5806],
    bestMonths: [7, 8, 9, 10, 11, 12, 1],
    windConsistency: 88,
    waterTypes: ["Flat"],
    waterTemp: "Warm",
    wetsuit: "Boardshorts",
    levels: ["Intermediate", "Advanced"],
    lengths: ["Week", "10+ days"],
    connectivity: "Off-grid",
    vibe: "Solitude",
    intensity: 4,
    tagline: "Lagoons, river mouths, and downwinders into the wild.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "dakhla",
    countrySlug: "morocco",
    name: "Dakhla",
    country: "Morocco",
    region: "Africa",
    coords: [-15.9579, 23.7081],
    bestMonths: [4, 5, 6, 7, 8, 9],
    windConsistency: 90,
    waterTypes: ["Flat", "Waves"],
    waterTemp: "Mild",
    wetsuit: "Spring",
    levels: ["First-timer", "Intermediate", "Advanced"],
    lengths: ["Week", "10+ days"],
    connectivity: "Patchy",
    vibe: "Balanced",
    intensity: 3,
    tagline: "Forty kilometers of lagoon. Wind from dawn to dusk.",
    image:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "el-gouna",
    countrySlug: "egypt",
    name: "El Gouna",
    country: "Egypt",
    region: "Africa",
    coords: [33.6783, 27.3942],
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    windConsistency: 85,
    waterTypes: ["Flat", "Chop"],
    waterTemp: "Warm",
    wetsuit: "Boardshorts",
    levels: ["First-timer", "Intermediate"],
    lengths: ["Weekend", "Week"],
    connectivity: "Connected",
    vibe: "Social",
    intensity: 2,
    tagline: "Warm water, steady thermals, year-round reliability.",
    image:
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "naxos",
    countrySlug: "greece",
    name: "Naxos",
    country: "Greece",
    region: "Europe",
    coords: [25.3754, 37.1036],
    bestMonths: [6, 7, 8, 9],
    windConsistency: 80,
    waterTypes: ["Chop", "Waves"],
    waterTemp: "Mild",
    wetsuit: "Spring",
    levels: ["Intermediate", "Advanced"],
    lengths: ["Week", "Flexible"],
    connectivity: "Connected",
    vibe: "Balanced",
    intensity: 4,
    tagline: "Meltemi season. Aegean blue. Island hopping by kite.",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "tarifa",
    countrySlug: "spain",
    name: "Tarifa",
    country: "Spain",
    region: "Europe",
    coords: [-5.6065, 36.0143],
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    windConsistency: 82,
    waterTypes: ["Waves", "Chop"],
    waterTemp: "Mild",
    wetsuit: "Full",
    levels: ["Intermediate", "Advanced"],
    lengths: ["Weekend", "Week", "Flexible"],
    connectivity: "Connected",
    vibe: "Social",
    intensity: 4,
    tagline: "The wind capital of Europe. Two oceans, one beach town.",
    image:
      "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=1200&q=70",
  },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const REGIONS: Region[] = [
  "Europe", "Africa", "South America", "North America", "Asia", "Oceania",
];
const LEVELS: Level[] = ["First-timer", "Intermediate", "Advanced"];
const LENGTHS: Length[] = ["Weekend", "Week", "10+ days", "Flexible"];
const CONNECTIVITY: Connectivity[] = ["Connected", "Patchy", "Off-grid"];
const WATER_TYPES: WaterType[] = ["Flat", "Chop", "Waves"];
const WATER_TEMPS: WaterTemp[] = ["Warm", "Mild", "Cold"];
const WETSUITS: Wetsuit[] = ["Boardshorts", "Spring", "Full", "Thick"];

const ACTIVITIES = [
  { id: "kite", label: "Kite", active: true },
  { id: "surf", label: "Surf", active: false },
  { id: "snow", label: "Snow", active: false },
  { id: "climb", label: "Climb", active: false },
  { id: "dive", label: "Dive", active: false },
  { id: "sail", label: "Sail", active: false },
];

// ---------- Filter state ----------

type Filters = {
  activity: string;
  month: number | null;
  region: Region | null;
  level: Level | null;
  length: Length | null;
  intensityMax: number; // 1-5
  vibe: Vibe;
  connectivity: Connectivity | null;
  windMin: number; // 1-5 stars
  waterTypes: WaterType[];
  waterTemp: WaterTemp | null;
  wetsuit: Wetsuit | null;
};

const DEFAULT_FILTERS: Filters = {
  activity: "kite",
  month: null,
  region: null,
  level: null,
  length: null,
  intensityMax: 5,
  vibe: "Balanced",
  connectivity: null,
  windMin: 1,
  waterTypes: [],
  waterTemp: null,
  wetsuit: null,
};

function countActive(f: Filters): number {
  let n = 0;
  if (f.month !== null) n++;
  if (f.region) n++;
  if (f.level) n++;
  if (f.length) n++;
  if (f.intensityMax < 5) n++;
  if (f.vibe !== "Balanced") n++;
  if (f.connectivity) n++;
  if (f.windMin > 1) n++;
  if (f.waterTypes.length) n++;
  if (f.waterTemp) n++;
  if (f.wetsuit) n++;
  return n;
}

function windStars(pct: number): number {
  // map 60-100% to 1-5
  return Math.max(1, Math.min(5, Math.round((pct - 55) / 9)));
}

function applyFilters(spots: Spot[], f: Filters): Spot[] {
  return spots.filter((s) => {
    if (f.month !== null && !s.bestMonths.includes(f.month)) return false;
    if (f.region && s.region !== f.region) return false;
    if (f.level && !s.levels.includes(f.level)) return false;
    if (f.length && !s.lengths.includes(f.length)) return false;
    if (s.intensity > f.intensityMax) return false;
    if (f.vibe !== "Balanced" && s.vibe !== "Balanced" && s.vibe !== f.vibe) return false;
    if (f.connectivity && s.connectivity !== f.connectivity) return false;
    if (windStars(s.windConsistency) < f.windMin) return false;
    if (f.waterTypes.length && !f.waterTypes.some((w) => s.waterTypes.includes(w))) return false;
    if (f.waterTemp && s.waterTemp !== f.waterTemp) return false;
    if (f.wetsuit && s.wetsuit !== f.wetsuit) return false;
    return true;
  });
}

// ---------- Page ----------

function SpotsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visible = useMemo(() => applyFilters(SPOTS, filters), [filters]);
  const visibleSlugs = useMemo(() => new Set(visible.map((s) => s.slug)), [visible]);

  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <PageHeader />
      <MapSection
        spots={SPOTS}
        visibleSlugs={visibleSlugs}
        highlighted={highlighted}
        setHighlighted={setHighlighted}
      />
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onOpenDrawer={() => setDrawerOpen(true)}
        resultCount={visible.length}
      />
      <SpotGrid spots={visible} highlighted={highlighted} />
      <Footer />
      {drawerOpen && (
        <MobileFilterDrawer
          filters={filters}
          setFilters={setFilters}
          onClose={() => setDrawerOpen(false)}
          resultCount={visible.length}
        />
      )}
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-stone/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">
          trovr
        </Link>
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-stone">
          <Link to="/" className="transition-colors hover:text-ink">Home</Link>
          <Link to="/about" className="transition-colors hover:text-ink">About</Link>
          <Link to="/spots" className="text-ink">Spots</Link>
        </nav>
      </div>
    </header>
  );
}

function PageHeader() {
  return (
    <section className="px-6 py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
          Where the wind takes you.
        </h1>
        <p className="mt-6 text-base leading-[1.6] text-stone sm:text-lg">
          A growing guide to the world's best spots. Kitesurf first. More to come.
        </p>
      </div>
    </section>
  );
}

// ---------- Map ----------

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function MapSection({
  spots,
  visibleSlugs,
  highlighted,
  setHighlighted,
}: {
  spots: Spot[];
  visibleSlugs: Set<string>;
  highlighted: string | null;
  setHighlighted: (s: string | null) => void;
}) {
  const [hovered, setHovered] = useState<Spot | null>(null);

  const onPin = (slug: string) => {
    setHighlighted(slug);
    const el = document.getElementById(`spot-${slug}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="border-t border-stone/15 px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="relative">
          <ComposableMap
            projectionConfig={{ scale: 155 }}
            width={980}
            height={460}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "#e7e2da", stroke: "#d6d0c5", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "#e7e2da", outline: "none" },
                      pressed: { fill: "#e7e2da", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {spots.map((s) => {
              const active = visibleSlugs.has(s.slug);
              const isOn = highlighted === s.slug || hovered?.slug === s.slug;
              return (
                <Marker
                  key={s.slug}
                  coordinates={s.coords}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onPin(s.slug)}
                  style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: { cursor: "pointer" } }}
                >
                  <circle
                    r={isOn ? 6 : 4}
                    fill={active ? "#1a1a1a" : "#8b8478"}
                    opacity={active ? 1 : 0.45}
                  />
                  {isOn && (
                    <g transform="translate(0,-12)">
                      <rect
                        x={-(s.name.length * 3.2 + 8)}
                        y={-14}
                        width={s.name.length * 6.4 + 16}
                        height={18}
                        fill="#1a1a1a"
                        rx={2}
                      />
                      <text
                        textAnchor="middle"
                        y={-2}
                        style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fill: "#f5f1ec" }}
                      >
                        {s.name}
                      </text>
                    </g>
                  )}
                </Marker>
              );
            })}
          </ComposableMap>
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-stone">
          More spots added regularly. {SPOTS.length} live now.
        </p>
      </div>
    </section>
  );
}

// ---------- Filter bar ----------

function FilterBar({
  filters,
  setFilters,
  onOpenDrawer,
  resultCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onOpenDrawer: () => void;
  resultCount: number;
}) {
  const active = countActive(filters);

  return (
    <section className="border-t border-stone/15 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Mobile */}
        <div className="flex items-center justify-between md:hidden">
          <button
            onClick={onOpenDrawer}
            className="border border-ink bg-transparent px-5 py-2.5 text-sm tracking-wide text-ink"
            style={{ borderRadius: 2 }}
          >
            Filters {active > 0 ? `(${active})` : ""}
          </button>
          <span className="text-xs uppercase tracking-[0.2em] text-stone">
            {resultCount} spots
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <FilterGroups filters={filters} setFilters={setFilters} />
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-stone">
              {resultCount} spots · {active} filter{active === 1 ? "" : "s"} active
            </span>
            {active > 0 && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs uppercase tracking-[0.2em] text-stone underline underline-offset-4 hover:text-ink"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroups({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setFilters({ ...filters, [k]: v });

  return (
    <div className="space-y-8">
      <FilterGroup title="Basics">
        <Field label="Activity">
          <select
            value={filters.activity}
            onChange={(e) => set("activity", e.target.value)}
            className={selectCls}
            style={{ borderRadius: 2 }}
          >
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id} disabled={!a.active}>
                {a.label}{!a.active ? " — coming soon" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="When">
          <select
            value={filters.month ?? ""}
            onChange={(e) => set("month", e.target.value === "" ? null : Number(e.target.value))}
            className={selectCls}
            style={{ borderRadius: 2 }}
          >
            <option value="">Any month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </Field>
        <Field label="Region">
          <select
            value={filters.region ?? ""}
            onChange={(e) => set("region", (e.target.value || null) as Region | null)}
            className={selectCls}
            style={{ borderRadius: 2 }}
          >
            <option value="">Anywhere</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Level">
          <select
            value={filters.level ?? ""}
            onChange={(e) => set("level", (e.target.value || null) as Level | null)}
            className={selectCls}
            style={{ borderRadius: 2 }}
          >
            <option value="">Any level</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Trip length">
          <select
            value={filters.length ?? ""}
            onChange={(e) => set("length", (e.target.value || null) as Length | null)}
            className={selectCls}
            style={{ borderRadius: 2 }}
          >
            <option value="">Any length</option>
            {LENGTHS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
      </FilterGroup>

      <FilterGroup title="Experience">
        <Field label={`Intensity · ${intensityLabel(filters.intensityMax)}`}>
          <input
            type="range"
            min={1}
            max={5}
            value={filters.intensityMax}
            onChange={(e) => set("intensityMax", Number(e.target.value))}
            className="w-full accent-ink"
          />
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone">
            <span>Chill</span><span>Full send</span>
          </div>
        </Field>
        <Field label="Vibe">
          <div className="flex border border-stone/40" style={{ borderRadius: 2 }}>
            {(["Social", "Balanced", "Solitude"] as Vibe[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set("vibe", v)}
                className={`flex-1 px-2 py-2 text-xs tracking-wide transition-colors ${
                  filters.vibe === v ? "bg-ink text-paper" : "text-stone hover:text-ink"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Connectivity">
          <div className="flex border border-stone/40" style={{ borderRadius: 2 }}>
            {CONNECTIVITY.map((c) => {
              const on = filters.connectivity === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("connectivity", on ? null : c)}
                  className={`flex-1 px-2 py-2 text-xs tracking-wide transition-colors ${
                    on ? "bg-ink text-paper" : "text-stone hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Field>
      </FilterGroup>

      {filters.activity === "kite" && (
        <FilterGroup title="Kite-specific">
          <Field label={`Wind consistency · ${filters.windMin}+ / 5`}>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set("windMin", n)}
                  className={`h-8 flex-1 border text-xs transition-colors ${
                    n <= filters.windMin
                      ? "border-ink bg-ink text-paper"
                      : "border-stone/40 text-stone hover:border-ink hover:text-ink"
                  }`}
                  style={{ borderRadius: 2 }}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Water type">
            <div className="flex flex-wrap gap-2">
              {WATER_TYPES.map((w) => {
                const on = filters.waterTypes.includes(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() =>
                      set(
                        "waterTypes",
                        on
                          ? filters.waterTypes.filter((x) => x !== w)
                          : [...filters.waterTypes, w],
                      )
                    }
                    className={`border px-3 py-1.5 text-xs tracking-wide transition-colors ${
                      on ? "border-ink bg-ink text-paper" : "border-stone/40 text-stone hover:border-ink hover:text-ink"
                    }`}
                    style={{ borderRadius: 2 }}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Water temp">
            <select
              value={filters.waterTemp ?? ""}
              onChange={(e) => set("waterTemp", (e.target.value || null) as WaterTemp | null)}
              className={selectCls}
              style={{ borderRadius: 2 }}
            >
              <option value="">Any temp</option>
              {WATER_TEMPS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Wetsuit">
            <select
              value={filters.wetsuit ?? ""}
              onChange={(e) => set("wetsuit", (e.target.value || null) as Wetsuit | null)}
              className={selectCls}
              style={{ borderRadius: 2 }}
            >
              <option value="">Any</option>
              {WETSUITS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
        </FilterGroup>
      )}
    </div>
  );
}

const selectCls =
  "w-full appearance-none border border-stone/40 bg-transparent px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";

function intensityLabel(n: number): string {
  return ["Chill", "Easy", "Moderate", "Spicy", "Full send"][n - 1] ?? "";
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-stone">{title}</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-stone">{label}</span>
      {children}
    </label>
  );
}

function MobileFilterDrawer({
  filters,
  setFilters,
  onClose,
  resultCount,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose: () => void;
  resultCount: number;
}) {
  const active = countActive(filters);
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper">
      <div className="flex items-center justify-between border-b border-stone/20 px-6 py-5">
        <span className="font-serif text-2xl text-ink">Filters</span>
        <button
          onClick={onClose}
          className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <FilterGroups filters={filters} setFilters={setFilters} />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-stone/20 px-6 py-5">
        {active > 0 ? (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-xs uppercase tracking-[0.2em] text-stone underline underline-offset-4"
          >
            Clear all
          </button>
        ) : <span />}
        <button
          onClick={onClose}
          className="border border-ink bg-ink px-6 py-3 text-sm tracking-wide text-paper"
          style={{ borderRadius: 2 }}
        >
          Show {resultCount} spots
        </button>
      </div>
    </div>
  );
}

// ---------- Grid ----------

function SpotGrid({ spots, highlighted }: { spots: Spot[]; highlighted: string | null }) {
  return (
    <section className="border-t border-stone/15 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {spots.length === 0 ? (
          <p className="py-20 text-center font-serif text-xl italic text-stone">
            Nothing matches yet. Loosen a filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {spots.map((s) => (
              <SpotCard key={s.slug} spot={s} highlighted={highlighted === s.slug} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SpotCard({ spot, highlighted }: { spot: Spot; highlighted: boolean }) {
  const months = monthRangeLabel(spot.bestMonths);
  return (
    <Link
      id={`spot-${spot.slug}`}
      to="/spots/$country/$spot"
      params={{ country: spot.countrySlug, spot: spot.slug }}
      className={`group block border bg-paper transition-colors ${
        highlighted ? "border-ink" : "border-transparent hover:border-ink"
      }`}
      style={{ borderRadius: 2 }}
    >
      <div className="aspect-[16/9] overflow-hidden bg-stone/10" style={{ borderRadius: 2 }}>
        <img
          src={spot.image}
          alt={`${spot.name}, ${spot.country}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-1 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-2xl leading-tight text-ink">{spot.name}</h3>
          <span className="text-[11px] uppercase tracking-[0.18em] text-stone">{spot.country}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-stone">
          <span>{months}</span>
          <span>·</span>
          <span>Wind {spot.windConsistency}%</span>
          <span>·</span>
          <span>{spot.waterTypes.join(" / ")}</span>
        </div>
        <p className="mt-4 font-serif text-base italic leading-snug text-ink/90">
          {spot.tagline}
        </p>
      </div>
    </Link>
  );
}

function monthRangeLabel(months: number[]): string {
  if (months.length === 0) return "";
  // simple: show first and last (handles wraparound poorly but ok for seeds)
  const sorted = [...months].sort((a, b) => a - b);
  const isContiguous =
    sorted.every((m, i) => i === 0 || m - sorted[i - 1] === 1) ||
    // wrap (e.g. Jul..Jan)
    detectWrap(sorted);
  if (isContiguous && months.length > 1) {
    const first = months[0];
    const last = months[months.length - 1];
    return `${MONTHS[first - 1]}–${MONTHS[last - 1]}`;
  }
  return months.map((m) => MONTHS[m - 1]).join(", ");
}

function detectWrap(sorted: number[]): boolean {
  // detect like [1,7,8,9,10,11,12] meaning Jul..Jan
  return sorted[0] === 1 && sorted[sorted.length - 1] === 12;
}

function Footer() {
  return (
    <footer className="border-t border-stone/20 px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Link to="/" className="font-serif text-5xl lowercase text-ink sm:text-6xl">
          trovr
        </Link>
        <p className="font-serif text-base italic text-stone sm:text-lg">
          Travel to find, not to escape.
        </p>
        <p className="text-xs tracking-wide text-stone">© 2026 · hello@trovr.agency</p>
      </div>
    </footer>
  );
}