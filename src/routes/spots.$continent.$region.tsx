import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import {
  findContinent,
  findRegion,
  getSpotsInRegion,
  placeLabel,
  slugify,
  validateSpotsSearch,
  type Spot,
} from "@/lib/spots-data";
import {
  Breadcrumbs,
  SpotsFooter,
  SpotsHeader,
  ActivitySelector,
} from "@/components/spots/SpotsChrome";
import { ACTIVITIES } from "@/lib/spots-data";

export const Route = createFileRoute("/spots/$continent/$region")({
  validateSearch: validateSpotsSearch,
  loaderDeps: ({ search }) => ({ activity: search.activity }),
  head: ({ params, loaderData }) => {
    const activity = (
      loaderData as { activity?: ReturnType<typeof validateSpotsSearch>["activity"] } | undefined
    )?.activity;
    const continent = findContinent(activity, params.continent);
    const region = continent ? findRegion(activity, continent.name, params.region) : null;
    const title = region
      ? `${placeLabel(region.name)} — Lugares em ${placeLabel(continent?.name ?? "")} | Trovr`
      : "Lugares | Trovr";
    const description = region
      ? `Lugares em ${placeLabel(region.name)}, ${placeLabel(continent?.name ?? "")}. ${region.count} destinos.`
      : "Guia de lugares.";
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
    return {
      activity,
      continent,
      region,
      spots: getSpotsInRegion(activity, continent.name, region.name),
    };
  },
  component: RegionLayout,
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Região não encontrada.</h1>
        <Link
          to="/spots"
          className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
        >
          Voltar para todos os lugares
        </Link>
      </section>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="bg-paper text-ink font-sans min-h-screen">
      <SpotsHeader />
      <section className="px-6 py-32 text-center">
        <h1 className="font-serif text-3xl text-ink">Algo deu errado.</h1>
        <p className="mt-3 text-sm text-stone">{error.message}</p>
      </section>
    </main>
  ),
});

function RegionLayout() {
  const { activity, continent, region, spots } = Route.useLoaderData() as {
    activity: ReturnType<typeof validateSpotsSearch>["activity"];
    continent: NonNullable<ReturnType<typeof findContinent>>;
    region: NonNullable<ReturnType<typeof findRegion>>;
    spots: Spot[];
  };

  return (
    <main className="bg-paper text-ink font-sans antialiased min-h-screen">
      <SpotsHeader />
      <Breadcrumbs
        items={[
          {
            label: "Lugares",
            to: (
              <Link to="/spots" search={{ activity }} className="hover:text-ink">
                Lugares
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
                {placeLabel(continent.name)}
              </Link>
            ),
          },
          { label: placeLabel(region.name) },
        ]}
      />

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            {placeLabel(region.name)}
          </h1>
          <p className="mt-5 text-base text-stone sm:text-lg">
            {region.count} {region.count === 1 ? "lugar" : "lugares"} em{" "}
            {placeLabel(continent.name)}.
          </p>
        </div>
      </section>

      <ActivitySelector current={activity} />

      <section className="px-6 pb-24">
        <ul className="mx-auto max-w-3xl divide-y divide-stone/15 border-y border-stone/15">
          {spots.map((s: Spot) => (
            <li key={s.id}>
              <Link
                to="/spots/$continent/$region/$spot"
                params={{
                  continent: continent.slug,
                  region: region.slug,
                  spot: slugify(s.name),
                }}
                search={{ activity }}
                className="group block py-6 transition-colors hover:bg-stone/5"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-serif text-2xl text-ink sm:text-3xl">{s.name}</span>
                  <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-stone">
                    {s.country && s.country !== region.name && <span>{placeLabel(s.country)}</span>}
                    <span
                      className="border border-stone/40 px-2 py-1 text-ink"
                      style={{ borderRadius: 2 }}
                    >
                      {ACTIVITIES.find((a) => a.id === s.activity)?.label ?? s.activity}
                    </span>
                  </span>
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

      {/* Nested $spot route renders the SpotPanel here as an overlay. */}
      <Outlet />
    </main>
  );
}
