import { useEffect, useMemo, useRef, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { select } from "d3-selection";
import "d3-transition";
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import type { Activity } from "@/lib/spots-data";

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

const DEFAULT_PIN_COLOR = "#1a1a1a";

export function WorldMap({
  points = [],
  activeColor = DEFAULT_PIN_COLOR,
}: {
  points?: MapPoint[];
  /** Color applied to every pin (drives the active-sport tint). */
  activeColor?: string;
}) {
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomLayerRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

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

  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(170)
        .translate([WIDTH / 2, HEIGHT / 2]),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const gEl = zoomLayerRef.current;
    if (!svgEl || !gEl) return;
    const svgSel = select(svgEl);
    const gSel = select(gEl);
    const behavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .on("zoom", (event) => {
        gSel.attr("transform", event.transform.toString());
      });
    zoomBehaviorRef.current = behavior;
    svgSel.call(behavior);
    return () => {
      svgSel.on(".zoom", null);
    };
  }, []);

  const zoomBy = (factor: number) => {
    const svgEl = svgRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!svgEl || !behavior) return;
    select(svgEl).transition().duration(250).call(behavior.scaleBy, factor);
  };
  const resetZoom = () => {
    const svgEl = svgRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!svgEl || !behavior) return;
    select(svgEl).transition().duration(300).call(behavior.transform, zoomIdentity);
  };

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden border border-stone/15 bg-paper">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "auto", display: "block", cursor: "grab", touchAction: "none" }}
            role="img"
            aria-label="World map with spot locations"
          >
            <g ref={zoomLayerRef}>
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
            </g>
          </svg>
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => zoomBy(1.6)}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center border border-stone/25 bg-paper/90 text-ink hover:bg-paper"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1 / 1.6)}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center border border-stone/25 bg-paper/90 text-ink hover:bg-paper"
            >
              −
            </button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="flex h-8 w-8 items-center justify-center border border-stone/25 bg-paper/90 text-[10px] uppercase tracking-wider text-ink hover:bg-paper"
            >
              ⤾
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}