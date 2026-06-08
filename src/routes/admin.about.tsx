import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllConfig, setConfig } from "@/lib/admin/site-config.functions";
import { useAutoSave } from "@/hooks/use-auto-save";
import { SaveStatus } from "@/components/admin/SaveStatus";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { InlineText } from "@/components/admin/InlineText";
import { InlineImage } from "@/components/admin/InlineImage";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/about")({
  component: () => (
    <AdminGate>
      <AboutEditor />
    </AdminGate>
  ),
});

/**
 * Editable keys (all live under site_config):
 * - about_hero_headline, about_hero_subline
 * - about_why_p1 .. p3
 * - about_founder_photo (storage path), about_founder_quote, about_founder_name
 * - about_founder_p1, about_founder_p2
 * - about_curate_heading
 * - about_curate_principles → [{title, body} x 4]
 */
const PRINCIPLES_KEY = "about_curate_principles";

function AboutEditor() {
  const fetchAll = useServerFn(getAllConfig);
  const [config, setConfigState] = useState<Record<string, any> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [view, setView] = useState<"inline" | "form">("inline");

  useEffect(() => {
    fetchAll().then((r) => setConfigState(r.config)).catch((e) => setErr(e.message));
  }, [fetchAll]);

  if (err) return <AdminShell title="About"><Err msg={err} /></AdminShell>;
  if (!config) return <AdminShell title="About"><div className="text-sm text-[#737373]">Loading…</div></AdminShell>;

  function setLocal(key: string, value: any) {
    setConfigState((p: any) => ({ ...(p ?? {}), [key]: value }));
  }

  return (
    <AdminShell title="About">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-[#737373]">
          {view === "inline"
            ? "Click any text to edit. Hover an image to replace it."
            : "Edits auto-save."}
        </p>
        <div className="flex items-center gap-3">
          <ViewToggle value={view} onChange={setView} />
          <a href="/about" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-[#1a1a1a] hover:underline">
            Open site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {view === "inline" ? (
        <AboutInline config={config} setLocal={setLocal} />
      ) : (
        <AboutForm config={config} setLocal={setLocal} />
      )}
    </AdminShell>
  );
}

/* ---------- Inline view ---------- */

function AboutInline({
  config,
  setLocal,
}: {
  config: Record<string, any>;
  setLocal: (key: string, value: any) => void;
}) {
  const save = useServerFn(setConfig);
  const commit = (key: string, value: any) => {
    setLocal(key, value);
    void save({ data: { key, value } });
  };

  const principles: { title: string; body: string }[] = Array.isArray(config[PRINCIPLES_KEY])
    ? config[PRINCIPLES_KEY]
    : DEFAULT_PRINCIPLES;

  return (
    <div className="bg-paper text-ink font-sans antialiased rounded-lg overflow-hidden border border-[#e5e5e5]">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <InlineText
          as="h1"
          multiline
          value={config.about_hero_headline ?? ""}
          onCommit={(v) => commit("about_hero_headline", v)}
          placeholder="Hero headline"
          className="mx-auto block max-w-3xl font-serif text-4xl leading-[1.15] text-ink sm:text-5xl"
        />
        <InlineText
          as="p"
          value={config.about_hero_subline ?? ""}
          onCommit={(v) => commit("about_hero_subline", v)}
          placeholder="Hero subline"
          className="mx-auto mt-8 block max-w-xl text-base leading-[1.6] text-stone sm:text-lg"
        />
      </section>

      {/* Why we exist */}
      <section className="border-t border-stone/15 px-6 py-20">
        <div className="mx-auto max-w-[720px] space-y-7">
          {(["about_why_p1", "about_why_p2", "about_why_p3"] as const).map((k) => (
            <InlineText
              key={k}
              as="p"
              multiline
              value={config[k] ?? ""}
              onCommit={(v) => commit(k, v)}
              placeholder="Paragraph"
              className="block font-serif text-lg leading-[1.6] text-ink sm:text-xl"
            />
          ))}
        </div>
      </section>

      {/* Founder note */}
      <section className="border-t border-stone/15 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 md:grid-cols-5 md:gap-16">
          <div className="md:col-span-2">
            <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-stone/20 md:max-w-none">
              <InlineImage
                value={config.about_founder_photo || "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80"}
                onChange={(p) => commit("about_founder_photo", p)}
                folder="about"
                className="h-full w-full"
                alt="Founder portrait"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <InlineText
              as="p"
              multiline
              value={config.about_founder_quote ?? ""}
              onCommit={(v) => commit("about_founder_quote", v)}
              placeholder="Founder pull quote"
              className="block font-serif text-xl italic leading-[1.4] text-ink sm:text-2xl md:text-3xl"
            />
            <InlineText
              as="p"
              value={config.about_founder_name ?? ""}
              onCommit={(v) => commit("about_founder_name", v)}
              placeholder="— Founder name"
              className="mt-3 block text-xs tracking-wide text-stone sm:text-sm"
            />
            <div className="mt-8 space-y-6 text-base leading-[1.75] text-ink sm:text-[17px]">
              <InlineText
                as="p"
                multiline
                value={config.about_founder_p1 ?? ""}
                onCommit={(v) => commit("about_founder_p1", v)}
                placeholder="Founder paragraph 1"
                className="block"
              />
              <InlineText
                as="p"
                multiline
                value={config.about_founder_p2 ?? ""}
                onCommit={(v) => commit("about_founder_p2", v)}
                placeholder="Founder paragraph 2"
                className="block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How we curate */}
      <section className="border-t border-stone/15 px-6 py-20">
        <div className="mx-auto max-w-[720px]">
          <InlineText
            as="h2"
            value={config.about_curate_heading ?? "How we curate."}
            onCommit={(v) => commit("about_curate_heading", v)}
            placeholder="Section heading"
            className="block font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl"
          />
          <div className="mt-12 space-y-10">
            {principles.map((p, i) => (
              <div key={i}>
                <InlineText
                  as="p"
                  value={p.title}
                  onCommit={(v) =>
                    commit(
                      PRINCIPLES_KEY,
                      principles.map((x, j) => (j === i ? { ...x, title: v } : x)),
                    )
                  }
                  placeholder="Principle title"
                  className="block font-serif text-xl italic leading-[1.35] text-ink sm:text-2xl"
                />
                <InlineText
                  as="p"
                  multiline
                  value={p.body}
                  onCommit={(v) =>
                    commit(
                      PRINCIPLES_KEY,
                      principles.map((x, j) => (j === i ? { ...x, body: v } : x)),
                    )
                  }
                  placeholder="Principle body"
                  className="mt-4 block text-base leading-[1.75] text-ink/90 sm:text-[17px]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const DEFAULT_PRINCIPLES = [
  { title: "Operators, not aggregators.", body: "" },
  { title: "Compliance, in practice.", body: "" },
  { title: "Track record over branding.", body: "" },
  { title: "Trips that earn the word 'immersive.'", body: "" },
];

/* ---------- Form (fallback) view ---------- */

function AboutForm({
  config,
  setLocal,
}: {
  config: Record<string, any>;
  setLocal: (key: string, value: any) => void;
}) {
  return (
    <div className="grid gap-5 max-w-3xl">
      <Section title="Hero">
        <Field cfgKey="about_hero_headline" label="Headline" value={config.about_hero_headline ?? ""} setLocal={(v) => setLocal("about_hero_headline", v)} multiline />
        <Field cfgKey="about_hero_subline" label="Subline" value={config.about_hero_subline ?? ""} setLocal={(v) => setLocal("about_hero_subline", v)} />
      </Section>
      <Section title="Why we exist">
        <Field cfgKey="about_why_p1" label="Paragraph 1" value={config.about_why_p1 ?? ""} setLocal={(v) => setLocal("about_why_p1", v)} multiline />
        <Field cfgKey="about_why_p2" label="Paragraph 2" value={config.about_why_p2 ?? ""} setLocal={(v) => setLocal("about_why_p2", v)} multiline />
        <Field cfgKey="about_why_p3" label="Paragraph 3" value={config.about_why_p3 ?? ""} setLocal={(v) => setLocal("about_why_p3", v)} multiline />
      </Section>
      <Section title="Founder note">
        <Field cfgKey="about_founder_quote" label="Pull quote" value={config.about_founder_quote ?? ""} setLocal={(v) => setLocal("about_founder_quote", v)} multiline />
        <Field cfgKey="about_founder_name" label="Name" value={config.about_founder_name ?? ""} setLocal={(v) => setLocal("about_founder_name", v)} />
        <Field cfgKey="about_founder_p1" label="Paragraph 1" value={config.about_founder_p1 ?? ""} setLocal={(v) => setLocal("about_founder_p1", v)} multiline />
        <Field cfgKey="about_founder_p2" label="Paragraph 2" value={config.about_founder_p2 ?? ""} setLocal={(v) => setLocal("about_founder_p2", v)} multiline />
      </Section>
      <Section title="How we curate (heading)">
        <Field cfgKey="about_curate_heading" label="Heading" value={config.about_curate_heading ?? ""} setLocal={(v) => setLocal("about_curate_heading", v)} />
        <p className="text-xs text-[#a3a3a3]">Principles list is edited in Inline view.</p>
      </Section>
    </div>
  );
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

function Field({
  cfgKey, label, value, setLocal, multiline,
}: { cfgKey: string; label: string; value: string; setLocal: (v: string) => void; multiline?: boolean }) {
  const save = useServerFn(setConfig);
  const { state, error } = useAutoSave(value, async (v) => {
    await save({ data: { key: cfgKey, value: v } });
  });
  useUnsavedChanges(state === "saving");
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
          className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373]"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setLocal(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#e5e5e5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#737373]"
        />
      )}
    </div>
  );
}

function ViewToggle({
  value, onChange,
}: { value: "inline" | "form"; onChange: (v: "inline" | "form") => void }) {
  return (
    <div className="inline-flex rounded-md border border-[#e5e5e5] bg-white p-0.5">
      {(["inline", "form"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-xs rounded-[4px] transition-colors ${
            value === opt ? "bg-[#1a1a1a] text-white" : "text-[#525252] hover:bg-[#f5f5f5]"
          }`}
        >
          {opt === "inline" ? "Inline view" : "Form view"}
        </button>
      ))}
    </div>
  );
}

function Err({ msg }: { msg: string }) {
  return <div className="rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">{msg}</div>;
}