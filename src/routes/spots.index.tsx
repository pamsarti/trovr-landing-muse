import { createFileRoute, Link } from "@tanstack/react-router";
import { getContinents } from "@/lib/spots-data";
import {
  ActivitySelector,
  SpotsFooter,
  SpotsHeader,
} from "@/components/spots/SpotsChrome";

export const Route = createFileRoute("/spots/")({
  head: () => ({
    meta: [
      { title: "Spots — A guide to the world's kitesurf spots | Trovr" },
      {
        name: "description",
        content:
          "Explore 691 kitesurf spots across eight continents. An editorial guide for travelers who follow the wind.",
      },
      { property: "og:title", content: "Spots — Trovr" },
      {
        property: "og:description",
        content:
          "Explore 691 kitesurf spots across eight continents. An editorial guide for travelers who follow the wind.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SpotsIndex,
});

function SpotsIndex() {
  const continents = getContinents("kite");
  const total = continents.reduce((n, c) => n + c.count, 0);

  return (
    <main className="bg-paper text-ink font-sans antialiased min-h-screen">
      <SpotsHeader />

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Where the wind takes you.
          </h1>
          <p className="mt-6 text-base leading-[1.6] text-stone sm:text-lg">
            A guide to {total} kitesurf spots across the world. Begin with a continent.
          </p>
        </div>
      </section>

      <ActivitySelector current="kite" />

      <section className="px-6 pb-24 pt-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {continents.map((c) => (
            <Link
              key={c.slug}
              to="/spots/$continent"
              params={{ continent: c.slug }}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone/20">
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                    style={{ filter: "saturate(0.45) brightness(0.85)" }}
                  />
                )}
                <div className="absolute inset-0 bg-ink/15" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-serif text-3xl text-paper sm:text-4xl">{c.name}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-paper/80">
                    {c.count} spots
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SpotsFooter />
    </main>
  );
}