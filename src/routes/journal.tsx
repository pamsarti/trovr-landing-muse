import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Trovr" },
      { name: "description", content: "Field notes, dispatches, and stories from the road." },
      { property: "og:title", content: "Journal — Trovr" },
      { property: "og:description", content: "Field notes, dispatches, and stories from the road." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-32 text-center sm:py-40">
        <h1 className="font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Journal.
        </h1>
        <p className="mt-6 font-serif text-lg italic text-stone">
          Field notes are on the way. Check back soon.
        </p>
      </section>
    </main>
  );
}