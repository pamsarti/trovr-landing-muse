import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import {
  CATEGORY_LABEL,
  formatDate,
  getPublishedArticles,
  type JournalArticle,
} from "@/lib/journal-data";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — Trovr" },
      {
        name: "description",
        content: "Field notes from the places we send people.",
      },
      { property: "og:title", content: "Journal — Trovr" },
      {
        property: "og:description",
        content: "Field notes from the places we send people.",
      },
      { property: "og:url", content: `${SITE_URL}/journal` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Journal — Trovr" },
      {
        name: "twitter:description",
        content: "Field notes from the places we send people.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/journal` }],
  }),
  component: JournalPage,
});

function JournalPage() {
  const articles = getPublishedArticles();
  const [featured, ...rest] = articles;

  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />

      {/* Editorial intro — the calm beat before the scene. */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
        <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
          Journal
        </h1>
        <p className="mt-5 max-w-xl text-base text-stone sm:text-lg">
          Field notes from the places we send people.
        </p>
      </section>

      {/* One story, full screen. */}
      {featured && <Featured article={featured} />}

      {/* Then the rest, scannable. */}
      {rest.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone/20 pb-5">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              More from the field.
            </h2>
            <span className="text-[11px] uppercase tracking-[0.2em] text-sage">
              {rest.length} {rest.length === 1 ? "story" : "stories"}
            </span>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-14 sm:mt-14 sm:grid-cols-2">
            {rest.map((a, i) => (
              <Reveal key={a.id} delay={(i % 2) * 80}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/**
 * The featured story runs full-bleed: the place fills the screen and drifts,
 * so the reader meets it before they read about it. The desaturation used on
 * the thumbnails is dropped here on purpose — this one has to look alive.
 */
function Featured({ article }: { article: JournalArticle }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className="group relative block h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <img
        src={article.heroImage}
        alt={article.title}
        className="ken-burns absolute inset-0 h-full w-full object-cover"
      />
      {/* Scrim: keeps the serif legible over any photograph. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/30 bg-paper/10 px-3 py-1 backdrop-blur">
            <span
              aria-hidden
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper"
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-paper">
              {CATEGORY_LABEL[article.category]}
            </span>
          </span>

          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.02] text-paper sm:text-6xl md:text-7xl">
            {article.title}
          </h2>
          <p className="mt-5 max-w-xl font-serif text-lg italic text-paper/85 sm:text-xl">
            {article.dek}
          </p>
          <p className="mt-6 text-xs tracking-wide text-paper/70">
            {article.author} · {formatDate(article.date)} · {article.readTime} min
            read
          </p>

          <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-ink transition-colors group-hover:bg-sage group-hover:text-paper">
            Read the story
            <span
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: JournalArticle }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className="group block"
    >
      <div className="aspect-[3/2] overflow-hidden bg-stone/20">
        <img
          src={article.heroImage}
          alt={article.title}
          loading="lazy"
          className="card-img h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          style={{ filter: "saturate(0.7)" }}
        />
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-sage">
        {CATEGORY_LABEL[article.category]}
      </p>
      <h3 className="mt-2 font-serif text-2xl leading-[1.15] text-ink transition-colors group-hover:text-sage sm:text-3xl">
        {article.title}
      </h3>
      <p className="mt-3 font-serif text-base italic text-stone sm:text-lg">
        {article.dek}
      </p>
      <p className="mt-4 text-xs tracking-wide text-stone">
        {formatDate(article.date)} · {article.readTime} min read
      </p>
    </Link>
  );
}