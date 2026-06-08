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

/** Most-recent edits across all content. Returns last 10. */
export const recentlyEdited = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("activity_log")
      .select("*")
      .in("action", [
        "trip.update", "trip.create", "trip.delete", "trip.duplicate",
        "spot.update", "spot.create", "spot.delete",
        "article.update", "article.create", "article.delete",
        "site_config.update",
        "inquiry.update",
        "subscriber.create",
      ])
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });

/** Last edit for a given entity. */
export const lastEditFor = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { entity_type: string; entity_id: string }) => d)
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data: row } = await supabase
      .from("activity_log")
      .select("*")
      .eq("entity_type", data.entity_type)
      .eq("entity_id", data.entity_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { entry: row };
  });