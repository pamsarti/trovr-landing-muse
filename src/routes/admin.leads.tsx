import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";

type Lead = {
  id: string;
  trip_id: string | null;
  trip_name: string | null;
  source_page: string | null;
  name: string;
  email: string;
  phone: string | null;
  preferred_when: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/leads")({
  component: () => (
    <AdminGate>
      <Leads />
    </AdminGate>
  ),
});

function Leads() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setLeads([]);
      return;
    }
    setLeads(data as Lead[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    await load();
  }

  const filtered = (leads ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <AdminShell title="Leads">
      <div className="flex items-center gap-2 mb-4">
        {(["all", "new", "read", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-xs font-medium border ${
              filter === f
                ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                : "bg-white text-[#525252] border-[#d4d4d4] hover:bg-[#fafafa]"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#737373]">{leads?.length ?? 0} total</span>
      </div>

      {error && (
        <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c] mb-4">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        {leads === null ? (
          <p className="p-6 text-sm text-[#737373]">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-[#737373] text-center">No leads.</p>
        ) : (
          <ul className="divide-y divide-[#f1f1f1]">
            {filtered.map((l) => (
              <li key={l.id} className="p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium text-sm">{l.name}</span>
                  <a href={`mailto:${l.email}`} className="text-xs text-[#525252] underline">
                    {l.email}
                  </a>
                  {l.phone && <span className="text-xs text-[#737373]">{l.phone}</span>}
                  <span className="ml-auto text-xs text-[#a3a3a3]">
                    {new Date(l.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="mt-1.5 text-xs text-[#737373]">
                  Trip:{" "}
                  {l.trip_name ? (
                    <a href={`/trips/${l.trip_id}`} className="underline text-[#525252]">
                      {l.trip_name}
                    </a>
                  ) : (
                    "—"
                  )}
                  {l.source_page && <> · From: {l.source_page}</>}
                  {l.preferred_when && <> · When: {l.preferred_when}</>}
                </div>
                {l.message && (
                  <p className="mt-2 text-sm text-[#1a1a1a] whitespace-pre-wrap">{l.message}</p>
                )}
                <div className="mt-2 flex gap-2 items-center text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#f1f1f1] text-[#525252]">{l.status}</span>
                  {l.status !== "read" && (
                    <button onClick={() => updateStatus(l.id, "read")} className="text-[#525252] underline">
                      Mark read
                    </button>
                  )}
                  {l.status !== "archived" && (
                    <button onClick={() => updateStatus(l.id, "archived")} className="text-[#525252] underline">
                      Archive
                    </button>
                  )}
                  {l.status !== "new" && (
                    <button onClick={() => updateStatus(l.id, "new")} className="text-[#525252] underline">
                      Reopen
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}