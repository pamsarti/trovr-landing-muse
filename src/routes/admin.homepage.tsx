import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAllConfig, setConfig } from "@/lib/admin/site-config.functions";
import { useAutoSave } from "@/hooks/use-auto-save";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { ExternalLink, Plus, Trash2, GripVertical } from "lucide-react";

export const Route = createFileRoute("/admin/homepage")({
  component: () => (
    <AdminGate>
      <HomepageEditor />
    </AdminGate>
  ),
});

type Stat = { label: string; value: string };

function HomepageEditor() {
  const fetchAll = useServerFn(getAllConfig);
  const [config, setConfigState] = useState<Record<string, any> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchAll().then((r) => setConfigState(r.config)).catch((e) => setErr(e.message));
  }, [fetchAll]);

  if (err) return <AdminShell title="Homepage"><Err msg={err} /></AdminShell>;
  if (!config) return <AdminShell title="Homepage"><div className="text-sm text-[#737373]">Loading…</div></AdminShell>;

  return (
    <AdminShell title="Homepage">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#737373]">Edits auto-save. Public site shows changes on next refresh.</p>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#1a1a1a] hover:underline">
          Preview homepage <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="grid gap-5 max-w-3xl">
        <Section title="Hero">
          <Field cfgKey="homepage_hero_headline" label="Headline" value={config.homepage_hero_headline ?? ""} setLocal={(v) => updateLocal(setConfigState, "homepage_hero_headline", v)} multiline />
          <Field cfgKey="homepage_hero_subline" label="Subline" value={config.homepage_hero_subline ?? ""} setLocal={(v) => updateLocal(setConfigState, "homepage_hero_subline", v)} />
        </Section>

        <Section title="Manifesto">
          <Field cfgKey="homepage_manifesto_p1" label="Paragraph 1" value={config.homepage_manifesto_p1 ?? ""} setLocal={(v) => updateLocal(setConfigState, "homepage_manifesto_p1", v)} multiline />
          <Field cfgKey="homepage_manifesto_p2" label="Paragraph 2" value={config.homepage_manifesto_p2 ?? ""} setLocal={(v) => updateLocal(setConfigState, "homepage_manifesto_p2", v)} multiline />
          <Field cfgKey="homepage_manifesto_p3" label="Paragraph 3" value={config.homepage_manifesto_p3 ?? ""} setLocal={(v) => updateLocal(setConfigState, "homepage_manifesto_p3", v)} multiline />
        </Section>

        <Section title="Stats block">
          <StatsEditor
            value={Array.isArray(config.homepage_stats) ? config.homepage_stats : []}
            setLocal={(v) => updateLocal(setConfigState, "homepage_stats", v)}
          />
        </Section>

        <Section title="Newsletter">
          <Field cfgKey="newsletter_heading" label="Heading" value={config.newsletter_heading ?? ""} setLocal={(v) => updateLocal(setConfigState, "newsletter_heading", v)} />
          <Field cfgKey="newsletter_subline" label="Subline" value={config.newsletter_subline ?? ""} setLocal={(v) => updateLocal(setConfigState, "newsletter_subline", v)} />
        </Section>

        <Section title="Footer">
          <Field cfgKey="footer_text" label="Tagline / copyright" value={config.footer_text ?? ""} setLocal={(v) => updateLocal(setConfigState, "footer_text", v)} />
        </Section>
      </div>
    </AdminShell>
  );
}

function updateLocal(setter: (fn: any) => void, key: string, value: any) {
  setter((prev: any) => ({ ...prev, [key]: value }));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg">
      <div className="px-4 py-3 border-b border-[#e5e5e5]">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{msg}</div>;
}

function Field({
  cfgKey,
  label,
  value,
  setLocal,
  multiline,
}: {
  cfgKey: string;
  label: string;
  value: string;
  setLocal: (v: string) => void;
  multiline?: boolean;
}) {
  const save = useServerFn(setConfig);
  const { state, error } = useAutoSave(value, async (v) => {
    await save({ data: { key: cfgKey, value: v } });
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-[#525252]">{label}</label>
        <SaveStatus state={state} error={error} />
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setLocal(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373] focus:border-[#737373]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setLocal(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373] focus:border-[#737373]"
        />
      )}
    </div>
  );
}

function StatsEditor({ value, setLocal }: { value: Stat[]; setLocal: (v: Stat[]) => void }) {
  const save = useServerFn(setConfig);
  const { state, error } = useAutoSave(value, async (v) => {
    await save({ data: { key: "homepage_stats", value: v } });
  });
  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setLocal(next);
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#525252]">Stats (max 6)</span>
        <SaveStatus state={state} error={error} />
      </div>
      <div className="space-y-2">
        {value.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button type="button" onClick={() => move(i, i - 1)} className="text-[#a3a3a3] hover:text-[#525252] text-xs">▲</button>
              <button type="button" onClick={() => move(i, i + 1)} className="text-[#a3a3a3] hover:text-[#525252] text-xs">▼</button>
            </div>
            <GripVertical className="h-4 w-4 text-[#d4d4d4]" />
            <input
              value={s.value}
              placeholder="Number"
              onChange={(e) => setLocal(value.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
              className="w-28 px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md"
            />
            <input
              value={s.label}
              placeholder="Label"
              onChange={(e) => setLocal(value.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              className="flex-1 px-2 py-1.5 text-sm border border-[#e5e5e5] rounded-md"
            />
            <button
              type="button"
              onClick={() => setLocal(value.filter((_, j) => j !== i))}
              className="p-1.5 text-[#a3a3a3] hover:text-[#b91c1c]"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {value.length < 6 && (
        <button
          type="button"
          onClick={() => setLocal([...value, { value: "", label: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-dashed border-[#d4d4d4] rounded-md text-[#525252] hover:bg-[#f5f5f5]"
        >
          <Plus className="h-3.5 w-3.5" /> Add stat
        </button>
      )}
    </div>
  );
}