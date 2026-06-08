import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: not an admin");
}

function validEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 320;
}

export const listSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await (supabase as any)
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const createSubscriber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; source_page?: string; notes?: string }) => d)
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context;
    await assertAdmin(supabase, userId);
    const email = data.email.trim().toLowerCase();
    if (!validEmail(email)) throw new Error("Invalid email");
    const { error } = await (supabase as any).from("subscribers").insert({
      email,
      source_page: data.source_page ?? "manual",
      notes: data.notes ?? null,
      status: "active",
    });
    if (error) throw new Error(error.message);
    await supabase.from("activity_log").insert({
      actor_email: (claims as any)?.email ?? null,
      action: "subscriber.create",
      entity_type: "subscriber",
      entity_id: email,
    });
    return { ok: true };
  });

export const updateSubscribers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ids: string[]; status?: string }) => d)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    if (!data.ids.length) return { ok: true };
    const patch: any = {};
    if (data.status) {
      patch.status = data.status;
      patch.unsubscribed_at = data.status === "unsubscribed" ? new Date().toISOString() : null;
    }
    const { error } = await (supabase as any).from("subscribers").update(patch).in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSubscribers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ids: string[] }) => d)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    if (!data.ids.length) return { ok: true };
    const { error } = await (supabase as any).from("subscribers").delete().in("id", data.ids);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const subscriberStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);
    const [activeQ, monthQ, sourcesQ] = await Promise.all([
      (supabase as any).from("subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
      (supabase as any).from("subscribers").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
      (supabase as any).from("subscribers").select("source_page"),
    ]);
    const sources: Record<string, number> = {};
    for (const r of (sourcesQ.data ?? []) as any[]) {
      const k = r.source_page ?? "unknown";
      sources[k] = (sources[k] ?? 0) + 1;
    }
    return {
      active: activeQ.count ?? 0,
      thisMonth: monthQ.count ?? 0,
      sources: Object.entries(sources)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    };
  });