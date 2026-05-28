import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
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
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/login", replace: true });
        return;
      }
      const email = data.session.user.email;
      const ok = email === "pamela.ssarti@gmail.com";
      setAuthorized(ok);
      setAuthChecked(true);
      if (ok) await load();
    })();
  }, [load, navigate]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  if (!authChecked) {
    return (
      <main className="min-h-screen bg-paper text-ink font-sans flex items-center justify-center">
        <p className="text-stone">Loading…</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-paper text-ink font-sans flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl">Not authorized</h1>
          <p className="mt-3 text-sm text-stone">
            This account doesn't have access. Sign in with the admin account.
          </p>
          <button onClick={signOut} className="mt-6 underline text-sm text-stone">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  const filtered = (leads ?? []).filter((l) => filter === "all" || l.status === filter);

  return (
    <main className="min-h-screen bg-paper text-ink font-sans">
      <header className="border-b border-stone/20 px-6 py-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Leads</h1>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-stone">
          <span>{leads?.length ?? 0} total</span>
          <button onClick={signOut} className="underline">Sign out</button>
        </div>
      </header>

      <div className="px-6 py-4 flex gap-2 text-xs uppercase tracking-[0.2em]">
        {(["all", "new", "read", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 border ${
              filter === f ? "border-ink text-ink" : "border-stone/30 text-stone"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="px-6 text-sm text-red-600">{error}</p>}

      <div className="px-6 pb-20">
        {leads === null ? (
          <p className="text-stone">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <p className="text-stone py-12 text-center">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-stone/20">
            {filtered.map((l) => (
              <li key={l.id} className="py-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-serif text-lg">{l.name}</span>
                  <a href={`mailto:${l.email}`} className="text-sm underline text-ink/80">
                    {l.email}
                  </a>
                  {l.phone && <span className="text-sm text-stone">{l.phone}</span>}
                  <span className="ml-auto text-[11px] uppercase tracking-[0.2em] text-stone">
                    {new Date(l.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-stone">
                  Trip:{" "}
                  {l.trip_name ? (
                    <a href={`/trips/${l.trip_id}`} className="underline text-ink/80">
                      {l.trip_name}
                    </a>
                  ) : (
                    <span>—</span>
                  )}
                  {l.source_page && (
                    <>
                      {" · "}
                      <span>From: {l.source_page}</span>
                    </>
                  )}
                  {l.preferred_when && (
                    <>
                      {" · "}
                      <span>When: {l.preferred_when}</span>
                    </>
                  )}
                </div>
                {l.message && (
                  <p className="mt-3 font-serif text-base text-ink whitespace-pre-wrap">
                    {l.message}
                  </p>
                )}
                <div className="mt-3 flex gap-2 text-[11px] uppercase tracking-[0.2em]">
                  <span className="px-2 py-1 border border-stone/30 text-stone">{l.status}</span>
                  {l.status !== "read" && (
                    <button onClick={() => updateStatus(l.id, "read")} className="underline text-stone">
                      Mark read
                    </button>
                  )}
                  {l.status !== "archived" && (
                    <button onClick={() => updateStatus(l.id, "archived")} className="underline text-stone">
                      Archive
                    </button>
                  )}
                  {l.status !== "new" && (
                    <button onClick={() => updateStatus(l.id, "new")} className="underline text-stone">
                      Reopen
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}