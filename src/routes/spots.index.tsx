import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { getContinents, validateSpotsSearch } from "@/lib/spots-data";
import {
  ActivitySelector,
  SpotsFooter,
  SpotsHeader,
} from "@/components/spots/SpotsChrome";

// Client-only: react-simple-maps fetches a topology JSON at runtime.
const WorldMap = lazy(() =>
  import("@/components/spots/WorldMap").then((m) => ({ default: m.WorldMap })),
);

export const Route = createFileRoute("/spots/")({
  validateSearch: validateSpotsSearch,
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
  const { activity } = Route.useSearch();
  const continents = getContinents(activity);
  const total = continents.reduce((n, c) => n + c.count, 0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="bg-paper text-ink font-sans antialiased min-h-screen">
      <SpotsHeader />

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Where the wind takes you.
          </h1>
          <p className="mt-6 text-base leading-[1.6] text-stone sm:text-lg">
            A guide to {total} kitesurf spots across the world. Begin with a continent.
          </p>
        </div>
      </section>

      <section className="px-6 pb-4">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-stone">
            From the journal · pinned locations
          </p>
          {mounted ? (
            <Suspense
              fallback={
                <div className="aspect-[980/520] w-full border border-stone/15 bg-stone/5" />
              }
            >
              <WorldMap />
            </Suspense>
          ) : (
            <div className="aspect-[980/520] w-full border border-stone/15 bg-stone/5" />
          )}
        </div>
      </section>

      <ActivitySelector current={activity} />

      <section className="px-6 pb-24 pt-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {continents.map((c) => (
            <Link
              key={c.slug}
              to="/spots/$continent"
              params={{ continent: c.slug }}
              search={{ activity }}
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