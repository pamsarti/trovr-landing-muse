import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  listSubscribers,
  createSubscriber,
  updateSubscribers,
  deleteSubscribers,
  subscriberStats,
} from "@/lib/admin/subscribers.functions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Search, Download, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/subscribers")({
  component: () => (
    <AdminGate>
      <Subscribers />
    </AdminGate>
  ),
});

type Row = {
  id: string;
  email: string;
  source_page: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["active", "unsubscribed", "bounced"];

function Subscribers() {
  const fetchList = useServerFn(listSubscribers);
  const fetchStats = useServerFn(subscriberStats);
  const add = useServerFn(createSubscriber);
  const update = useServerFn(updateSubscribers);
  const del = useServerFn(deleteSubscribers);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof subscriberStats>> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetchList().then((r) => setRows(r.rows as Row[])).catch((e) => setErr(e.message));
    fetchStats().then(setStats).catch(() => {});
  }, [fetchList, fetchStats]);

  useEffect(load, [load]);

  const filtered = useMemo(
    () => (rows ?? []).filter((r) => !q || r.email.toLowerCase().includes(q.toLowerCase())),
    [rows, q],
  );

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected((s) => (s.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.id))));
  }

  async function bulkStatus(status: string) {
    setBusy(true);
    try {
      await update({ data: { ids: Array.from(selected), status } });
      setSelected(new Set());
      load();
    } catch (e: any) { setErr(e?.message); } finally { setBusy(false); }
  }
  async function bulkDelete() {
    setBusy(true);
    try {
      await del({ data: { ids: Array.from(selected) } });
      setSelected(new Set());
      setConfirmDel(false);
      load();
    } catch (e: any) { setErr(e?.message); } finally { setBusy(false); }
  }

  function exportCsv() {
    const header = ["email", "source_page", "status", "created_at", "notes"];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push(
        [r.email, r.source_page ?? "", r.status, r.created_at, r.notes ?? ""]
          .map(csvEscape)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trovr-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell title="Subscribers">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Active" value={stats?.active} />
        <StatCard label="New this month" value={stats?.thisMonth} />
        <StatCard label="Total" value={rows?.length} />
        <div className="bg-white border border-[#e5e5e5] rounded-lg p-3">
          <div className="text-xs text-[#737373] uppercase tracking-wide mb-1">Top sources</div>
          <ul className="text-xs space-y-0.5">
            {(stats?.sources ?? []).slice(0, 3).map((s) => (
              <li key={s.source} className="flex justify-between text-[#525252]">
                <span className="truncate mr-2">{s.source}</span>
                <span className="text-[#a3a3a3]">{s.count}</span>
              </li>
            ))}
            {(!stats || stats.sources.length === 0) && <li className="text-[#a3a3a3]">—</li>}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a3a3a3]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email" className="pl-8 pr-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md w-64" />
        </div>

        {selected.size > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#525252]">{selected.size} selected</span>
            <button onClick={() => bulkStatus("unsubscribed")} disabled={busy} className="px-2 py-1 text-xs border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5]">Mark unsubscribed</button>
            <button onClick={() => bulkStatus("active")} disabled={busy} className="px-2 py-1 text-xs border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5]">Mark active</button>
            <button onClick={() => setConfirmDel(true)} disabled={busy} className="px-2 py-1 text-xs text-[#b91c1c] border border-[#fecaca] rounded-md hover:bg-[#fef2f2]">Delete</button>
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5]">
            <Plus className="h-3.5 w-3.5" /> Add manually
          </button>
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#404040]">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {err && <div className="mb-3 rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{err}</div>}

      <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#fafafa] text-[#737373] text-xs uppercase tracking-wide">
            <tr>
              <th className="px-3 py-2 w-8">
                <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} />
              </th>
              <th className="text-left px-3 py-2">Email</th>
              <th className="text-left px-3 py-2">Source page</th>
              <th className="text-left px-3 py-2">Subscribed</th>
              <th className="text-left px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f1]">
            {rows === null && <tr><td colSpan={5} className="px-3 py-8 text-center text-[#a3a3a3]">Loading…</td></tr>}
            {rows !== null && filtered.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-[#a3a3a3]">No subscribers.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-[#fafafa]">
                <td className="px-3 py-2"><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} /></td>
                <td className="px-3 py-2 text-[#1a1a1a]">{r.email}</td>
                <td className="px-3 py-2 text-[#525252]">{r.source_page ?? "—"}</td>
                <td className="px-3 py-2 text-xs text-[#a3a3a3]">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <select
                    value={r.status}
                    onChange={async (e) => {
                      try {
                        await update({ data: { ids: [r.id], status: e.target.value } });
                        load();
                      } catch (err: any) { setErr(err?.message); }
                    }}
                    className="px-2 py-0.5 text-xs border border-[#e5e5e5] rounded bg-white"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <AddDialog
          busy={busy}
          onCancel={() => setAddOpen(false)}
          onSubmit={async (email, notes) => {
            setBusy(true);
            try {
              await add({ data: { email, source_page: "manual", notes } });
              setAddOpen(false);
              load();
            } catch (e: any) { setErr(e?.message); } finally { setBusy(false); }
          }}
        />
      )}

      <ConfirmDialog
        open={confirmDel}
        title={`Delete ${selected.size} subscriber${selected.size === 1 ? "" : "s"}?`}
        description="This cannot be undone."
        onCancel={() => setConfirmDel(false)}
        onConfirm={bulkDelete}
        busy={busy}
      />
    </AdminShell>
  );
}

function StatCard({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-3">
      <div className="text-xs text-[#737373] uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[#1a1a1a]">{value ?? "—"}</div>
    </div>
  );
}

function AddDialog({ busy, onCancel, onSubmit }: { busy: boolean; onCancel: () => void; onSubmit: (email: string, notes: string) => void }) {
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-lg border border-[#e5e5e5]">
        <div className="p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a]">Add subscriber</h3>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#525252] mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoFocus className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#525252] mb-1">Notes (optional)</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e5e5e5] bg-[#fafafa] rounded-b-lg">
          <button onClick={onCancel} disabled={busy} className="px-3 py-1.5 text-sm text-[#525252] hover:bg-[#f1f1f1] rounded-md">Cancel</button>
          <button
            onClick={() => email && onSubmit(email.trim(), notes.trim())}
            disabled={busy || !email}
            className="px-3 py-1.5 text-sm text-white bg-[#1a1a1a] hover:bg-[#404040] rounded-md disabled:opacity-50"
          >
            {busy ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}