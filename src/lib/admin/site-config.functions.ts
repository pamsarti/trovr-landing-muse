import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles").select("role")
    .eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden: not an admin");
}

export const getAllConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("site_config").select("key, value");
    if (error) throw new Error(error.message);
    const map: Record<string, any> = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return { config: map };
  });

export const setConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      key: z.string().min(1).max(120).regex(/^[a-z0-9_]+$/),
      value: z.any(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId, claims } = context as any;
    await assertAdmin(supabase, userId);
    const { error } = await supabase
      .from("site_config")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await supabase.from("activity_log").insert({
      actor_email: claims?.email ?? null,
      action: "updated config",
      entity_type: "site_config",
      entity_id: data.key,
    });
    return { ok: true };
  });