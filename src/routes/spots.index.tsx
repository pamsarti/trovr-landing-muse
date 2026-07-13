import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ACTIVITIES,
  colorForActivity,
  getSpotsByActivity,
  slugify,
  validateSpotsSearch,
  type Activity,
  type Spot,
} from "@/lib/spots-data";
import { SpotsHeader } from "@/components/spots/SpotsChrome";
import type { MapBounds, MapSpotPoint } from "@/components/spots/SpotsMap";

const SpotsMap = lazy(() =>
  import("@/components/spots/SpotsMap").then((m) => ({ default: m.SpotsMap })),
);

export const Route = createFileRoute("/spots/")({
  validateSearch: validateSpotsSearch,
  head: () => ({
    meta: [
      { title: "Spots — A world atlas of adventure | Trovr" },
      {
        name: "description",
        content:
          "An editorial map of the places worth the journey — wind, waves, mountains, trails.",
      },
      { property: "og:title", content: "Spots — Trovr" },
      {
        property: "og:description",
        content:
          "An editorial map of the places worth the journey — wind, waves, mountains, trails.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SpotsIndex,
});

// ---------- helpers ----------

function hasConditions(s: Spot): boolean {
  const spec = s.conditions.activitySpecific;
  const months = s.conditions.bestMonths;
  return (
    (!!spec && Object.keys(spec).length > 0) ||
    (!!months && months.length > 0)
  );
}

const KEY_LABELS: Record<string, string> = {
  break_type: "Break",
  bottom_type: "Bottom",
  recommended_level: "Level",
  ideal_swell: "Swell",
  ideal_wind: "Wind",
  ideal_tide: "Tide",
  hazards: "Hazards",
  crowds: "Crowds",
  wind_direction: "Wind direction",
  water_type: "Water",
  season: "Season",
  discipline: "Discipline",
  riding_level: "Riding level",
  terrain: "Terrain",
  horse_breed: "Horse breed",
  distance: "Distance",
  elevation: "Elevation",
  difficulty: "Difficulty",
  depth: "Depth",
  visibility: "Visibility",
  current: "Current",
  marine_life: "Marine life",
};

function humanize(k: string) {
  return (
    KEY_LABELS[k] ??
    k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

// ---------- component ----------

function SpotsIndex() {
  const { activity } = Route.useSearch();
  const navigate = useNavigate();

  // Filter: active-status + curated conditions + has coordinates.
  const allSpots = useMemo<Spot[]>(() => {
    return getSpotsByActivity(activity)
      .filter((s) => s.status === "active")
      .filter(hasConditions);
  }, [activity]);

  const spotsWithCoords = useMemo(
    () => allSpots.filter((s) => s.coordinates != null),
    [allSpots],
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyToId, setFlyToId] = useState<string | null>(null);

  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [appliedBounds, setAppliedBounds] = useState<MapBounds | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // "Search in this area": only offer when the map has moved since we
  // last applied its bounds.
  const boundsDiffer =
    !!bounds &&
    (!appliedBounds ||
      Math.abs(bounds.north - appliedBounds.north) > 0.01 ||
      Math.abs(bounds.south - appliedBounds.south) > 0.01 ||
      Math.abs(bounds.east - appliedBounds.east) > 0.01 ||
      Math.abs(bounds.west - appliedBounds.west) > 0.01);

  const inBounds = (s: Spot, b: MapBounds) => {
    if (!s.coordinates) return false;
    const { lat, lng } = s.coordinates;
    const latOk = lat <= b.north && lat >= b.south;
    const lngOk =
      b.west <= b.east
        ? lng >= b.west && lng <= b.east
        : lng >= b.west || lng <= b.east; // dateline wrap
    return latOk && lngOk;
  };

  const listedSpots = useMemo(() => {
    if (!appliedBounds) return allSpots;
    return allSpots.filter((s) => inBounds(s, appliedBounds));
  }, [allSpots, appliedBounds]);

  const points: MapSpotPoint[] = useMemo(
    () =>
      spotsWithCoords.map((s) => ({
        id: s.id,
        lat: s.coordinates!.lat,
        lng: s.coordinates!.lng,
        label: s.name,
        color: colorForActivity(s.activity),
      })),
    [spotsWithCoords],
  );

  const selectedSpot = useMemo(
    () => allSpots.find((s) => s.id === selectedId) ?? null,
    [selectedId, allSpots],
  );

  const openSpot = (id: string) => {
    setSelectedId(id);
    setFlyToId(id);
  };

  // Escape closes the panel.
  useEffect(() => {
    if (!selectedSpot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedSpot]);

  return (
    <div className="bg-paper text-ink">
      <SpotsHeader />

      <div className="flex h-[calc(100dvh-64px)] flex-col sm:h-[calc(100dvh-72px)] lg:flex-row">
        {/* LEFT: list */}
        <aside
          className="w-full border-b border-stone/20 bg-paper lg:h-full lg:w-[400px] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r"
        >
          <div className="px-6 pt-6 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone">
              Atlas
            </p>
            <h1 className="mt-2 font-serif text-2xl leading-tight text-ink">
              Places worth the journey
            </h1>
          </div>

          <div className="border-t border-stone/20 px-6 py-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
              Filter by activity
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAppliedBounds(null);
                  navigate({ to: "/spots", search: {} });
                }}
                className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  !activity
                    ? "border-ink bg-ink text-paper"
                    : "border-stone/40 text-ink hover:border-ink"
                }`}
                style={{ borderRadius: 2 }}
                aria-pressed={!activity}
              >
                All
              </button>
              {ACTIVITIES.filter((a) => a.active).map((a) => {
                const isCurrent = a.id === activity;
                const c = colorForActivity(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setAppliedBounds(null);
                      navigate({
                        to: "/spots",
                        search: isCurrent ? {} : { activity: a.id },
                      });
                    }}
                    className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      isCurrent ? "text-paper" : "border-stone/40 text-ink hover:border-ink"
                    }`}
                    style={{
                      borderRadius: 2,
                      ...(isCurrent ? { backgroundColor: c, borderColor: c } : {}),
                    }}
                    aria-pressed={isCurrent}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-stone/20 px-6 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
              {allSpots.length} spots
              {appliedBounds && (
                <>
                  {" · "}
                  <span className="text-sage">{listedSpots.length} in this area</span>
                </>
              )}
            </p>
          </div>

          <ul className="divide-y divide-stone/20">
            {listedSpots.length === 0 && (
              <li className="px-6 py-10 text-center font-serif italic text-stone">
                No spots here yet.
              </li>
            )}
            {listedSpots.map((s) => (
              <SpotListItem
                key={s.id}
                spot={s}
                hovered={hoveredId === s.id}
                selected={selectedId === s.id}
                onEnter={() => setHoveredId(s.id)}
                onLeave={() =>
                  setHoveredId((h) => (h === s.id ? null : h))
                }
                onClick={() => openSpot(s.id)}
              />
            ))}
          </ul>
        </aside>

        {/* RIGHT: map */}
        <div className="relative min-h-[420px] flex-1">
          <div className="relative h-full w-full">
            {mounted ? (
              <Suspense
                fallback={<div className="h-full w-full bg-paper" />}
              >
                <SpotsMap
                  points={points}
                  hoveredId={hoveredId}
                  activeId={selectedId}
                  flyToId={flyToId}
                  onHover={setHoveredId}
                  onSelect={openSpot}
                  onBoundsChange={setBounds}
                />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-paper" />
            )}

            {boundsDiffer && (
              <button
                type="button"
                onClick={() => setAppliedBounds(bounds)}
                className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 border border-sage bg-sage-bg px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage shadow-sm transition-colors hover:bg-sage hover:text-paper"
                style={{ borderRadius: 2 }}
              >
                Search spots in this area
              </button>
            )}
            {appliedBounds && (
              <button
                type="button"
                onClick={() => setAppliedBounds(null)}
                className="absolute right-4 top-4 z-[1000] border border-stone/40 bg-paper px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink shadow-sm hover:border-ink"
                style={{ borderRadius: 2 }}
              >
                Clear area filter
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedSpot && (
        <DetailPanel spot={selectedSpot} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}

// ---------- list item ----------

function SpotListItem({
  spot,
  hovered,
  selected,
  onEnter,
  onLeave,
  onClick,
}: {
  spot: Spot;
  hovered: boolean;
  selected: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [showMetrics, setShowMetrics] = useState(false);
  const color = colorForActivity(spot.activity);
  const label =
    ACTIVITIES.find((a) => a.id === spot.activity)?.label ?? spot.activity;

  return (
    <li
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`cursor-pointer px-6 py-5 transition-colors focus-within:bg-sage-bg/60 ${
        hovered || selected ? "bg-sage-bg/60" : ""
      }`}
      style={{
        borderLeft: selected ? `3px solid ${color}` : "3px solid transparent",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left focus:outline-none focus-visible:ring-2"
        style={{ outlineColor: color }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone">
          {spot.city}
          {spot.country ? ` · ${spot.country}` : ""}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-ink">
          {spot.name}
        </h3>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onMouseEnter={() => setShowMetrics(true)}
          onMouseLeave={() => setShowMetrics(false)}
          onFocus={() => setShowMetrics(true)}
          onBlur={() => setShowMetrics(false)}
          onClick={onClick}
          className="border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
          style={{
            borderColor: color,
            color: showMetrics ? "var(--paper)" : color,
            background: showMetrics ? color : "transparent",
            borderRadius: 2,
          }}
          aria-label={`${label} conditions`}
        >
          {label}
        </button>
      </div>

      {showMetrics && <MetricsGrid spot={spot} compact />}
    </li>
  );
}

// ---------- metrics ----------

function MetricsGrid({
  spot,
  compact = false,
}: {
  spot: Spot;
  compact?: boolean;
}) {
  const spec = spot.conditions.activitySpecific ?? {};
  const status = spot.conditions.fieldStatus ?? {};
  const months = spot.conditions.bestMonths ?? [];
  const entries = Object.entries(spec).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0,
  );
  if (entries.length === 0 && months.length === 0) return null;

  return (
    <dl
      className={`mt-3 grid gap-x-4 gap-y-2 border-t border-stone/20 pt-3 ${
        compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {months.length > 0 && (
        <div className="col-span-full">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
            Best season
          </dt>
          <dd className="mt-0.5 font-serif text-[15px] text-ink">
            {months.join(" · ")}
          </dd>
        </div>
      )}
      {entries.map(([k, v]) => {
        const isUnverified = status[k] && status[k] !== "verified";
        return (
          <div key={k}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone">
              {humanize(k)}
            </dt>
            <dd className="mt-0.5 font-serif text-[15px] text-ink">
              {v}
              {isUnverified && (
                <span
                  className="ml-1 align-middle font-mono text-[10px] normal-case text-stone"
                  title="Not independently verified"
                >
                  · unconfirmed
                </span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

// ---------- detail panel ----------

function DetailPanel({ spot, onClose }: { spot: Spot; onClose: () => void }) {
  const [mountedIn, setMountedIn] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [expanded, setExpanded] = useState(true);
  const color = colorForActivity(spot.activity);
  const label =
    ACTIVITIES.find((a) => a.id === spot.activity)?.label ?? spot.activity;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMountedIn(true));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 40);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2000]"
      role="dialog"
      aria-modal="true"
      aria-label={`Spot: ${spot.name}`}
    >
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className={`absolute inset-0 cursor-default transition-opacity duration-300 motion-reduce:transition-none ${
          mountedIn ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "rgba(28,26,20,.45)" }}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full flex-col shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:max-w-[520px] ${
          mountedIn ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#f3ecdd", color: "#1c1a14" }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-3 backdrop-blur"
          style={{
            borderColor: "rgba(28,26,20,.16)",
            background: "rgba(243,236,221,.95)",
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: "#6b6350" }}
          >
            Spot detail
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center border transition-colors hover:bg-[#e7ddc9]"
            style={{
              borderColor: "rgba(28,26,20,.3)",
              color: "#1c1a14",
              borderRadius: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-6">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: "#6b6350" }}
          >
            {spot.region} · {spot.city}
          </p>
          <h2
            className="mt-2 font-serif text-4xl leading-[1.05]"
            style={{ color: "#1c1a14" }}
          >
            {spot.name}
          </h2>
          {spot.coordinates && (
            <p
              className="mt-3 font-mono text-[11px] tracking-wider"
              style={{ color: "#6b6350" }}
            >
              {spot.coordinates.lat.toFixed(4)}°,{" "}
              {spot.coordinates.lng.toFixed(4)}°
            </p>
          )}

          {spot.description && (
            <p
              className="mt-6 font-serif text-lg leading-[1.55]"
              style={{ color: "#1c1a14" }}
            >
              {spot.description}
            </p>
          )}

          <section className="mt-8">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "#6b6350" }}
            >
              What to do here
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              onMouseEnter={() => setExpanded(true)}
              className="mt-3 flex w-full items-center justify-between border px-4 py-3 text-left transition-colors"
              style={{
                borderColor: color,
                background: expanded ? color : "transparent",
                color: expanded ? "#f3ecdd" : "#1c1a14",
                borderRadius: 2,
              }}
              aria-expanded={expanded}
            >
              <span className="font-serif text-lg">{label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                {expanded ? "Hide" : "Show"} conditions
              </span>
            </button>
            {expanded && (
              <div className="px-1 pt-1">
                <MetricsGrid spot={spot} />
              </div>
            )}
          </section>

          <div className="mt-10">
            <Link
              to="/spots/$continent/$region/$spot"
              params={{
                continent: slugify(spot.region),
                region: slugify(spot.city),
                spot: slugify(spot.name),
              }}
              search={{ activity: spot.activity }}
              className="inline-flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors"
              style={{
                borderColor: "#1c1a14",
                background: "#1c1a14",
                color: "#f3ecdd",
                borderRadius: 2,
              }}
            >
              View full spot
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
