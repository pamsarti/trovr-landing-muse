import { ImagePreview } from "@/components/admin/ImageUpload";
import { ACTIVITY_LABEL, type TripActivity } from "@/lib/trips-data";
import { priceSymbol } from "@/data/trip-editorials";

/**
 * In-process render of the public Trip Detail page, fed from the editor's
 * draft state (no server round-trip). Matches the visual structure of
 * src/routes/trips.$id.tsx but is independent of TanStack Router params.
 *
 * Markdown is rendered as plain paragraphs split on blank lines — good
 * enough for the editor preview without pulling in a full md renderer.
 */
export function TripPreview({ draft }: { draft: any }) {
  const activityLabel =
    ACTIVITY_LABEL[draft.activity as TripActivity] ?? draft.activity ?? "—";
  const paragraphs = String(draft.editorial_paragraph ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-paper text-ink font-sans antialiased">
      <div className="aspect-video w-full overflow-hidden bg-stone/10">
        {draft.hero_image_url ? (
          <ImagePreview path={draft.hero_image_url} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-stone">
            Hero image
          </div>
        )}
      </div>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {[draft.country, activityLabel, draft.duration_days, draft.level]
            .filter(Boolean)
            .join(" · ") || "country · activity · duration · level"}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {draft.destination || "Destination"}
        </h1>

        {paragraphs.length > 0 ? (
          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="font-serif text-lg leading-relaxed text-ink/90">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-8 font-serif text-lg leading-relaxed italic text-stone/70">
            Editorial paragraph will appear here.
          </p>
        )}

        <dl className="mt-10 grid grid-cols-1 gap-y-5 border-y border-stone/20 py-8 sm:grid-cols-2">
          <Fact label="Operator" value={draft.operator} />
          <Fact label="Season" value={draft.season} />
          <Fact label="Level" value={draft.level} />
          <Fact label="Duration" value={draft.duration_days} />
          <Fact label="Price range" value={priceSymbol(draft.price_range) || draft.price_range} />
        </dl>

        {Array.isArray(draft.photo_urls) && draft.photo_urls.filter(Boolean).length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-3">
            {draft.photo_urls.filter(Boolean).slice(0, 3).map((p: string, i: number) => (
              <div key={i} className="aspect-square overflow-hidden bg-stone/10">
                {/^https?:\/\//i.test(p) ? (
                  <img src={p} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImagePreview path={p} className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">{label}</dt>
      <dd className="mt-2 font-serif text-base text-ink">
        {value ? String(value) : <span className="italic text-stone/60">—</span>}
      </dd>
    </div>
  );
}
