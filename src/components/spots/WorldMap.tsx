import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import {
  CATEGORY_LABEL,
  getArticlesWithLocation,
  type JournalArticle,
} from "@/lib/journal-data";

const GEO_URL = "/data/world-110m.json";
const WIDTH = 980;
const HEIGHT = 520;

export function WorldMap() {
  const articles = getArticlesWithLocation();
  const [active, setActive] = useState<JournalArticle | null>(null);
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GEO_URL)
      .then((r) => r.json() as Promise<Topology>)
      .then((topo) => {
        if (cancelled) return;
        const obj = topo.objects.countries as GeometryCollection;
        const fc = feature(topo, obj) as unknown as FeatureCollection<Geometry>;
        setGeo(fc);
      })
      .catch((e) => console.error("[WorldMap] topology load failed", e));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(170)
        .translate([WIDTH / 2, HEIGHT / 2]),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden border border-stone/15 bg-paper">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block" }}
            role="img"
            aria-label="World map with journal locations"
          >
            <g>
              {geo?.features.map((f, i) => {
                const d = path(f);
                if (!d) return null;
                return (
                  <path
                    key={i}
                    d={d}
                    fill="#EDE7DC"
                    stroke="#C9BFAE"
                    strokeWidth={0.4}
                  />
                );
              })}
            </g>
            <g>
              {articles.map((a) => {
                const loc = a.location!;
                const p = projection([loc.lng, loc.lat]);
                if (!p) return null;
                const isActive = active?.slug === a.slug;
                return (
                  <g
                    key={a.slug}
                    transform={`translate(${p[0]}, ${p[1]})`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActive(isActive ? null : a)}
                    onMouseEnter={() => setActive(a)}
                  >
                    <circle
                      r={isActive ? 14 : 10}
                      fill="#1a1a1a"
                      fillOpacity={0.12}
                    />
                    <circle
                      r={isActive ? 7 : 5}
                      fill="#1a1a1a"
                      stroke="#F5EFE1"
                      strokeWidth={2}
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {active && (
            <div
              className="pointer-events-auto absolute left-4 top-4 max-w-xs border border-stone/20 bg-paper p-4 shadow-lg sm:left-6 sm:top-6"
              onMouseLeave={() => setActive(null)}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-2 top-2 text-stone hover:text-ink"
              >
                ×
              </button>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone">
                {CATEGORY_LABEL[active.category]} · {active.location!.name}
              </p>
              <h3 className="mt-2 font-serif text-lg leading-tight text-ink">
                {active.title}
              </h3>
              <p className="mt-2 font-serif text-sm italic text-stone line-clamp-3">
                {active.dek}
              </p>
              <Link
                to="/journal/$slug"
                params={{ slug: active.slug }}
                className="mt-3 inline-block text-[11px] uppercase tracking-[0.2em] text-ink underline underline-offset-4"
              >
                Read the journal
              </Link>
            </div>
          )}
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-stone">
          {articles.map((a) => (
            <li key={a.slug}>
              <button
                type="button"
                onClick={() => setActive(a)}
                className={`transition-colors hover:text-ink ${
                  active?.slug === a.slug ? "text-ink" : ""
                }`}
              >
                · {a.location!.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}