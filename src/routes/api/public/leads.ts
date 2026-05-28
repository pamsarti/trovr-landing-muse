import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const LeadSchema = z.object({
  trip_id: z.string().max(200).optional().nullable(),
  trip_name: z.string().max(500).optional().nullable(),
  source_page: z.string().max(2000).optional().nullable(),
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().nullable(),
  preferred_when: z.string().max(200).optional().nullable(),
  message: z.string().max(4000).optional().nullable(),
});

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const parsed = LeadSchema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Invalid input", details: parsed.error.flatten() }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const { error } = await supabaseAdmin.from("leads").insert({
          trip_id: parsed.data.trip_id ?? null,
          trip_name: parsed.data.trip_name ?? null,
          source_page: parsed.data.source_page ?? null,
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone ?? null,
          preferred_when: parsed.data.preferred_when ?? null,
          message: parsed.data.message ?? null,
        });

        if (error) {
          console.error("Failed to insert lead:", error);
          return new Response(JSON.stringify({ error: "Failed to save lead" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});