import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findContinent, findRegion, findSpot } from "@/lib/spots-data";
import {
  Breadcrumbs,
  SpotsFooter,
  SpotsHeader,
} from "@/components/spots/SpotsChrome";

export const Route = createFileRoute("/spots/$continent/$region/$spot")({
  head: ({ params }) => {
    const continent = findContinent("kite", params.continent);
    const region = continent ? findRegion("kite", continent.name, params.region) : null;
    const spot =
      continent && region
        ? findSpot("kite", continent.name, region.name, params.spot)
        : null;
    const title = spot
      ? `${spot.name} — ${region?.name} | Trovr`
      : "Spot | Trovr";
    const description = spot?.description
      ? spot.description.slice(0, 160)
      : `Kitesurf spot in ${region?.name ?? ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    const continent = findContinent("kite", params.continent);
    if (!continent) throw notFound();
    const region = findRegion("kite", continent.name, params.region);
    if (!region) throw notFound();
    const spot = findSpot("kite", continent.name, region.name, params.spot);
    if (!spot) throw notFound();
    return { continent, region, spot };
  },
  component: SpotPage,
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Spot not found.</h1>
        <Link
          to="/spots"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
        >
          Back to all spots
        </Link>
      </section>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Something went wrong.</h1>
        <p className="mt-3 text-sm text-stone">{error.message}</p>
      </section>
    </main>
  ),
});

function SpotPage() {
  const { continent, region, spot } = Route.useLoaderData();

  return (
    <main className="bg-paper text-ink font-sans antialiased min-h-screen">
      <SpotsHeader />
      <Breadcrumbs
        items={[
          {
            label: "Spots",
            to: (
              <Link to="/spots" className="hover:text-ink">
                Spots
              </Link>
            ),
          },
          {
            label: continent.name,
            to: (
              <Link
                to="/spots/$continent"
                params={{ continent: continent.slug }}
                className="hover:text-ink"
              >
                {continent.name}
              </Link>
            ),
          },
          {
            label: region.name,
            to: (
              <Link
                to="/spots/$continent/$region"
                params={{ continent: continent.slug, region: region.slug }}
                className="hover:text-ink"
              >
                {region.name}
              </Link>
            ),
          },
          { label: spot.name },
        ]}
      />

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
            {region.name} · {continent.name}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {spot.name}
          </h1>

          {spot.description && (
            <p className="mt-8 font-serif text-xl leading-[1.5] text-ink sm:text-2xl">
              {spot.description}
            </p>
          )}

          <p className="mt-12 text-sm italic text-stone">
            Full guide coming soon — conditions, seasons, and editorial notes.
          </p>

          <div className="mt-10">
            <Link
              to="/spots/$continent/$region"
              params={{ continent: continent.slug, region: region.slug }}
              className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
            >
              ← Back to {region.name}
            </Link>
          </div>
        </div>
      </section>

      <SpotsFooter />
    </main>
  );
}