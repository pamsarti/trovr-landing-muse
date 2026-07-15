import { useCallback, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type MapSpotPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  color: string;
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

const LAND = "#f4f1ec"; // paper
const WATER = "#dfe7df"; // sage-tinted water
const SAGE = "#5a6e5c";
const STONE = "#8c857d";

/**
 * Vector style painted in the Trovr palette. Vector rather than raster: a
 * raster basemap can only be dimmed, never recolored to the brand.
 *
 * Two sources are required. CARTO ships no landmass layer — its `landcover`
 * covers forest and ice only — so land comes from the demotiles `countries`
 * polygons. Without them the open ocean takes the land fill and the
 * continents disappear.
 */
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    world: {
      type: "vector",
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
    },
    carto: {
      type: "vector",
      url: "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json",
    },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": WATER } },
    {
      id: "land",
      type: "fill",
      source: "world",
      "source-layer": "countries",
      paint: { "fill-color": LAND, "fill-antialias": true },
    },
    {
      id: "coast",
      type: "line",
      source: "world",
      "source-layer": "countries",
      paint: { "line-color": SAGE, "line-width": 0.5, "line-opacity": 0.5 },
    },
    {
      id: "landcover",
      type: "fill",
      source: "carto",
      "source-layer": "landcover",
      paint: { "fill-color": "#eaf0ea", "fill-opacity": 0.5 },
    },
    {
      id: "water",
      type: "fill",
      source: "carto",
      "source-layer": "water",
      paint: { "fill-color": WATER },
    },
    {
      id: "boundary",
      type: "line",
      source: "carto",
      "source-layer": "boundary",
      filter: ["<=", ["get", "admin_level"], 2],
      paint: { "line-color": SAGE, "line-width": 0.6, "line-opacity": 0.35 },
    },
    {
      id: "place-label",
      type: "symbol",
      source: "carto",
      "source-layer": "place",
      // Countries only until you zoom in — the spot is the subject here, not
      // the street atlas. Cities fade in past z5, once you are looking closely.
      filter: [
        "any",
        ["==", ["get", "class"], "country"],
        ["all", ["==", ["get", "class"], "city"], [">=", ["zoom"], 5]],
      ],
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 2, 8.5, 6, 11],
        "text-transform": "uppercase",
        "text-letter-spacing": 0.2,
      },
      paint: {
        "text-color": STONE,
        "text-opacity": 0.65,
        "text-halo-color": LAND,
        "text-halo-width": 1.2,
      },
    },
  ],
};

const TOUR_START_DELAY = 2500;
const TOUR_STEP_MS = 6000;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function createPin(point: MapSpotPoint, index: number) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "trovr-pin";
  el.title = point.label;
  el.setAttribute("aria-label", point.label);
  // Stagger the pulse so the pins breathe out of sync.
  el.style.setProperty("--pin-delay", `${((index * 0.37) % 3).toFixed(2)}s`);
  el.style.setProperty("--pin-color", point.color);
  el.innerHTML =
    '<span class="trovr-pin__pulse" aria-hidden="true"></span>' +
    '<span class="trovr-pin__dot" aria-hidden="true"></span>' +
    '<span class="trovr-pin__label"></span>';
  const label = el.querySelector(".trovr-pin__label");
  if (label) label.textContent = point.label;
  return el;
}

export function SpotsMap({
  points,
  hoveredId,
  activeId,
  flyToId,
  onHover,
  onSelect,
  onBoundsChange,
}: {
  points: MapSpotPoint[];
  hoveredId: string | null;
  activeId: string | null;
  flyToId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onBoundsChange: (b: MapBounds) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const tourTimerRef = useRef<number | null>(null);
  const tourIndexRef = useRef(0);
  const pointsRef = useRef(points);
  pointsRef.current = points;

  // Callbacks live in refs so the init effect never re-runs on re-render.
  const onBoundsRef = useRef(onBoundsChange);
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  onBoundsRef.current = onBoundsChange;
  onSelectRef.current = onSelect;
  onHoverRef.current = onHover;

  const [touring, setTouring] = useState(false);
  const [tourLabel, setTourLabel] = useState<string | null>(null);

  const stopTour = useCallback(() => {
    if (tourTimerRef.current) {
      window.clearTimeout(tourTimerRef.current);
      tourTimerRef.current = null;
    }
    setTouring(false);
  }, []);

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [10, 20],
      zoom: 2,
      minZoom: 1.4,
      maxZoom: 9,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: { compact: true },
    });
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    mapRef.current = map;

    const emit = () => {
      const b = map.getBounds();
      onBoundsRef.current({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
    };
    map.on("moveend", emit);
    map.once("load", emit);

    // Any deliberate interaction hands control back to the visitor.
    const pause = () => stopTour();
    map.on("mousedown", pause);
    map.on("touchstart", pause);
    map.on("wheel", pause);
    map.on("dragstart", pause);

    if (!prefersReducedMotion()) setTouring(true);

    return () => {
      if (tourTimerRef.current) window.clearTimeout(tourTimerRef.current);
      map.off("moveend", emit);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [stopTour]);

  // sync markers with points
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const existing = markersRef.current;
    const nextIds = new Set(points.map((p) => p.id));

    for (const [id, m] of existing) {
      if (!nextIds.has(id)) {
        m.remove();
        existing.delete(id);
      }
    }

    points.forEach((p, i) => {
      if (existing.has(p.id)) return;
      const el = createPin(p, i);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        stopTour();
        onSelectRef.current(p.id);
      });
      el.addEventListener("mouseenter", () => onHoverRef.current(p.id));
      el.addEventListener("mouseleave", () => onHoverRef.current(null));
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
      existing.set(p.id, marker);
    });

    tourIndexRef.current = 0;
  }, [points, stopTour]);

  // active / hovered state on pins
  useEffect(() => {
    for (const [id, m] of markersRef.current) {
      const el = m.getElement();
      el.classList.toggle("is-active", id === activeId);
      el.classList.toggle("is-hover", id === hoveredId);
    }
  }, [hoveredId, activeId]);

  // fly to a spot chosen elsewhere (list hover/click)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToId) return;
    const p = points.find((x) => x.id === flyToId);
    if (!p) return;
    stopTour();
    const targetZoom = Math.max(map.getZoom(), 6);
    if (prefersReducedMotion()) {
      map.setCenter([p.lng, p.lat]);
      map.setZoom(targetZoom);
    } else {
      map.flyTo({
        center: [p.lng, p.lat],
        zoom: targetZoom,
        duration: 900,
        essential: true,
      });
    }
  }, [flyToId, points, stopTour]);

  // the camera flies on its own until the visitor takes over
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !touring || prefersReducedMotion()) return;
    if (points.length === 0) return;

    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      const list = pointsRef.current;
      if (list.length === 0) return;
      const p = list[tourIndexRef.current % list.length];
      tourIndexRef.current = (tourIndexRef.current + 1) % list.length;
      setTourLabel(p.label);
      for (const [id, m] of markersRef.current) {
        m.getElement().classList.toggle("is-touring", id === p.id);
      }
      map.flyTo({
        center: [p.lng, p.lat],
        zoom: 4.4,
        speed: 0.32,
        curve: 1.42,
        essential: true,
      });
      tourTimerRef.current = window.setTimeout(step, TOUR_STEP_MS);
    };
    tourTimerRef.current = window.setTimeout(step, TOUR_START_DELAY);

    return () => {
      cancelled = true;
      if (tourTimerRef.current) {
        window.clearTimeout(tourTimerRef.current);
        tourTimerRef.current = null;
      }
      for (const [, m] of markersRef.current) {
        m.getElement().classList.remove("is-touring");
      }
    };
  }, [touring, points.length]);

  return (
    <div className="relative h-full min-h-[420px] w-full">
      <div
        ref={containerRef}
        className="h-full min-h-[420px] w-full bg-paper"
        aria-label="Map of spots"
        role="region"
      />

      {points.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] flex justify-center p-3">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-stone/25 bg-paper/90 px-3.5 py-1.5 backdrop-blur">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${
                touring ? "animate-pulse bg-sage" : "bg-stone"
              }`}
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone">
              {touring
                ? `Tour · ${tourLabel ?? points[0].label}`
                : "Tour pausado"}
            </span>
            <button
              type="button"
              onClick={() => (touring ? stopTour() : setTouring(true))}
              className="rounded-full border border-stone/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
            >
              {touring ? "Pausar" : "Retomar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
