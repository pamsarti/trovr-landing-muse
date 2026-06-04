import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { listTrips, createTrip } from "@/lib/admin/trips.functions";
import { ImagePreview } from "@/components/admin/ImageUpload";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/admin/trips")({
  component: () => (
    <AdminGate>
      <TripsList />
    </AdminGate>
  ),
});

type Row = {
  id: string;
  trip_id: string;
  activity: string;
  destination: string;
  country: string;
  continent: string;
  operator: string | null;
  duration_days: string | null;
  status: string;
  hero_image_url: string | null;
  updated_at: string;
};

function TripsList() {
  const fetchList = useServerFn(listTrips);
  const create = useServerFn(createTrip);
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [activity, setActivity] = useState("");
  const [continent, setContinent] = useState("");
  const [status, setStatus] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    fetchList().then((r) => setRows(r.trips as Row[])).catch((e) => setErr(e.message));
  }
  useEffect(load, [fetchList]);

  const activities = useMemo(() => uniq(rows?.map((r) => r.activity)), [rows]);
  const continents = useMemo(() => uniq(rows?.map((r) => r.continent)), [rows]);
  const statuses = useMemo(() => uniq(rows?.map((r) => r.status)), [rows]);

  const filtered = (rows ?? []).filter((r) => {
    if (activity && r.activity !== activity) return false;
    if (continent && r.continent !== continent) return false;
    if (status && r.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      if (
        !r.destination?.toLowerCase().includes(s) &&
        !r.country?.toLowerCase().includes(s) &&
        !(r.operator ?? "").toLowerCase().includes(s)
      )
        return false;
    }
    return true;
  });

  async function onNew() {
    setCreating(true);
    try {
      const { id } = await create();
      navigate({ to: "/admin/trips/$id" as any, params: { id } as any });
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create");
      setCreating(false);
    }
  }

  return (
    <AdminShell title="Trips">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a3a3a3]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, country, operator"
            className="pl-8 pr-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md w-64"
          />
        </div>
        <Select label="Activity" value={activity} setValue={setActivity} options={activities} />
        <Select label="Continent" value={continent} setValue={setContinent} options={continents} />
        <Select label="Status" value={status} setValue={setStatus} options={statuses} />
        <div className="ml-auto">
          <button
            onClick={onNew}
            disabled={creating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#404040] disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" /> New trip
          </button>
        </div>
      </div>

      {err && <div className="mb-3 rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{err}</div>}

      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fafafa] text-[#737373] text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-3 py-2 w-16"></th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Country</th>
              <th className="text-left px-3 py-2">Activity</th>
              <th className="text-left px-3 py-2">Duration</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f1]">
            {rows === null && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-[#a3a3a3]">Loading…</td></tr>
            )}
            {rows !== null && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-[#a3a3a3]">No trips match.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-[#fafafa]">
                <td className="px-3 py-2">
                  <Link to={"/admin/trips/$id" as any} params={{ id: r.id } as any} className="block">
                    <ImagePreview path={r.hero_image_url} className="h-10 w-10 object-cover rounded border border-[#e5e5e5] bg-[#fafafa]" />
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <Link to={"/admin/trips/$id" as any} params={{ id: r.id } as any} className="text-[#1a1a1a] font-medium hover:underline">
                    {r.destination}
                  </Link>
                  <div className="text-xs text-[#a3a3a3]">{r.operator ?? "—"}</div>
                </td>
                <td className="px-3 py-2 text-[#525252]">{r.country}</td>
                <td className="px-3 py-2 text-[#525252]">{r.activity}</td>
                <td className="px-3 py-2 text-[#525252]">{r.duration_days ?? "—"}</td>
                <td className="px-3 py-2"><StatusPill status={r.status} /></td>
                <td className="px-3 py-2 text-xs text-[#a3a3a3]">{new Date(r.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function uniq(arr: (string | null | undefined)[] | undefined): string[] {
  if (!arr) return [];
  return Array.from(new Set(arr.filter(Boolean) as string[])).sort();
}

function Select({
  label, value, setValue, options,
}: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white"
    >
      <option value="">All {label.toLowerCase()}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-[#f5f5f5] text-[#525252]",
    active: "bg-[#dcfce7] text-[#166534]",
    "coming-soon": "bg-[#fef3c7] text-[#92400e]",
    published: "bg-[#dcfce7] text-[#166534]",
  };
  const cls = map[status] ?? "bg-[#f5f5f5] text-[#525252]";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}