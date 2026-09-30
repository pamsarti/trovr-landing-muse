import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ACTIVITIES,
  colorForActivity,
  getSpotsByActivity,
  placeLabel,
  slugify,
  validateSpotsSearch,
  type Activity,
  type Spot,
} from "@/lib/spots-data";
import { SpotsHeader } from "@/components/spots/SpotsChrome";
import { useT } from "@/i18n/useT";
import type { MapBounds, MapSpotPoint } from "@/components/spots/SpotsMap";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const SpotsMap = lazy(() =>
  import("@/components/spots/SpotsMap").then((m) => ({ default: m.SpotsMap })),
);

export const Route = createFileRoute("/spots/")({
  validateSearch: validateSpotsSearch,
  head: () => ({
    meta: [
      { title: "Lugares fora do óbvio pelo mundo | Trovr" },
      {
        name: "description",
        content:
          "Explore no mapa da Trovr lugares fora do óbvio por esporte, região e época do ano, com contexto local e informações práticas.",
      },
      { property: "og:title", content: "Lugares fora do óbvio pelo mundo | Trovr" },
      {
        property: "og:description",
        content:
          "Explore lugares por esporte, região e época do ano e descubra o que torna cada viagem especial.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/spots` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lugares fora do óbvio pelo mundo | Trovr" },
      {
        name: "twitter:description",
        content:
          "Explore lugares fora do óbvio, melhores épocas, esportes e cultura local no mapa da Trovr.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/spots` }],
  }),
  component: SpotsIndex,
});

// ---------- helpers ----------

function hasConditions(s: Spot): boolean {
  const spec = s.conditions.activitySpecific;
  const months = s.conditions.bestMonths;
  return (!!spec && Object.keys(spec).length > 0) || (!!months && months.length > 0);
}

const KEY_LABELS: Record<string, string> = {
  break_type: "Tipo de onda",
  bottom_type: "Fundo",
  recommended_level: "Nível",
  ideal_swell: "Ondulação ideal",
  ideal_wind: "Vento ideal",
  ideal_tide: "Maré ideal",
  hazards: "Riscos",
  crowds: "Lotação",
  wind_direction: "Direção do vento",
  water_type: "Tipo de água",
  season: "Temporada",
  discipline: "Modalidade",
  riding_level: "Nível de equitação",
  terrain: "Terreno",
  horse_breed: "Raça do cavalo",
  distance: "Distância",
  elevation: "Elevação",
  difficulty: "Dificuldade",
  depth: "Profundidade",
  visibility: "Visibilidade",
  current: "Correnteza",
  marine_life: "Vida marinha",
};

function humanize(k: string) {
  return KEY_LABELS[k] ?? k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
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

  const spotsWithCoords = useMemo(() => allSpots.filter((s) => s.coordinates != null), [allSpots]);

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
      b.west <= b.east ? lng >= b.west && lng <= b.east : lng >= b.west || lng <= b.east; // dateline wrap
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

      {/* Full-bleed map: the map is the page; controls float over it. */}
      <div className="relative h-[calc(100dvh-64px)] w-full sm:h-[calc(100dvh-72px)]">
        {mounted ? (
          <Suspense fallback={<div className="h-full w-full bg-paper" />}>
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

        {/* Floating chrome: title + activity filters, top-left over the map. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-4 sm:p-6">
          <div className="trovr-glass trovr-map-glass pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-2xl p-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone">
                Atlas · {allSpots.length} lugares
                {appliedBounds && (
                  <>
                    {" · "}
                    <span className="text-sage">{listedSpots.length} nesta área</span>
                  </>
                )}
              </p>
              <h1 className="mt-1.5 font-serif text-xl leading-tight text-ink sm:text-2xl">
                Lugares com uma razão verdadeira para ir
              </h1>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setAppliedBounds(null);
                  navigate({ to: "/spots", search: {} });
                }}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  !activity
                    ? "border-ink bg-ink text-paper"
                    : "border-stone/40 text-ink hover:border-ink"
                }`}
                aria-pressed={!activity}
              >
                Todos
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
                    className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                      isCurrent ? "text-paper" : "border-stone/40 text-ink hover:border-ink"
                    }`}
                    style={{
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
        </div>

        {boundsDiffer && (
          <button
            type="button"
            onClick={() => setAppliedBounds(bounds)}
            className="trovr-glass trovr-map-glass absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-sage transition-colors hover:bg-sage hover:text-paper"
          >
            Buscar lugares nesta área
          </button>
        )}
        {appliedBounds && (
          <button
            type="button"
            onClick={() => setAppliedBounds(null)}
            className="trovr-glass trovr-map-glass absolute right-4 top-4 z-[1000] rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:border-ink"
          >
            Limpar filtro de área
          </button>
        )}
      </div>

      {selectedSpot && <DetailPanel spot={selectedSpot} onClose={() => setSelectedId(null)} />}
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
  const label = ACTIVITIES.find((a) => a.id === spot.activity)?.label ?? spot.activity;

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
          {placeLabel(spot.city)}
          {spot.country ? ` · ${placeLabel(spot.country)}` : ""}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl leading-tight text-ink">{spot.name}</h3>
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
          aria-label={`Condições para ${label}`}
        >
          {label}
        </button>
      </div>

      {showMetrics && <MetricsGrid spot={spot} compact />}
    </li>
  );
}

// ---------- metrics ----------

function MetricsGrid({ spot, compact = false }: { spot: Spot; compact?: boolean }) {
  const t = useT();
  const spec = spot.conditions.activitySpecific ?? {};
  const status = spot.conditions.fieldStatus ?? {};
  const months = spot.conditions.bestMonths ?? [];
  const entries = Object.entries(spec).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0,
  );
  if (entries.length === 0 && months.length === 0) return null;
  const hasSourceClaims = entries.some(([key]) => status[key] === "source_claims");
  const hasEstimates = entries.some(([key]) => status[key] === "estimate");

  return (
    <>
      <dl
        className={`mt-3 grid gap-x-4 gap-y-2 border-t border-stone/20 pt-3 ${
          compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {months.length > 0 && (
          <div className="col-span-full">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
              Melhor época
            </dt>
            <dd className="mt-0.5 font-serif text-[15px] text-ink">{months.join(" · ")}</dd>
          </div>
        )}
        {entries.map(([k, v]) => {
          const fieldStatus = status[k];
          const marker =
            fieldStatus === "source_claims" ? "1" : fieldStatus === "estimate" ? "2" : null;
          const statusLabel = fieldStatus
            ? (t.spotStatus as Record<string, string>)[fieldStatus]
            : null;
          return (
            <div key={k}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
                {(t.spotFieldsShort as Record<string, string>)[k] ??
                  (t.spotFields as Record<string, string>)[k] ??
                  humanize(k)}
              </dt>
              <dd className="mt-0.5 font-serif text-[15px] text-ink">
                {v}
                {marker && (
                  <sup
                    className="ml-0.5 font-mono text-[9px] text-stone"
                    title={statusLabel ?? undefined}
                    aria-label={statusLabel ?? undefined}
                  >
                    {marker}
                  </sup>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
      {(hasSourceClaims || hasEstimates) && (
        <p className="mt-3 font-mono text-[10px] leading-4 text-mid">
          {hasSourceClaims && <>1 {t.spotStatus.source_claims}. </>}
          {hasEstimates && <>2 {t.spotStatus.estimate}. </>}
          {t.spotStatusNote}
        </p>
      )}
    </>
  );
}

// ---------- detail panel ----------

function DetailPanel({ spot, onClose }: { spot: Spot; onClose: () => void }) {
  const [mountedIn, setMountedIn] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [expanded, setExpanded] = useState(true);
  const color = colorForActivity(spot.activity);
  const label = ACTIVITIES.find((a) => a.id === spot.activity)?.label ?? spot.activity;

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
      aria-label={`Lugar: ${spot.name}`}
    >
      <button
        type="button"
        aria-label="Fechar painel"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-ink/50 transition-opacity duration-300 motion-reduce:transition-none ${
          mountedIn ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full flex-col border-l border-white/40 bg-paper/88 text-ink shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:max-w-[520px] ${
          mountedIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone/20 bg-paper/95 px-5 py-3 backdrop-blur">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone">
            Detalhes do lugar
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center border border-stone/40 text-ink transition-colors hover:border-ink hover:bg-sage-bg/60"
            style={{ borderRadius: 2 }}
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
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
            {placeLabel(spot.region)} · {placeLabel(spot.city)}
          </p>
          <h2 className="mt-2 font-serif text-4xl leading-[1.05] text-ink">{spot.name}</h2>
          {spot.coordinates && (
            <p className="mt-3 font-mono text-[11px] tracking-wider text-stone">
              {spot.coordinates.lat.toFixed(4)}°, {spot.coordinates.lng.toFixed(4)}°
            </p>
          )}

          {spot.description && (
            <p className="mt-6 font-serif text-lg leading-[1.55] text-ink">{spot.description}</p>
          )}

          <section className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone">
              O que fazer aqui
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              onMouseEnter={() => setExpanded(true)}
              className="mt-3 flex w-full items-center justify-between border px-4 py-3 text-left transition-colors"
              style={{
                borderColor: color,
                background: expanded ? color : "transparent",
                color: expanded ? "var(--paper)" : "var(--ink)",
                borderRadius: 2,
              }}
              aria-expanded={expanded}
            >
              <span className="font-serif text-lg">{label}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                {expanded ? "Ocultar" : "Mostrar"} condições
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
              className="inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper transition-colors hover:bg-sage hover:border-sage"
              style={{ borderRadius: 2 }}
            >
              Ver lugar completo
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
