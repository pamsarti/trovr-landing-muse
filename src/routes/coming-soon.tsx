import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Coming Soon — Trovr" },
      { name: "description", content: "This expedition is coming soon." },
    ],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-stone">Trovr expeditions</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-ink sm:text-7xl">
          Coming soon…
        </h1>
        <p className="mt-8 max-w-xl font-serif text-lg italic text-ink/80 sm:text-xl">
          We're still shaping this one. Leave your email on the homepage and you'll be the first to know when it opens.
        </p>
        <Link
          to="/"
          className="mt-12 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}