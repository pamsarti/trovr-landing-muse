import { useServerFn } from "@tanstack/react-start";
import { setConfig } from "@/lib/admin/site-config.functions";
import { InlineText } from "@/components/admin/InlineText";

/**
 * Inline-edit view of the public homepage. Renders the same visual
 * structure as src/routes/index.tsx (Hero copy, Manifesto, Stats,
 * Newsletter, Footer) but with editable text nodes. Click outside any
 * field to commit + save.
 *
 * Only text fields that exist in site_config are exposed here. Layout-
 * affecting things (featured trip list, hero rotator images) stay in
 * the dedicated managers.
 */
export function HomepageInline({
  config,
  setLocal,
}: {
  config: Record<string, any>;
  setLocal: (key: string, value: any) => void;
}) {
  const save = useServerFn(setConfig);
  function commit(key: string, value: any) {
    setLocal(key, value);
    void save({ data: { key, value } });
  }

  const stats: { label: string; value: string }[] = Array.isArray(config.homepage_stats)
    ? config.homepage_stats
    : [];

  return (
    <div className="bg-paper text-ink font-sans antialiased rounded-lg overflow-hidden border border-[#e5e5e5]">
      {/* Hero (compact, not full-screen, to fit the editor) */}
      <section className="relative bg-ink px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-white">
          <p className="text-[10.5px] uppercase tracking-[0.28em] text-white/70">
            An atlas for those who travel to feel
          </p>
          <InlineText
            as="h1"
            multiline
            value={config.homepage_hero_headline ?? ""}
            onCommit={(v) => commit("homepage_hero_headline", v)}
            placeholder="Headline"
            className="mt-5 block font-serif text-4xl leading-[1.05] text-white sm:text-6xl"
          />
          <InlineText
            as="p"
            value={config.homepage_hero_subline ?? ""}
            onCommit={(v) => commit("homepage_hero_subline", v)}
            placeholder="Subline"
            className="mt-6 block text-base text-white/80 sm:text-lg"
          />
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-[10.5px] uppercase tracking-[0.28em] text-mid">
            The manifesto
          </p>
          <InlineText
            as="p"
            multiline
            value={config.homepage_manifesto_p1 ?? ""}
            onCommit={(v) => commit("homepage_manifesto_p1", v)}
            placeholder="Paragraph 1"
            className="block font-serif text-lg leading-relaxed text-ink sm:text-xl"
          />
          <InlineText
            as="p"
            multiline
            value={config.homepage_manifesto_p2 ?? ""}
            onCommit={(v) => commit("homepage_manifesto_p2", v)}
            placeholder="Paragraph 2"
            className="block font-serif text-lg leading-relaxed text-ink sm:text-xl"
          />
          <InlineText
            as="p"
            multiline
            value={config.homepage_manifesto_p3 ?? ""}
            onCommit={(v) => commit("homepage_manifesto_p3", v)}
            placeholder="Paragraph 3"
            className="block font-serif text-lg leading-relaxed text-ink sm:text-xl"
          />
        </div>
      </section>

      {/* Stats — labels editable inline, values still numeric in Form view */}
      {stats.length > 0 && (
        <section className="border-t border-stone/15 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="px-4 py-6 text-center">
                  <InlineText
                    as="div"
                    value={s.value}
                    onCommit={(v) =>
                      commit(
                        "homepage_stats",
                        stats.map((x, j) => (j === i ? { ...x, value: v } : x)),
                      )
                    }
                    placeholder="—"
                    className="block font-serif text-4xl text-ink sm:text-5xl"
                  />
                  <InlineText
                    as="div"
                    value={s.label}
                    onCommit={(v) =>
                      commit(
                        "homepage_stats",
                        stats.map((x, j) => (j === i ? { ...x, label: v } : x)),
                      )
                    }
                    placeholder="Label"
                    className="mt-2 block text-[10.5px] uppercase tracking-[0.22em] text-mid"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border-t border-stone/15 px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <InlineText
            as="h2"
            multiline
            value={config.newsletter_heading ?? ""}
            onCommit={(v) => commit("newsletter_heading", v)}
            placeholder="Newsletter heading"
            className="block font-serif text-3xl leading-tight text-ink sm:text-4xl"
          />
          <InlineText
            as="p"
            value={config.newsletter_subline ?? ""}
            onCommit={(v) => commit("newsletter_subline", v)}
            placeholder="Newsletter subline"
            className="mt-5 block text-base text-mid sm:text-lg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone/20 px-6 py-10 text-center">
        <p className="font-serif text-4xl lowercase text-ink">trovr</p>
        <InlineText
          as="p"
          value={config.footer_text ?? ""}
          onCommit={(v) => commit("footer_text", v)}
          placeholder="Tagline / copyright"
          className="mt-3 block text-xs tracking-wide text-mid"
        />
      </footer>
    </div>
  );
}
