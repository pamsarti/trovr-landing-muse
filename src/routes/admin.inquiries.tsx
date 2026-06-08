import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listInquiries, updateInquiry, inquiryStats } from "@/lib/admin/inquiries.functions";
import { Search, ExternalLink, X } from "lucide-react";

export const Route = createFileRoute("/admin/inquiries")({
  component: () => (
    <AdminGate>
      <Inquiries />
    </AdminGate>
  ),
});

type Row = {
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
  internal_notes: string | null;
  created_at: string;
  updated_at?: string;
};

const STATUSES = ["new", "contacted", "closed"];

function Inquiries() {
  const fetchList = useServerFn(listInquiries);
  const fetchStats = useServerFn(inquiryStats);
  const save = useServerFn(updateInquiry);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof inquiryStats>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [trip, setTrip] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchList().then((r) => setRows(r.rows as Row[])).catch((e) => setErr(e.message));
    fetchStats().then(setStats).catch(() => {});
  }, [fetchList, fetchStats]);

  useEffect(load, [load]);

  const trips = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of rows ?? []) if (r.trip_id) m.set(r.trip_id, r.trip_name ?? r.trip_id);
    return Array.from(m.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [rows]);

  const filtered = (rows ?? []).filter((r) => {
    if (status && r.status !== status) return false;
    if (trip && r.trip_id !== trip) return false;
    if (from && r.created_at < from) return false;
    if (to && r.created_at > to + "T23:59:59") return false;
    if (q) {
      const s = q.toLowerCase();
      if (!r.name.toLowerCase().includes(s) && !r.email.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  async function patch(id: string, p: { status?: string; internal_notes?: string }) {
    try {
      await save({ data: { id, patch: p } });
      setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, ...p } : r)) ?? null);
      fetchStats().then(setStats).catch(() => {});
    } catch (e: any) {
      setErr(e?.message ?? "Failed to update");
    }
  }

  const open = openId ? rows?.find((r) => r.id === openId) ?? null : null;

  return (
    <AdminShell title="Inquiries">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="New (unread)" value={stats?.newCount} accent />
        <StatCard label="This month" value={stats?.thisMonth} />
        <StatCard label="Total" value={rows?.length} />
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-3">
          <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">Top trips</div>
          <ul className="text-xs space-y-0.5">
            {(stats?.byTrip ?? []).slice(0, 3).map((t) => (
              <li key={t.trip_id} className="flex justify-between text-[#525252]">
                <span className="truncate mr-2">{t.name}</span>
                <span className="text-[#a3a3a3]">{t.count}</span>
              </li>
            ))}
            {(!stats || stats.byTrip.length === 0) && <li className="text-[#a3a3a3]">—</li>}
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a3a3a3]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="pl-8 pr-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md w-64" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={trip} onChange={(e) => setTrip(e.target.value)} className="px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white">
          <option value="">All trips</option>
          {trips.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white" />
        <span className="text-xs text-[#a3a3a3]">→</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white" />
      </div>

      {err && <div className="mb-3 rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{err}</div>}

      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fafafa] text-[#737373] text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Trip</th>
              <th className="text-left px-3 py-2">When</th>
              <th className="text-left px-3 py-2">Message</th>
              <th className="text-left px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f1]">
            {rows === null && <tr><td colSpan={7} className="px-3 py-8 text-center text-[#a3a3a3]">Loading…</td></tr>}
            {rows !== null && filtered.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-[#a3a3a3]">No inquiries match.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} onClick={() => setOpenId(r.id)} className="cursor-pointer hover:bg-[#fafafa]">
                <td className="px-3 py-2 text-xs text-[#737373] whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-[#1a1a1a] font-medium">{r.name}</td>
                <td className="px-3 py-2 text-[#525252]">{r.email}</td>
                <td className="px-3 py-2 text-[#525252] truncate max-w-[180px]">{r.trip_name ?? "—"}</td>
                <td className="px-3 py-2 text-[#525252]">{r.preferred_when ?? "—"}</td>
                <td className="px-3 py-2 text-[#737373] truncate max-w-[260px]">{r.message ?? ""}</td>
                <td className="px-3 py-2"><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <DetailDrawer row={open} onClose={() => setOpenId(null)} onPatch={(p) => patch(open.id, p)} />}
    </AdminShell>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | null | undefined; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-3 border ${accent ? "bg-[#fef3c7] border-[#fde68a]" : "bg-white border-[#e5e5e5]"}`}>
      <div className="text-xs text-[#737373] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value ?? "—"}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-[#fef3c7] text-[#92400e]",
    contacted: "bg-[#dbeafe] text-[#1e40af]",
    closed: "bg-[#f1f1f1] text-[#525252]",
    read: "bg-[#dbeafe] text-[#1e40af]",
    archived: "bg-[#f1f1f1] text-[#525252]",
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? "bg-[#f1f1f1] text-[#525252]"}`}>{status}</span>;
}

function DetailDrawer({ row, onClose, onPatch }: { row: Row; onClose: () => void; onPatch: (p: { status?: string; internal_notes?: string }) => void }) {
  const [notes, setNotes] = useState(row.internal_notes ?? "");
  useEffect(() => { setNotes(row.internal_notes ?? ""); }, [row.id, row.internal_notes]);

  const mailto = `mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent(`Re: ${row.trip_name ?? "your inquiry"}`)}&body=${encodeURIComponent(`Hi ${row.name},\n\nThanks for reaching out about ${row.trip_name ?? "our trips"}.\n\n`)}`;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30" onClick={onClose}>
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-3">
          <h2 className="text-sm font-semibold">Inquiry</h2>
          <button onClick={onClose} className="text-[#737373] hover:text-[#1a1a1a]"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div>
            <div className="text-base font-medium text-[#1a1a1a]">{row.name}</div>
            <a href={`mailto:${row.email}`} className="text-[#525252] underline text-xs">{row.email}</a>
            {row.phone && <div className="text-xs text-[#737373] mt-0.5">{row.phone}</div>}
          </div>

          <div className="rounded-md bg-[#fafafa] border border-[#e5e5e5] p-3 space-y-1">
            <div className="text-xs text-[#737373] uppercase tracking-wide">Trip</div>
            <div className="text-[#1a1a1a]">{row.trip_name ?? "—"}</div>
            {row.trip_id && (
              <a href={`/trips/${row.trip_id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#525252] hover:underline">
                View public page <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {row.preferred_when && <div className="text-xs text-[#737373] mt-1">When: <span className="text-[#525252]">{row.preferred_when}</span></div>}
            {row.source_page && <div className="text-xs text-[#737373]">From: <span className="text-[#525252]">{row.source_page}</span></div>}
            <div className="text-xs text-[#a3a3a3] mt-1">Received {new Date(row.created_at).toLocaleString()}</div>
          </div>

          {row.message && (
            <div>
              <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">Message</div>
              <p className="whitespace-pre-wrap text-[#1a1a1a]">{row.message}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <a href={mailto} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#404040]">
              Reply by email
            </a>
            <select value={row.status} onChange={(e) => onPatch({ status: e.target.value })} className="ml-auto px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              {!STATUSES.includes(row.status) && <option value={row.status}>{row.status} (legacy)</option>}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#525252] mb-1">Internal notes (not visible to inquirer)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => { if (notes !== (row.internal_notes ?? "")) onPatch({ internal_notes: notes }); }}
              rows={5}
              className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373]"
              placeholder="Add private notes…"
            />
            <p className="mt-1 text-xs text-[#a3a3a3]">Saves when you click outside the box.</p>
          </div>
        </div>
      </div>
    </div>
  );
}