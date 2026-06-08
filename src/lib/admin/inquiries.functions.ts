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

export const listInquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

export const updateInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; patch: { status?: string; internal_notes?: string } }) => d)
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context;
    await assertAdmin(supabase, userId);
    const { error } = await supabase.from("leads").update(data.patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    await supabase.from("activity_log").insert({
      actor_email: (claims as any)?.email ?? null,
      action: "inquiry.update",
      entity_type: "inquiry",
      entity_id: data.id,
    });
    return { ok: true };
  });

export const inquiryStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);
    const [monthQ, newQ, byTripQ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("trip_id, trip_name").not("trip_id", "is", null),
    ]);
    const byTrip: Record<string, { name: string; count: number }> = {};
    for (const r of (byTripQ.data ?? []) as any[]) {
      const k = r.trip_id as string;
      if (!byTrip[k]) byTrip[k] = { name: r.trip_name ?? k, count: 0 };
      byTrip[k].count++;
    }
    return {
      thisMonth: monthQ.count ?? 0,
      newCount: newQ.count ?? 0,
      byTrip: Object.entries(byTrip)
        .map(([trip_id, v]) => ({ trip_id, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
    };
  });