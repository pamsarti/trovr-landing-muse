import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ALL_TRIPS,
  FEATURED,
  THEMES,
  ACTIVITY_LABEL,
  allActivities,
  allContinents,
  allCountries,
  durationBucket,
  isInSeason,
  tripImage,
  type DurationBucket,
  type Trip,
  type TripActivity,
} from "@/lib/trips-data";
import {
  TripsHeader,
  TripsFooter,
  TripCard,
  SmallSeasonCard,
} from "@/components/trips/TripsChrome";

export const Route = createFileRoute("/trips/")({
  head: () => ({
    meta: [
      { title: "Trips — Trovr" },
      {
        name: "description",
        content:
          "Curated trips for people who travel to feel. Kite, surf, horseback, wildlife, martial arts.",
      },
    ],
  }),
  component: TripsIndex,
});

function TripsIndex() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" />
      <HeroRotator />
      <SeasonBand />
      <ThemesGrid />
      <AllTripsSection />
      <TripsFooter />
    </main>
  );
}

/* ----- Section 1: hero rotator ----- */

function HeroRotator() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % FEATURED.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {FEATURED.map((f, idx) => (
        <div
          key={f.trip.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          <img
            src={tripImage(f.trip, 1920, 1080)}
            alt={f.trip.destination}
            className="h-full w-full object-cover opacity-80"
            style={{ filter: "saturate(0.75)" }}
          />
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 sm:px-12 sm:pb-24">
            <div className="mx-auto w-full max-w-5xl">
              <p className="text-[10px] uppercase tracking-[0.25em] text-paper/80">
                {f.trip.country} · {f.trip.duration_days} days on{" "}
                {ACTIVITY_LABEL[f.trip.activity].toLowerCase()}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-paper sm:text-6xl">
                {f.trip.destination}
              </h2>
              <p className="mt-4 max-w-2xl font-serif text-lg italic text-paper/90 sm:text-2xl">
                {f.line}
              </p>
              <div className="mt-8 flex justify-end">
                <Link
                  to="/trips/$id"
                  params={{ id: f.trip.id }}
                  className="text-[11px] uppercase tracking-[0.2em] text-paper/90 underline-offset-4 hover:underline"
                >
                  See this trip →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {FEATURED.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className="h-[2px] w-8 transition-colors"
            style={{ background: idx === i ? "#f5f1ec" : "rgba(245,241,236,0.35)" }}
          />
        ))}
      </div>
    </section>
  );
}

/* ----- Section 2: in-season band ----- */

const CURRENT_MONTH = 5; // hardcoded May for now

function SeasonBand() {
  const inSeason = useMemo(
    () => ALL_TRIPS.filter((t) => isInSeason(t, CURRENT_MONTH)).slice(0, 4),
    [],
  );
  if (inSeason.length === 0) return null;
  return (
    <section className="border-b border-stone/15 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Right now is the time for —
        </h2>
        <div className="mt-10 flex gap-6 overflow-x-auto pb-2 sm:gap-8">
          {inSeason.map((t) => (
            <SmallSeasonCard key={t.id} trip={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- Section 3: themes ----- */

function ThemesGrid() {
  return (
    <section className="border-b border-stone/15 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
          Browse by feeling, not by filter.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {THEMES.map((t) => (
            <Link
              key={t.slug}
              to="/trips/theme/$slug"
              params={{ slug: t.slug }}
              className="group relative block aspect-[4/3] overflow-hidden bg-ink"
            >
              <img
                src={t.image}
                alt={t.title}
                loading="lazy"
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-90"
                style={{ filter: "saturate(0.8)" }}
              />
              <div className="absolute inset-0 bg-ink/30" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl leading-tight text-paper sm:text-4xl">
                  {t.title}
                </h3>
                <p className="mt-3 text-sm text-paper/85 sm:text-base">{t.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----- Section 4: all trips grid ----- */

type Filters = {
  activities: Set<TripActivity>;
  continents: Set<string>;
  countries: Set<string>;
  durations: Set<DurationBucket>;
};

function emptyFilters(): Filters {
  return {
    activities: new Set(),
    continents: new Set(),
    countries: new Set(),
    durations: new Set(),
  };
}

function AllTripsSection() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const trips = useMemo(() => {
    return ALL_TRIPS.filter((t) => {
      if (filters.activities.size && !filters.activities.has(t.activity)) return false;
      if (filters.continents.size && !filters.continents.has(t.continent)) return false;
      if (filters.countries.size && !filters.countries.has(t.country)) return false;
      if (filters.durations.size && !filters.durations.has(durationBucket(t))) return false;
      return true;
    });
  }, [filters]);

  const clearAll = () => setFilters(emptyFilters());
  const hasAny =
    filters.activities.size ||
    filters.continents.size ||
    filters.countries.size ||
    filters.durations.size;

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">All trips.</h2>
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink lg:hidden"
          >
            {drawerOpen ? "Hide filters" : "Filters"}
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          <aside
            className={`${drawerOpen ? "block" : "hidden"} lg:block`}
          >
            <FilterGroup
              title="Activity"
              options={allActivities().map((a) => ({ id: a, label: ACTIVITY_LABEL[a] }))}
              selected={filters.activities as Set<string>}
              onToggle={(v) =>
                setFilters((f) => toggle(f, "activities", v as TripActivity))
              }
            />
            <FilterGroup
              title="Continent"
              options={allContinents().map((c) => ({ id: c, label: c }))}
              selected={filters.continents}
              onToggle={(v) => setFilters((f) => toggle(f, "continents", v))}
            />
            <FilterGroup
              title="Country"
              options={allCountries().map((c) => ({ id: c, label: c }))}
              selected={filters.countries}
              onToggle={(v) => setFilters((f) => toggle(f, "countries", v))}
            />
            <FilterGroup
              title="Duration"
              options={[
                { id: "short", label: "Short 1-3 days" },
                { id: "mid", label: "Mid 4-7 days" },
                { id: "long", label: "Long 8+ days" },
              ]}
              selected={filters.durations as Set<string>}
              onToggle={(v) =>
                setFilters((f) => toggle(f, "durations", v as DurationBucket))
              }
            />
            {hasAny ? (
              <button
                onClick={clearAll}
                className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone underline-offset-4 hover:text-ink hover:underline"
              >
                Clear all
              </button>
            ) : null}
          </aside>

          <div>
            {trips.length === 0 ? (
              <p className="font-serif italic text-stone">
                No trips match these filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((t: Trip) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function toggle<K extends keyof Filters>(f: Filters, key: K, value: string): Filters {
  const next = { ...f, [key]: new Set(f[key]) } as Filters;
  const s = next[key] as Set<string>;
  if (s.has(value)) s.delete(value);
  else s.add(value);
  return next;
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mb-8">
      <h4 className="text-[11px] uppercase tracking-[0.2em] text-stone">{title}</h4>
      <ul className="mt-3 space-y-2">
        {options.map((o) => {
          const on = selected.has(o.id);
          return (
            <li key={o.id}>
              <button
                onClick={() => onToggle(o.id)}
                className={`text-left text-sm transition-colors ${
                  on ? "text-ink underline underline-offset-4" : "text-stone hover:text-ink"
                }`}
              >
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}