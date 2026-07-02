import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  CATEGORY_LABEL,
  getArticlesWithLocation,
  type JournalArticle,
} from "@/lib/journal-data";

// Local topology — copied at build-time from `world-atlas` into /public/data.
// No external CDN dependency.
const GEO_URL = "/data/world-110m.json";

export function WorldMap() {
  const articles = getArticlesWithLocation();
  const [active, setActive] = useState<JournalArticle | null>(null);

  // Close the popover on Escape
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden border border-stone/15 bg-paper">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 165 }}
            width={980}
            height={520}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EDE7DC"
                    stroke="#C9BFAE"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#E4DCCA" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {articles.map((a) => {
              const loc = a.location!;
              const isActive = active?.slug === a.slug;
              return (
                <Marker
                  key={a.slug}
                  coordinates={[loc.lng, loc.lat]}
                  onClick={() => setActive(isActive ? null : a)}
                  onMouseEnter={() => setActive(a)}
                  style={{
                    default: { cursor: "pointer" },
                    hover: { cursor: "pointer" },
                    pressed: { cursor: "pointer" },
                  }}
                >
                  <circle
                    r={isActive ? 7 : 5}
                    fill="#1a1a1a"
                    stroke="#F5EFE1"
                    strokeWidth={2}
                  />
                  <circle
                    r={isActive ? 14 : 10}
                    fill="#1a1a1a"
                    fillOpacity={0.12}
                  />
                </Marker>
              );
            })}
          </ComposableMap>

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