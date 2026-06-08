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
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { lastEditFor } from "@/lib/admin/activity.functions";
import { ArrowLeft, ExternalLink, Copy, Trash2 } from "lucide-react";
import { InlineImage } from "@/components/admin/InlineImage";
import { PreviewPane } from "@/components/admin/PreviewPane";
import { TripPreview } from "@/components/admin/TripPreview";

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
  const fetchLastEdit = useServerFn(lastEditFor);
  const [lastEdit, setLastEdit] = useState<any>(null);

  useEffect(() => {
    fetchTrip({ data: { id } })
      .then((r) => setTrip(r.trip))
      .catch((e) => setErr(e.message));
  }, [fetchTrip, id]);

  useEffect(() => {
    fetchLastEdit({ data: { entity_type: "trip", entity_id: id } })
      .then((r) => setLastEdit(r.entry))
      .catch(() => {});
  }, [fetchLastEdit, id]);

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
        photo_urls: Array.isArray(trip.photo_urls) ? trip.photo_urls : [],
      }
    : null;

  const { state, error } = useAutoSave(patch, async (v) => {
    if (!v) return;
    await save({ data: { id, patch: v as any } });
  });
  useUnsavedChanges(state === "saving");

  function set<K extends string>(key: K, value: any) {
    setTrip((p: any) => (p ? { ...p, [key]: value } : p));
  }
  function setPhoto(i: number, path: string | null) {
    setTrip((p: any) => {
      if (!p) return p;
      const next = Array.isArray(p.photo_urls) ? [...p.photo_urls] : [];
      while (next.length <= i) next.push("");
      next[i] = path ?? "";
      return { ...p, photo_urls: next };
    });
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
        <div className="flex items-center gap-3">
          {lastEdit && (
            <span className="text-xs text-[#a3a3a3]">
              Last edited {new Date(lastEdit.created_at).toLocaleString()}
              {lastEdit.actor_email ? ` · ${lastEdit.actor_email}` : ""}
            </span>
          )}
          <SaveStatus state={state} error={error} />
        </div>
      </div>

      <PreviewPane
        previewLabel="Preview"
        preview={<TripPreview draft={{ ...patch, trip_id: trip.trip_id }} />}
        form={
          <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
            {/* Hero image — 16:9 at the top, click-to-replace */}
            <div className="aspect-video w-full bg-[#fafafa]">
              <InlineImage
                value={patch.hero_image_url}
                onChange={(p) => set("hero_image_url", p)}
                folder={`trips/${trip.id}`}
                className="h-full w-full"
                alt={patch.destination}
              />
            </div>

            <div className="mx-auto max-w-3xl px-6 py-10 font-sans">
              {/* Tag row inputs */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                <TagField label="Country" value={patch.country} onChange={(v) => set("country", v)} required />
                <TagSelect label="Activity" value={patch.activity} onChange={(v) => set("activity", v)} options={ACTIVITIES} required />
                <TagField label="Duration" value={String(patch.duration_days ?? "")} onChange={(v) => set("duration_days", v)} placeholder="7 or 5-7" />
                <TagField label="Level" value={patch.level} onChange={(v) => set("level", v)} />
              </div>

              {/* Destination — serif h1 */}
              <div className="mt-6">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-2">
                  Destination
                </label>
                <input
                  value={patch.destination}
                  onChange={(e) => set("destination", e.target.value)}
                  placeholder="Destination"
                  className="w-full bg-transparent border-0 border-b border-dashed border-[#e5e5e5] focus:border-[#1a1a1a] focus:outline-none font-serif text-4xl leading-tight text-[#1a1a1a] sm:text-5xl py-2"
                  style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif" }}
                />
              </div>

              {/* Continent (helper) */}
              <div className="mt-4 max-w-xs">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-1">Continent</label>
                <select
                  value={patch.continent}
                  onChange={(e) => set("continent", e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#737373]"
                >
                  <option value="">—</option>
                  {CONTINENTS.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              </div>

              {/* Editorial paragraph — serif body styling */}
              <div className="mt-10">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-2">
                  Editorial paragraph (public · markdown)
                </label>
                <div className="font-serif">
                  <MarkdownEditor
                    value={patch.editorial_paragraph}
                    onChange={(v) => set("editorial_paragraph", v)}
                    height={260}
                  />
                </div>
              </div>

              {/* Summary — internal only */}
              <div className="mt-6">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-2">
                  Summary (internal — used on list cards)
                </label>
                <textarea
                  value={patch.summary}
                  onChange={(e) => set("summary", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373]"
                />
              </div>

              {/* Fact block — 2-column grid like the public page */}
              <div className="mt-10 grid grid-cols-1 gap-y-5 border-y border-[#e5e5e5] py-8 sm:grid-cols-2">
                <FactField label="Operator" value={patch.operator} onChange={(v) => set("operator", v)} />
                <FactField label="Operator URL" value={patch.operator_url} onChange={(v) => set("operator_url", v)} type="url" />
                <FactField label="Season" value={patch.season} onChange={(v) => set("season", v)} />
                <FactSelect label="Price range" value={patch.price_range} onChange={(v) => set("price_range", v)} options={PRICE_RANGES} />
                <FactField label="Source URL (internal)" value={patch.source_url} onChange={(v) => set("source_url", v)} type="url" />
              </div>

              {/* Photo strip — 3 slots */}
              <div className="mt-10">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-3">
                  Photo strip
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-[2px] border border-dashed border-[#e5e5e5] bg-[#fafafa]">
                      <InlineImage
                        value={patch.photo_urls?.[i] || null}
                        onChange={(p) => setPhoto(i, p)}
                        folder={`trips/${trip.id}/photos`}
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status + actions */}
              <div className="mt-10 pt-6 border-t border-[#e5e5e5]">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3] mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-4">
                  {STATUSES.map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]">
                      <input type="radio" name="status" checked={patch.status === s} onChange={() => set("status", s)} />
                      {s}
                    </label>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {canPreview && (
                    <a href={previewHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5]">
                      Open public page <ExternalLink className="h-3.5 w-3.5" />
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
            </div>
          </div>
        }
      />

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

/* ---------- Small-caps tag row inputs (mirrors public chip line) ---------- */

function TagField({
  label, value, onChange, required, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3]">
        {label}{required && <span> *</span>}
      </div>
      <input
        value={value}
        placeholder={placeholder ?? "—"}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-0 border-b border-dashed border-[#e5e5e5] focus:border-[#1a1a1a] focus:outline-none text-[11px] uppercase tracking-[0.2em] text-[#525252] py-1"
      />
    </div>
  );
}

function TagSelect({
  label, value, onChange, options, required,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#a3a3a3]">
        {label}{required && <span> *</span>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-0 border-b border-dashed border-[#e5e5e5] focus:border-[#1a1a1a] focus:outline-none text-[11px] uppercase tracking-[0.2em] text-[#525252] py-1"
      >
        <option value="">—</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}

/* ---------- Fact block fields (mirrors public dl) ---------- */

function FactField({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#a3a3a3]">{label}</div>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b border-dashed border-[#e5e5e5] focus:border-[#1a1a1a] focus:outline-none font-serif text-base text-[#1a1a1a] py-1"
        style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif" }}
      />
    </div>
  );
}

function FactSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#a3a3a3]">{label}</div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border-0 border-b border-dashed border-[#e5e5e5] focus:border-[#1a1a1a] focus:outline-none font-serif text-base text-[#1a1a1a] py-1"
        style={{ fontFamily: "'Fraunces', 'Cormorant Garamond', serif" }}
      >
        <option value="">—</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </div>
  );
}