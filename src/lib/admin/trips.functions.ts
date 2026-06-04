import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: not an admin");
}

async function logActivity(
  supabase: any,
  email: string | null,
  action: string,
  entity_type: string,
  entity_id: string | null,
) {
  await supabase
    .from("activity_log")
    .insert({ actor_email: email, action, entity_type, entity_id });
}

export const listTrips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("trips")
      .select(
        "id, trip_id, activity, destination, country, continent, operator, duration_days, status, hero_image_url, updated_at, sort_order",
      )
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { trips: data ?? [] };
  });

export const getTrip = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { data: trip, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!trip) throw new Error("Trip not found");
    return { trip };
  });

const TripPatch = z.object({
  trip_id: z.string().min(1).max(120).optional(),
  destination: z.string().min(1).max(200).optional(),
  country: z.string().min(1).max(120).optional(),
  continent: z.string().min(1).max(80).optional(),
  activity: z.string().min(1).max(80).optional(),
  operator: z.string().max(200).nullable().optional(),
  operator_url: z.string().max(500).nullable().optional(),
  duration_days: z.string().max(60).nullable().optional(),
  season: z.string().max(200).nullable().optional(),
  level: z.string().max(80).nullable().optional(),
  price_range: z.string().max(40).nullable().optional(),
  summary: z.string().max(5000).nullable().optional(),
  editorial_paragraph: z.string().max(20000).nullable().optional(),
  source_url: z.string().max(500).nullable().optional(),
  hero_image_url: z.string().max(1000).nullable().optional(),
  photo_urls: z.array(z.string().max(1000)).max(10).optional(),
  status: z.enum(["draft", "active", "coming-soon"]).optional(),
  sort_order: z.number().int().optional(),
});

export const updateTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ id: z.string().uuid(), patch: TripPatch }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context as any;
    await assertAdmin(supabase, userId);
    const { error } = await supabase
      .from("trips")
      .update(data.patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await logActivity(supabase, claims?.email ?? null, "updated trip", "trip", data.id);
    return { ok: true };
  });

export const createTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context as any;
    await assertAdmin(supabase, userId);
    const trip_id = `new-trip-${Date.now()}`;
    const { data, error } = await supabase
      .from("trips")
      .insert({
        trip_id,
        destination: "New trip",
        country: "—",
        continent: "—",
        activity: "kite",
        status: "draft",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await logActivity(supabase, claims?.email ?? null, "created trip", "trip", data.id);
    return { id: data.id };
  });

export const duplicateTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context as any;
    await assertAdmin(supabase, userId);
    const { data: src, error: e1 } = await supabase
      .from("trips").select("*").eq("id", data.id).maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!src) throw new Error("Trip not found");
    const { id, created_at, updated_at, ...rest } = src;
    const copy = {
      ...rest,
      trip_id: `${rest.trip_id}-copy-${Date.now()}`,
      destination: `${rest.destination} (copy)`,
      status: "draft",
    };
    const { data: ins, error: e2 } = await supabase
      .from("trips").insert(copy).select("id").single();
    if (e2) throw new Error(e2.message);
    await logActivity(supabase, claims?.email ?? null, "duplicated trip", "trip", ins.id);
    return { id: ins.id };
  });

export const deleteTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context as any;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("trips").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await logActivity(supabase, claims?.email ?? null, "deleted trip", "trip", data.id);
    return { ok: true };
  });

export const listActivities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("trips").select("activity");
    if (error) throw new Error(error.message);
    const set = new Set<string>((data ?? []).map((r: any) => r.activity).filter(Boolean));
    return { activities: Array.from(set).sort() };
  });

export const listContinents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("trips").select("continent");
    if (error) throw new Error(error.message);
    const set = new Set<string>((data ?? []).map((r: any) => r.continent).filter(Boolean));
    return { continents: Array.from(set).sort() };
  });