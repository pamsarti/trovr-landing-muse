import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import {
  findContinent,
  findRegion,
  findSpot,
  validateSpotsSearch,
} from "@/lib/spots-data";
import { SpotPanel } from "@/components/spots/SpotPanel";

export const Route = createFileRoute("/spots/$continent/$region/$spot")({
  validateSearch: validateSpotsSearch,
  loaderDeps: ({ search }) => ({ activity: search.activity }),
  head: ({ params, loaderData }) => {
    const activity =
      (loaderData as { activity?: ReturnType<typeof validateSpotsSearch>["activity"] } | undefined)
        ?.activity;
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
  component: SpotPanelRoute,
  notFoundComponent: () => null,
  errorComponent: () => null,
});

function SpotPanelRoute() {
  const { activity, continent, region, spot } = Route.useLoaderData();
  const router = useRouter();

  // Close by walking history back when possible (so browser Back and the X
  // share the same effect). If landed directly (no history to pop), navigate
  // explicitly up to the region layout — which keeps the panel from
  // reappearing on refresh and keeps the URL clean.
  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({
        to: "/spots/$continent/$region",
        params: { continent: continent.slug, region: region.slug },
        search: activity ? { activity } : {},
      });
    }
  };

  return (
    <SpotPanel
      spot={spot}
      continent={continent}
      region={region}
      activity={activity}
      onClose={handleClose}
    />
  );
}