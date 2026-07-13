import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function createIcon(color: string, big: boolean) {
  const size = big ? 24 : 16;
  const bg = big ? color : "#f3ecdd";
  const dot = big ? "#f3ecdd" : color;
  const d = Math.round(size / 2.6);
  const html = `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${bg};border:1.5px solid ${color};display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(28,26,20,.2);transition:transform 150ms,background 150ms"><div style="width:${d}px;height:${d}px;border-radius:9999px;background:${dot}"></div></div>`;
  return L.divIcon({
    html,
    className: "trovr-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onBoundsRef = useRef(onBoundsChange);
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  onBoundsRef.current = onBoundsChange;
  onSelectRef.current = onSelect;
  onHoverRef.current = onHover;

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: true,
      worldCopyJump: true,
      attributionControl: true,
    }).setView([20, 10], 2);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        attribution: "© OpenStreetMap © CARTO",
        maxZoom: 18,
      },
    ).addTo(map);
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
    // emit initial bounds
    setTimeout(emit, 0);
    return () => {
      map.off("moveend", emit);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

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

    for (const p of points) {
      if (existing.has(p.id)) continue;
      const marker = L.marker([p.lat, p.lng], {
        icon: createIcon(p.color, false),
        title: p.label,
        keyboard: true,
      });
      marker.on("click", () => onSelectRef.current(p.id));
      marker.on("mouseover", () => onHoverRef.current(p.id));
      marker.on("mouseout", () => onHoverRef.current(null));
      marker.addTo(map);
      existing.set(p.id, marker);
    }
  }, [points]);

  // update icon size for hovered/active
  useEffect(() => {
    for (const [id, m] of markersRef.current) {
      const p = points.find((x) => x.id === id);
      if (!p) continue;
      const big = id === activeId || id === hoveredId;
      m.setIcon(createIcon(p.color, big));
      if (big) m.setZIndexOffset(1000);
      else m.setZIndexOffset(0);
    }
  }, [hoveredId, activeId, points]);

  // fly to
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyToId) return;
    const p = points.find((x) => x.id === flyToId);
    if (!p) return;
    const targetZoom = Math.max(map.getZoom(), 6);
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) map.setView([p.lat, p.lng], targetZoom);
    else map.flyTo([p.lat, p.lng], targetZoom, { duration: 0.9 });
  }, [flyToId, points]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[420px] w-full"
      style={{ background: "#e7ddc9" }}
      aria-label="Map of spots"
      role="region"
    />
  );
}
