import { useEffect, useMemo, useRef, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { select } from "d3-selection";
import "d3-transition";
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import type { Activity } from "@/lib/spots-data";
import Supercluster from "supercluster";
import type { PointFeature } from "supercluster";

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

type PointProps = { pointId: string; label: string; onClick: () => void };

// Map d3-zoom scale k (1..8) to supercluster zoom levels.
function kToScZoom(k: number) {
  return Math.max(0, Math.min(8, Math.round(Math.log2(k) * 2) + 1));
}

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
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
        setTransform({ k: event.transform.k, x: event.transform.x, y: event.transform.y });
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

  // Build supercluster index from points.
  const cluster = useMemo(() => {
    const idx = new Supercluster<PointProps>({
      radius: 50,
      maxZoom: 7,
      minPoints: 2,
    });
    const features: PointFeature<PointProps>[] = points.map((p) => ({
      type: "Feature",
      properties: { pointId: p.id, label: p.label, onClick: p.onClick },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    }));
    idx.load(features);
    return idx;
  }, [points]);

  const scZoom = kToScZoom(transform.k);
  const clusters = useMemo(
    () => cluster.getClusters([-180, -85, 180, 85], scZoom),
    [cluster, scZoom],
  );

  const zoomToLngLat = (lng: number, lat: number, targetK: number) => {
    const svgEl = svgRef.current;
    const behavior = zoomBehaviorRef.current;
    if (!svgEl || !behavior) return;
    const proj = projection([lng, lat]);
    if (!proj) return;
    const k = Math.max(1, Math.min(8, targetK));
    const tx = WIDTH / 2 - proj[0] * k;
    const ty = HEIGHT / 2 - proj[1] * k;
    select(svgEl)
      .transition()
      .duration(500)
      .call(behavior.transform, zoomIdentity.translate(tx, ty).scale(k));
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
            {/* Overlay layer — not zoom-transformed so pins stay constant size. */}
            <g>
              {clusters.map((c) => {
                const [lng, lat] = c.geometry.coordinates;
                const proj = projection([lng, lat]);
                if (!proj) return null;
                const cx = proj[0] * transform.k + transform.x;
                const cy = proj[1] * transform.k + transform.y;
                if (cx < -20 || cx > WIDTH + 20 || cy < -20 || cy > HEIGHT + 20) return null;
                const isCluster = (c.properties as { cluster?: boolean }).cluster === true;
                if (isCluster) {
                  const count = (c.properties as { point_count: number }).point_count;
                  const clusterId = (c.properties as { cluster_id: number }).cluster_id;
                  const r = 12 + Math.min(14, Math.log2(count + 1) * 5);
                  const id = `cluster-${clusterId}`;
                  const hover = hoveredId === id;
                  return (
                    <g
                      key={id}
                      transform={`translate(${cx}, ${cy})`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId((h) => (h === id ? null : h))}
                      onClick={() => {
                        const expZ = cluster.getClusterExpansionZoom(clusterId);
                        const targetK = Math.pow(2, Math.max(0, (expZ - 1) / 2));
                        zoomToLngLat(lng, lat, Math.max(transform.k * 1.8, targetK));
                      }}
                      role="button"
                      aria-label={`Cluster of ${count} spots — zoom in`}
                    >
                      <circle
                        r={r + 4}
                        fill={activeColor}
                        fillOpacity={hover ? 0.25 : 0.15}
                        style={{ transition: "fill-opacity 150ms" }}
                      />
                      <circle r={r} fill={activeColor} />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={600}
                        fill="#fff"
                        style={{ pointerEvents: "none" }}
                      >
                        {count}
                      </text>
                    </g>
                  );
                }
                const props = c.properties as PointProps;
                const id = `pin-${props.pointId}`;
                const hover = hoveredId === id;
                return (
                  <g
                    key={id}
                    transform={`translate(${cx}, ${cy})`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId((h) => (h === id ? null : h))}
                    onClick={() => props.onClick()}
                    role="button"
                    aria-label={props.label}
                  >
                    <circle
                      r={hover ? 10 : 5}
                      fill={activeColor}
                      fillOpacity={0.2}
                      style={{ transition: "r 150ms" }}
                    />
                    <circle r={4} fill={activeColor} stroke="#fff" strokeWidth={1.2} />
                    {hover && (
                      <g transform="translate(0, -14)" style={{ pointerEvents: "none" }}>
                        <rect
                          x={-((props.label.length * 6) / 2) - 6}
                          y={-14}
                          width={props.label.length * 6 + 12}
                          height={18}
                          rx={2}
                          fill="#1a1a1a"
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          y={-5}
                          fontSize={10}
                          fill="#fff"
                        >
                          {props.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
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