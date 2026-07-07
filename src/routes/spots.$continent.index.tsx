import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  findContinent,
  getRegions,
  validateSpotsSearch,
  type RegionGroup,
} from "@/lib/spots-data";
import {
  Breadcrumbs,
  SpotsFooter,
  SpotsHeader,
  ActivitySelector,
} from "@/components/spots/SpotsChrome";

export const Route = createFileRoute("/spots/$continent/")({
  validateSearch: validateSpotsSearch,
  loaderDeps: ({ search }) => ({ activity: search.activity }),
  head: ({ params, loaderData }) => {
    const activity =
      (loaderData as { activity?: ReturnType<typeof validateSpotsSearch>["activity"] } | undefined)
        ?.activity;
    const continent = findContinent(activity, params.continent);
    const title = continent ? `${continent.name} — Spots | Trovr` : "Spots | Trovr";
    const description = continent
      ? `Spots across ${continent.name}. ${continent.count} regions and locations to explore.`
      : "Spots guide.";
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
    return { activity, continent, regions: getRegions(activity, continent.name) };
  },
  component: ContinentPage,
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Continent not found.</h1>
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

function ContinentPage() {
  const { activity, continent, regions } = Route.useLoaderData() as {
    activity: ReturnType<typeof validateSpotsSearch>["activity"];
    continent: NonNullable<ReturnType<typeof findContinent>>;
    regions: RegionGroup[];
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
          { label: continent.name },
        ]}
      />

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {continent.name}
          </h1>
          <p className="mt-5 text-base text-stone sm:text-lg">
            {continent.count} spots across {regions.length} regions.
          </p>
        </div>
      </section>

      <ActivitySelector current={activity} />

      <section className="px-6 pb-24">
        <ul className="mx-auto max-w-3xl divide-y divide-stone/15 border-y border-stone/15">
          {regions.map((r: RegionGroup) => (
            <li key={r.slug}>
              <Link
                to="/spots/$continent/$region"
                params={{ continent: continent.slug, region: r.slug }}
                search={{ activity }}
                className="group flex items-baseline justify-between gap-6 py-6 transition-colors hover:bg-stone/5"
              >
                <span className="font-serif text-2xl text-ink sm:text-3xl">{r.name}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-stone group-hover:text-ink">
                  {r.count} {r.count === 1 ? "spot" : "spots"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <SpotsFooter />
    </main>
  );
}