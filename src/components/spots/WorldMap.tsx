import { useEffect, useMemo, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import { ACTIVITIES, type Activity } from "@/lib/spots-data";

const GEO_URL = "/data/world-110m.json";
const WIDTH = 980;
const HEIGHT = 520;

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  activity: Activity;
  onClick: () => void;
};

const DEFAULT_COLOR = "#1a1a1a";

function colorFor(activity: Activity): string {
  return ACTIVITIES.find((a) => a.id === activity)?.color ?? DEFAULT_COLOR;
}

export function WorldMap({ points }: { points: MapPoint[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
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
            aria-label="World map with spot locations"
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
              {points.map((pt) => {
                const p = projection([pt.lng, pt.lat]);
                if (!p) return null;
                const isHover = hovered === pt.id;
                const color = colorFor(pt.activity);
                return (
                  <g
                    key={pt.id}
                    transform={`translate(${p[0]}, ${p[1]})`}
                    style={{ cursor: "pointer" }}
                    onClick={pt.onClick}
                    onMouseEnter={() => setHovered(pt.id)}
                    onMouseLeave={() => setHovered((h) => (h === pt.id ? null : h))}
                  >
                    <title>{pt.label}</title>
                    <circle r={isHover ? 12 : 9} fill={color} fillOpacity={0.15} />
                    <circle
                      r={isHover ? 6 : 4.5}
                      fill={color}
                      stroke="#F5EFE1"
                      strokeWidth={1.5}
                      aria-label={pt.label}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}