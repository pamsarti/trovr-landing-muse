import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminGate } from "@/components/admin/AdminGate";
import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <AdminGate>
      <Dashboard />
    </AdminGate>
  ),
});

function Dashboard() {
  const fetchStats = useServerFn(getAdminStats);
  const [data, setData] = useState<Awaited<ReturnType<typeof getAdminStats>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then(setData)
      .catch((e) => setError(e.message ?? "Failed to load"));
  }, [fetchStats]);

  return (
    <AdminShell title="Dashboard">
      {error && (
        <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c] mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Trips", value: data?.counts.trips },
          { label: "Spots", value: data?.counts.spots },
          { label: "Articles", value: data?.counts.articles },
          { label: "Leads", value: data?.counts.leads },
          { label: "Media", value: data?.counts.media },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e5] rounded-lg p-4">
            <div className="text-xs text-[#737373] uppercase tracking-wide">{s.label}</div>
            <div className="mt-1 text-2xl font-semibold text-[#1a1a1a]">
              {s.value ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-4 py-3 border-b border-[#e5e5e5]">
          <h2 className="text-sm font-medium">Recent activity</h2>
        </div>
        {data && data.activity.length === 0 ? (
          <p className="px-4 py-8 text-sm text-[#737373] text-center">
            No activity yet. Changes you make will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-[#f1f1f1]">
            {data?.activity.map((a) => (
              <li key={a.id} className="px-4 py-2.5 flex items-center gap-3 text-sm">
                <span className="text-[#1a1a1a]">{a.action}</span>
                {a.entity_type && (
                  <span className="text-[#737373] text-xs">
                    {a.entity_type}
                    {a.entity_id ? ` · ${a.entity_id}` : ""}
                  </span>
                )}
                <span className="ml-auto text-xs text-[#a3a3a3]">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}