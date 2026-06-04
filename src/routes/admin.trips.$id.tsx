import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getTrip, updateTrip, duplicateTrip, deleteTrip,
} from "@/lib/admin/trips.functions";
import { useAutoSave } from "@/hooks/use-auto-save";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ArrowLeft, ExternalLink, Copy, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/trips/$id")({
  component: () => (
    <AdminGate>
      <TripEditor />
    </AdminGate>
  ),
});

const CONTINENTS = [
  "Africa", "Asia", "Central America", "Europe", "North America",
  "Oceania", "South America",
];
const STATUSES = ["draft", "active", "coming-soon"] as const;
const PRICE_RANGES = ["€", "€€", "€€€", "€€€€"];
const ACTIVITIES = ["kite", "surf", "horseback", "wildlife", "martial-arts", "river-cruise"];

type Trip = any;

function TripEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const fetchTrip = useServerFn(getTrip);
  const save = useServerFn(updateTrip);
  const dup = useServerFn(duplicateTrip);
  const del = useServerFn(deleteTrip);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetchTrip({ data: { id } })
      .then((r) => setTrip(r.trip))
      .catch((e) => setErr(e.message));
  }, [fetchTrip, id]);

  const patch = trip
    ? {
        destination: trip.destination ?? "",
        country: trip.country ?? "",
        continent: trip.continent ?? "",
        activity: trip.activity ?? "kite",
        duration_days: trip.duration_days ?? "",
        season: trip.season ?? "",
        level: trip.level ?? "",
        price_range: trip.price_range ?? "",
        operator: trip.operator ?? "",
        operator_url: trip.operator_url ?? "",
        source_url: trip.source_url ?? "",
        summary: trip.summary ?? "",
        editorial_paragraph: trip.editorial_paragraph ?? "",
        hero_image_url: trip.hero_image_url ?? null,
        status: trip.status ?? "draft",
      }
    : null;

  const { state, error } = useAutoSave(patch, async (v) => {
    if (!v) return;
    await save({ data: { id, patch: v as any } });
  });

  function set<K extends string>(key: K, value: any) {
    setTrip((p: any) => (p ? { ...p, [key]: value } : p));
  }

  if (err) return <AdminShell title="Trip"><div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{err}</div></AdminShell>;
  if (!trip || !patch) return <AdminShell title="Trip"><div className="text-sm text-[#737373]">Loading…</div></AdminShell>;

  const previewHref = `/trips/${trip.trip_id}`;
  const canPreview = patch.status === "active" || patch.status === "coming-soon";

  async function onDuplicate() {
    setWorking(true);
    try {
      const { id: newId } = await dup({ data: { id } });
      navigate({ to: "/admin/trips/$id", params: { id: newId } });
    } catch (e: any) { setErr(e?.message); }
    finally { setWorking(false); }
  }
  async function onDelete() {
    setWorking(true);
    try {
      await del({ data: { id } });
      navigate({ to: "/admin/trips" });
    } catch (e: any) {
      setErr(e?.message);
      setWorking(false);
      setConfirmDelete(false);
    }
  }

  return (
    <AdminShell title={patch.destination || "Untitled trip"}>
      <div className="flex items-center justify-between mb-4">
        <Link to="/admin/trips" className="inline-flex items-center gap-1 text-sm text-[#525252] hover:text-[#1a1a1a]">
          <ArrowLeft className="h-3.5 w-3.5" /> All trips
        </Link>
        <SaveStatus state={state} error={error} />
      </div>

      <div className="grid gap-5 max-w-3xl">
        <Card title="Basics">
          <Row><Input label="Destination" required value={patch.destination} onChange={(v) => set("destination", v)} /></Row>
          <Row>
            <Input label="Country" required value={patch.country} onChange={(v) => set("country", v)} />
            <Select label="Continent" required value={patch.continent} onChange={(v) => set("continent", v)} options={CONTINENTS} />
          </Row>
          <Row>
            <Select label="Activity" required value={patch.activity} onChange={(v) => set("activity", v)} options={ACTIVITIES} />
            <Input label="Duration (e.g. 7 or 5-7)" value={patch.duration_days} onChange={(v) => set("duration_days", v)} />
          </Row>
          <Row>
            <Input label="Season" value={patch.season} onChange={(v) => set("season", v)} />
            <Input label="Level" value={patch.level} onChange={(v) => set("level", v)} />
            <Select label="Price range" value={patch.price_range} onChange={(v) => set("price_range", v)} options={PRICE_RANGES} />
          </Row>
        </Card>

        <Card title="Content">
          <Row><Textarea label="Summary (internal)" value={patch.summary} onChange={(v) => set("summary", v)} rows={3} /></Row>
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-1">Editorial paragraph (public, markdown)</label>
            <MarkdownEditor value={patch.editorial_paragraph} onChange={(v) => set("editorial_paragraph", v)} height={300} />
          </div>
          <Row>
            <Input label="Operator name" value={patch.operator} onChange={(v) => set("operator", v)} />
            <Input label="Operator URL" type="url" value={patch.operator_url} onChange={(v) => set("operator_url", v)} />
          </Row>
          <Row><Input label="Source URL (internal)" type="url" value={patch.source_url} onChange={(v) => set("source_url", v)} /></Row>
        </Card>

        <Card title="Hero image">
          <ImageUpload
            value={patch.hero_image_url}
            onChange={(p) => set("hero_image_url", p)}
            folder={`trips/${trip.id}`}
          />
        </Card>

        <Card title="Status">
          <div className="flex gap-4">
            {STATUSES.map((s) => (
              <label key={s} className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]">
                <input type="radio" name="status" checked={patch.status === s} onChange={() => set("status", s)} />
                {s}
              </label>
            ))}
          </div>
        </Card>

        <div className="flex items-center gap-2 pt-2 border-t border-[#e5e5e5]">
          {canPreview && (
            <a href={previewHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5]">
              Preview <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button onClick={onDuplicate} disabled={working} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5] disabled:opacity-50">
            <Copy className="h-3.5 w-3.5" /> Duplicate
          </button>
          <button onClick={() => setConfirmDelete(true)} disabled={working} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#b91c1c] border border-[#fecaca] rounded-md hover:bg-[#fef2f2]">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this trip?"
        description="This cannot be undone."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={onDelete}
        busy={working}
      />
    </AdminShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg">
      <div className="px-4 py-3 border-b border-[#e5e5e5]"><h2 className="text-sm font-medium">{title}</h2></div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, minmax(0, 1fr))` }}>{children}</div>;
}
function Input({ label, required, value, onChange, type = "text" }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#525252] mb-1">{label}{required && <span className="text-[#a3a3a3]"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373] ${required && !value ? "border-[#a3a3a3]" : "border-[#e5e5e5]"}`}
      />
      {required && !value && <p className="mt-1 text-xs text-[#a3a3a3]">Required</p>}
    </div>
  );
}
function Textarea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#525252] mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373]" />
    </div>
  );
}
function Select({ label, required, value, onChange, options }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#525252] mb-1">{label}{required && <span className="text-[#a3a3a3]"> *</span>}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#737373]">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}