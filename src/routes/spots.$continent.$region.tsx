import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  findContinent,
  findRegion,
  getSpotsInRegion,
  slugify,
} from "@/lib/spots-data";
import {
  Breadcrumbs,
  SpotsFooter,
  SpotsHeader,
} from "@/components/spots/SpotsChrome";

export const Route = createFileRoute("/spots/$continent/$region")({
  head: ({ params }) => {
    const continent = findContinent("kite", params.continent);
    const region = continent ? findRegion("kite", continent.name, params.region) : null;
    const title = region
      ? `${region.name} — ${continent?.name} Spots | Trovr`
      : "Spots | Trovr";
    const description = region
      ? `Kitesurf spots in ${region.name}, ${continent?.name}. ${region.count} locations.`
      : "Kitesurf spots guide.";
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
    return {
      continent,
      region,
      spots: getSpotsInRegion("kite", continent.name, region.name),
    };
  },
  component: RegionPage,
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Region not found.</h1>
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

function RegionPage() {
  const { continent, region, spots } = Route.useLoaderData();

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
          { label: region.name },
        ]}
      />

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {region.name}
          </h1>
          <p className="mt-5 text-base text-stone sm:text-lg">
            {region.count} {region.count === 1 ? "spot" : "spots"} in {continent.name}.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <ul className="mx-auto max-w-3xl divide-y divide-stone/15 border-y border-stone/15">
          {spots.map((s) => (
            <li key={s.id}>
              <Link
                to="/spots/$continent/$region/$spot"
                params={{
                  continent: continent.slug,
                  region: region.slug,
                  spot: slugify(s.name),
                }}
                className="group block py-6 transition-colors hover:bg-stone/5"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-serif text-2xl text-ink sm:text-3xl">
                    {s.name}
                  </span>
                  {s.country && s.country !== region.name && (
                    <span className="text-[11px] uppercase tracking-[0.2em] text-stone">
                      {s.country}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="mt-2 max-w-2xl text-sm leading-[1.6] text-stone sm:text-base">
                    {s.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SpotsFooter />
    </main>
  );
}