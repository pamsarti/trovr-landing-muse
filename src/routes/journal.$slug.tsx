import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  CATEGORY_LABEL,
  findArticle,
  formatDate,
  getPublishedArticles,
  renderBody,
  type JournalArticle,
  type JournalKeyFact,
} from "@/lib/journal-data";

const SITE_URL = "https://trovr.com.br";

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    const a = loaderData?.article;
    const title = a
      ? a.seoTitle ?? `${a.title} — Trovr Journal`
      : "Journal — Trovr";
    const desc =
      a?.seoDescription ?? a?.dek ?? "Field notes from the places we send people.";
    const path = `/journal/${params.slug}`;
    const url = absoluteUrl(path);
    const image = a ? a.ogImage ?? a.heroImage : undefined;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }

    const ldScripts: Array<{ type: string; children: string }> = [];
    if (a) {
      ldScripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.seoDescription ?? a.dek,
          image: image ? [image] : undefined,
          datePublished: a.date,
          dateModified: a.date,
          author: { "@type": "Person", name: a.author },
          publisher: {
            "@type": "Organization",
            name: "Trovr",
            url: SITE_URL,
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        }),
      });
      ldScripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Journal",
              item: absoluteUrl("/journal"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: a.title,
              item: url,
            },
          ],
        }),
      });
      if (a.faq && a.faq.length > 0) {
        ldScripts.push({
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: a.faq.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        });
      }
    }

    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: ldScripts.length ? ldScripts : undefined,
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
  const { article } = Route.useLoaderData() as { article: JournalArticle };
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

        {article.keyFacts && article.keyFacts.length > 0 && (
          <aside
            aria-label="Key facts"
            className="mx-auto mt-12 max-w-[680px] px-6 sm:mt-16"
          >
            <div className="border border-stone/30 bg-ink/[0.02] p-6 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
                At a glance
              </p>
              <ul className="mt-4 space-y-2">
                {article.keyFacts.map((f, i) => {
                  const fact: JournalKeyFact =
                    typeof f === "string" ? { value: f } : f;
                  return (
                    <li
                      key={i}
                      className="font-serif text-base leading-[1.6] text-ink sm:text-lg"
                    >
                      {fact.label ? (
                        <>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-stone">
                            {fact.label}
                          </span>
                          <span className="mx-2 text-stone">·</span>
                          <span>{fact.value}</span>
                        </>
                      ) : (
                        fact.value
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        <div
          className="journal-body mx-auto max-w-[680px] px-6 pt-12 pb-16 sm:pt-16 [&_p]:my-6 [&_p]:font-serif [&_p]:text-lg [&_p]:leading-[1.75] [&_p]:text-ink sm:[&_p]:text-[19px] [&_h2]:mt-16 [&_h2]:mb-5 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink sm:[&_h2]:text-3xl [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-ink [&_blockquote]:my-10 [&_blockquote]:border-l-2 [&_blockquote]:border-stone/50 [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:leading-[1.6] [&_blockquote]:text-ink sm:[&_blockquote]:text-xl [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:font-serif [&_ul]:text-lg [&_ul]:leading-[1.75] [&_ul]:text-ink [&_li]:my-2 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-ink hover:[&_a]:text-stone [&_strong]:text-ink [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: renderBody(article.body) }}
        />

        {article.faq && article.faq.length > 0 && (
          <section
            aria-label="Frequently asked questions"
            className="mx-auto max-w-[680px] px-6 pb-16"
          >
            <h2 className="mt-4 mb-6 font-serif text-2xl text-ink sm:text-3xl">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-stone/20 border-y border-stone/20">
              {article.faq.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-lg text-ink sm:text-xl">
                    <span>{item.question}</span>
                    <span
                      aria-hidden
                      className="mt-1 text-stone transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 font-serif text-base leading-[1.7] text-stone sm:text-lg">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

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