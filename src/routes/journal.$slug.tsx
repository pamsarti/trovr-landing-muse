import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CATEGORY_LABEL,
  findArticle,
  formatDate,
  getPublishedArticles,
  renderBody,
  type JournalArticle,
} from "@/lib/journal-data";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    const title = a ? `${a.title} — Trovr Journal` : "Journal — Trovr";
    const desc = a?.dek ?? "Field notes from the places we send people.";
    const url = `/journal/${params.slug}`;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
    ];
    if (a?.heroImage) {
      meta.push({ property: "og:image", content: a.heroImage });
      meta.push({ name: "twitter:image", content: a.heroImage });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: a
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: a.title,
                description: a.dek,
                image: a.heroImage,
                datePublished: a.date,
                author: { "@type": "Person", name: a.author },
              }),
            },
          ]
        : undefined,
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: ArticlePage,
});

function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-32 text-center sm:py-40">
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">Not found.</h1>
        <p className="mt-5 font-serif italic text-stone">
          That entry isn't in the journal.
        </p>
        <Link
          to="/journal"
          className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-ink underline-offset-4 hover:underline"
        >
          ← Back to Journal
        </Link>
      </section>
    </main>
  );
}

function ErrorView() {
  return <NotFound />;
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const all = getPublishedArticles();
  const others = all.filter((a) => a.id !== article.id);
  const sameCategory = others.filter((a) => a.category === article.category);
  const readNext = (sameCategory.length >= 2 ? sameCategory : others).slice(0, 2);

  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />

      <article>
        <header className="mx-auto max-w-3xl px-6 pt-16 sm:pt-24">
          <nav className="text-[11px] uppercase tracking-[0.2em] text-stone">
            <Link to="/journal" className="hover:text-ink">
              Journal
            </Link>
            <span className="mx-2">/</span>
            <span>{CATEGORY_LABEL[article.category]}</span>
          </nav>

          <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-stone">
            {CATEGORY_LABEL[article.category]}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 font-serif text-xl italic leading-[1.4] text-stone sm:text-2xl">
            {article.dek}
          </p>
          <p className="mt-8 text-xs tracking-wide text-stone">
            {article.author} ·{" "}
            <time dateTime={article.date}>{formatDate(article.date)}</time> ·{" "}
            {article.readTime} min read
          </p>
        </header>

        <figure className="mx-auto mt-12 max-w-5xl px-0 sm:mt-16 sm:px-6">
          <div className="aspect-[16/9] overflow-hidden bg-stone/20">
            <img
              src={article.heroImage}
              alt={article.title}
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.7)" }}
            />
          </div>
        </figure>

        <div
          className="mx-auto max-w-[680px] px-6 pt-12 pb-16 sm:pt-16"
          dangerouslySetInnerHTML={{ __html: renderBody(article.body) }}
        />

        <div className="mx-auto max-w-[680px] px-6">
          <div className="font-serif text-stone">—</div>
          <div className="mt-6 flex items-start gap-4">
            <div
              aria-hidden
              className="h-12 w-12 shrink-0 bg-stone/30"
              style={{ borderRadius: 2 }}
            />
            <p className="text-sm leading-[1.6] text-stone">
              <span className="text-ink">{article.author}</span> writes for Trovr
              about places, gear, and the philosophy of immersive travel.
            </p>
          </div>
        </div>
      </article>

      {readNext.length > 0 && (
        <section className="mt-24 border-t border-stone/20 px-6 py-20 sm:mt-32 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              Read next
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
              {readNext.map((a) => (
                <ReadNextCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function ReadNextCard({ article }: { article: JournalArticle }) {
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
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
          style={{ filter: "saturate(0.7)" }}
        />
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-stone">
        {CATEGORY_LABEL[article.category]}
      </p>
      <h3 className="mt-3 font-serif text-2xl leading-[1.15] text-ink sm:text-3xl">
        {article.title}
      </h3>
      <p className="mt-2 font-serif text-base italic text-stone sm:text-lg">
        {article.dek}
      </p>
    </Link>
  );
}