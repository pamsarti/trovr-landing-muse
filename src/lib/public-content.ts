// Shared by public route loaders and Node build scripts (Node 22+).
// Keep this module free of browser APIs, aliases and runtime dependencies.
export type SpotEditorial = {
  description?: string;
  conditions?: { activitySpecific?: Record<string, unknown> };
};

export function isPublicSpot(spot: SpotEditorial): boolean {
  const hasDescription = typeof spot.description === "string" && spot.description.trim().length > 0;
  const conditions = spot.conditions?.activitySpecific;
  return hasDescription && !!conditions && Object.keys(conditions).length > 0;
}

export type SpotOverlay = {
  description?: string;
  bestMonths?: string[];
  activitySpecific?: Record<string, string>;
};

export function applySpotOverlay<
  T extends {
    description: string;
    conditions: { bestMonths: string[]; activitySpecific?: Record<string, string> };
  },
>(spot: T, overlay?: SpotOverlay): T {
  if (!overlay) return spot;
  return {
    ...spot,
    description: overlay.description ?? spot.description,
    conditions: {
      ...spot.conditions,
      bestMonths: overlay.bestMonths ?? spot.conditions.bestMonths,
      activitySpecific: { ...spot.conditions.activitySpecific, ...overlay.activitySpecific },
    },
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PUBLIC_STATIC_PATHS = [
  "/",
  "/about",
  "/journal",
  "/spots",
  "/viagem",
  "/roteiro",
  "/privacidade",
] as const;
