import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/i18n/useT";
import { seoT } from "@/i18n/seoT";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/coming-soon")({
  loader: ({ context }) => ({ locale: (context as { locale?: Locale }).locale }),
  head: ({ loaderData }) => {
    const t = seoT(loaderData?.locale);
    return {
      meta: [
        { title: t.seo.comingSoonTitle },
        { name: "description", content: t.seo.comingSoonDescription },
      ],
    };
  },
  component: ComingSoon,
});

function ComingSoon() {
  const t = useT();
  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone">{t.comingSoon.kicker}</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-ink sm:text-7xl">
          {t.comingSoon.headline}
        </h1>
        <p className="mt-8 max-w-xl font-serif text-lg italic text-ink/80 sm:text-xl">
          {t.comingSoon.body}
        </p>
        <Link
          to="/"
          className="mt-12 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {t.comingSoon.backHome}
        </Link>
      </section>
    </main>
  );
}
