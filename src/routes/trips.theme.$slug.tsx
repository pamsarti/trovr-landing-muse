import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findTheme, tripsByTheme } from "@/lib/trips-data";
import { TripsHeader, TripsFooter, TripCard } from "@/components/trips/TripsChrome";

export const Route = createFileRoute("/trips/theme/$slug")({
  loader: ({ params }) => {
    const theme = findTheme(params.slug);
    if (!theme) throw notFound();
    return { theme, trips: tripsByTheme(theme) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.theme.title} — Trovr` },
          { name: "description", content: loaderData.theme.subtitle },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Theme not found.</h1>
        <Link to="/trips" className="mt-6 inline-block text-stone underline">
          Back to all trips
        </Link>
      </div>
      <TripsFooter />
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main className="bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">This theme didn't load.</h1>
        <button onClick={reset} className="mt-6 text-stone underline">Try again</button>
      </div>
      <TripsFooter />
    </main>
  ),
  component: ThemePage,
});

function ThemePage() {
  const { theme, trips } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" />

      <section className="relative h-[60svh] w-full overflow-hidden bg-ink">
        <img
          src={theme.image}
          alt={theme.title}
          className="h-full w-full object-cover opacity-80"
          style={{ filter: "saturate(0.8)" }}
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-paper/80">Theme</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-paper sm:text-6xl">
            {theme.title}
          </h1>
          <p className="mt-4 font-serif text-lg italic text-paper/90 sm:text-xl">
            {theme.subtitle}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              {trips.length} {trips.length === 1 ? "trip" : "trips"}
            </p>
            <Link
              to="/trips"
              className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
            >
              ← All trips
            </Link>
          </div>
          {trips.length === 0 ? (
            <p className="mt-12 font-serif italic text-stone">No trips yet in this theme.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      <TripsFooter />
    </main>
  );
}