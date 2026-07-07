import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  findContinent,
  findRegion,
  findSpot,
  validateSpotsSearch,
} from "@/lib/spots-data";
import { ACTIVITIES } from "@/lib/spots-data";
import {
  Breadcrumbs,
  SpotsFooter,
  SpotsHeader,
} from "@/components/spots/SpotsChrome";

export const Route = createFileRoute("/spots/$continent/$region/$spot")({
  validateSearch: validateSpotsSearch,
  loaderDeps: ({ search }) => ({ activity: search.activity }),
  head: ({ params, loaderData }) => {
    const activity =
      (loaderData as { activity?: ReturnType<typeof validateSpotsSearch>["activity"] } | undefined)
        ?.activity ?? "kite";
    const continent = findContinent(activity, params.continent);
    const region = continent ? findRegion(activity, continent.name, params.region) : null;
    const spot =
      continent && region
        ? findSpot(activity, continent.name, region.name, params.spot)
        : null;
    const title = spot
      ? `${spot.name} — ${region?.name} | Trovr`
      : "Spot | Trovr";
    const description = spot?.description
      ? spot.description.slice(0, 160)
      : `Spot in ${region?.name ?? ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params, deps }) => {
    const { activity } = deps;
    const continent = findContinent(activity, params.continent);
    if (!continent) throw notFound();
    const region = findRegion(activity, continent.name, params.region);
    if (!region) throw notFound();
    const spot = findSpot(activity, continent.name, region.name, params.spot);
    if (!spot) throw notFound();
    return { activity, continent, region, spot };
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
  const { activity, continent, region, spot } = Route.useLoaderData() as {
    activity: ReturnType<typeof validateSpotsSearch>["activity"];
    continent: NonNullable<ReturnType<typeof findContinent>>;
    region: NonNullable<ReturnType<typeof findRegion>>;
    spot: NonNullable<ReturnType<typeof findSpot>>;
  };

  return (
    <main className="bg-paper text-ink font-sans antialiased min-h-screen">
      <SpotsHeader />
      <Breadcrumbs
        items={[
          {
            label: "Spots",
            to: (
              <Link to="/spots" search={{ activity }} className="hover:text-ink">
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
                search={{ activity }}
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
                search={{ activity }}
                className="hover:text-ink"
              >
                {region.name}
              </Link>
            ),
          },
          { label: spot.name },
        ]}
      />

      <SpotCard spot={spot} continent={continent} region={region} activity={activity} />

      <SpotsFooter />
    </main>
  );
}