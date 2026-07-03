import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
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
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 sm:pt-28">
        <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
          Journal
        </h1>
        <p className="mt-5 max-w-xl text-base text-stone sm:text-lg">
          Field notes from the places we send people.
        </p>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
          <Featured article={featured} />
        </section>
      )}

      {rest.length > 0 && (
        <section className="border-t border-stone/20">
          <div className="mx-auto max-w-6xl divide-y divide-stone/20 px-6">
            {rest.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <div className="h-24 sm:h-32" />
    </main>
  );
}

function Featured({ article }: { article: JournalArticle }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className="group block"
    >
      <div className="aspect-[16/9] overflow-hidden bg-stone/20">
        <img
          src={article.heroImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
          style={{ filter: "saturate(0.7)" }}
        />
      </div>
      <div className="mt-8 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {CATEGORY_LABEL[article.category]}
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-[1.1] text-ink sm:text-5xl md:text-6xl">
          {article.title}
        </h2>
        <p className="mt-5 font-serif text-lg italic text-stone sm:text-xl">
          {article.dek}
        </p>
        <p className="mt-6 text-xs tracking-wide text-stone">
          {article.author} · {formatDate(article.date)} · {article.readTime} min read
        </p>
      </div>
    </Link>
  );
}

function ArticleRow({ article }: { article: JournalArticle }) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className="group grid grid-cols-[96px_1fr] gap-6 py-10 sm:grid-cols-[160px_1fr] sm:gap-10 sm:py-14"
    >
      <div className="aspect-square overflow-hidden bg-stone/20">
        <img
          src={article.heroImage}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
          style={{ filter: "saturate(0.7)" }}
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {CATEGORY_LABEL[article.category]}
        </p>
        <h3 className="mt-3 font-serif text-xl leading-[1.2] text-ink sm:text-3xl">
          {article.title}
        </h3>
        <p className="mt-2 hidden font-serif text-base italic text-stone sm:block sm:text-lg">
          {article.dek}
        </p>
        <p className="mt-3 text-xs tracking-wide text-stone">
          {formatDate(article.date)} · {article.readTime} min read
        </p>
      </div>
    </Link>
  );
}