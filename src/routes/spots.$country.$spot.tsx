import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/spots/$country/$spot")({
  head: ({ params }) => ({
    meta: [
      { title: `${titleize(params.spot)}, ${titleize(params.country)} — Trovr` },
      {
        name: "description",
        content: `Spot guide for ${titleize(params.spot)}, ${titleize(params.country)}.`,
      },
    ],
  }),
  component: SpotDetailPage,
});

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function SpotDetailPage() {
  const { country, spot } = Route.useParams();
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <header className="border-b border-stone/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
          <Link to="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">trovr</Link>
          <Link
            to="/spots"
            className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
          >
            Back to spots
          </Link>
        </div>
      </header>
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone">{titleize(country)}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {titleize(spot)}
          </h1>
          <p className="mt-8 font-serif text-xl italic text-stone sm:text-2xl">
            Spot guide coming soon.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-ink/85">
            We're still writing this one. Conditions, seasonality, where to stay, and the operators we'd send a friend to — all in one place. Check back, or leave your email on the home page and we'll let you know when it's live.
          </p>
        </div>
      </section>
    </main>
  );
}