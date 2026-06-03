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

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);

    const [trips, spots, articles, leads, activity] = await Promise.all([
      supabase.from("trips").select("*", { count: "exact", head: true }),
      supabase.from("spots").select("*", { count: "exact", head: true }),
      supabase.from("journal_articles").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    return {
      counts: {
        trips: trips.count ?? 0,
        spots: spots.count ?? 0,
        articles: articles.count ?? 0,
        leads: leads.count ?? 0,
        media: 0,
      },
      activity: (activity.data ?? []) as Array<{
        id: string;
        actor_email: string | null;
        action: string;
        entity_type: string | null;
        entity_id: string | null;
        created_at: string;
      }>,
    };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data, userId };
  });