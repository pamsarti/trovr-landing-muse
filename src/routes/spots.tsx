import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/spots")({
  head: () => ({
    meta: [
      { title: "Spots — Trovr" },
      {
        name: "description",
        content:
          "A growing guide to the world's best kitesurf spots. Conditions, seasons, and editorial notes from people who've been there. Coming soon.",
      },
      { property: "og:title", content: "Spots — Trovr" },
      {
        property: "og:description",
        content: "A growing guide to the world's best kitesurf spots. Coming soon.",
      },
    ],
    links: [{ rel: "canonical", href: "/spots" }],
  }),
  component: SpotsPage,
});

function SpotsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink font-sans antialiased flex flex-col">
      <Header />
      <section className="flex-1 flex items-center justify-center px-6 py-32 sm:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone">
            Spots — Coming soon
          </p>
          <h1 className="mt-8 font-serif text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl">
            A guide to the places worth the journey.
          </h1>
          <p className="mx-auto mt-10 max-w-xl font-serif text-xl italic leading-[1.5] text-stone sm:text-2xl">
            We're still writing it.
          </p>
          <p className="mx-auto mt-8 max-w-xl text-base leading-[1.75] text-ink/85">
            Conditions, seasons, where to stay, and the operators we'd actually send a friend to — all in one place. Kitesurfing first. Then everything else that asks something of you.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center border border-ink/80 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Leave your email
            </Link>
            <Link
              to="/about"
              className="text-[11px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ink"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-stone/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">
          trovr
        </Link>
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/spots"
            className="text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:text-ink"
          >
            Spots
          </Link>
          <Link
            to="/about"
            className="text-[11px] uppercase tracking-[0.2em] text-stone transition-colors hover:text-ink"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone/15">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 sm:flex-row sm:items-center">
        <p className="font-serif text-xl lowercase text-ink">trovr</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          Launching Fall 2026
        </p>
      </div>
    </footer>
  );
}
