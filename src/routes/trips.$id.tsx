import { KiteTripPage } from "@/components/trips/KiteTripPage";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InquireForm } from "@/components/trips/InquireForm";
import { TRIP_PRESENTATION } from "@/lib/trip-presentation";
import { TripOpening } from "@/components/trips/TripOpening";
import {
  durationLabel,
  findTrip,
  ALL_TRIPS,
  type Trip,
} from "@/lib/trips-data";
import { TripsHeader, TripsFooter, TripCard } from "@/components/trips/TripsChrome";
import { useT } from "@/i18n/useT";

export const Route = createFileRoute("/trips/$id")({
  loader: ({ params }) => {
    const trip = findTrip(params.id);
    if (!trip) throw notFound();
    return { trip };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.trip.seoTitle },
          { name: "description", content: loaderData.trip.seoDescription },
        ]
      : [],
  }),
  notFoundComponent: TripNotFound,
  errorComponent: TripLoadError,
  component: TripDetail,
});

function TripNotFound() {
  const t = useT();
  return (
    <main className="trovr-public bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">{t.inquiry.notFound}</h1>
        <Link to="/viagem" className="mt-6 inline-block text-stone underline">
          Conhecer a Viagem Trovr
        </Link>
      </div>
      <TripsFooter />
    </main>
  );
}

function TripLoadError({ reset }: { reset: () => void }) {
  const t = useT();
  return (
    <main className="trovr-public bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">{t.inquiry.loadError}</h1>
        <button onClick={reset} className="mt-6 text-stone underline">
          {t.inquiry.tryAgain}
        </button>
      </div>
      <TripsFooter />
    </main>
  );
}

function relatedFor(trip: Trip, n = 3): Trip[] {
  const others = ALL_TRIPS.filter((t) => t.id !== trip.id);
  const sameActivityDiffCountry = others.filter(
    (t) => t.activity === trip.activity && t.country !== trip.country,
  );
  const sameContinentDiffActivity = others.filter(
    (t) => t.continent === trip.continent && t.activity !== trip.activity,
  );
  const picked: Trip[] = [];
  const push = (t: Trip) => {
    if (picked.length < n && !picked.find((p) => p.id === t.id)) picked.push(t);
  };
  sameActivityDiffCountry.forEach(push);
  sameContinentDiffActivity.forEach(push);
  others.forEach(push);
  return picked.slice(0, n);
}

function TripDetail() {
  const { trip } = Route.useLoaderData() as { trip: Trip };
  const t = useT();
  const copy = TRIP_PRESENTATION[trip.id];
  const related = copy ? [] : relatedFor(trip);

  if (trip.id === "kite-a-bordo") return <KiteTripPage trip={trip} />;

  return (
    <main className="trovr-public experience-site bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" experience transparent />

      <TripOpening trip={trip} />

      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link to="/trips" className="mb-5 inline-block underline">← Todas as experiências</Link>
        {copy ? (
          <>
            <section className="mt-9"><h2>O que você vai viver</h2><p>{copy.scene}</p></section>
            <section className="mt-9"><h2>O que vale saber</h2><p>{copy.practical}</p></section>
            <dl className="trip-planning-facts mt-9 grid gap-6 border-y border-stone/20 py-7 sm:grid-cols-2">
              <Fact label="Temporada" value={copy.season ?? "A consultar"} />
              <Fact label="Duração" value={copy.duration ?? "A combinar"} />
            </dl>
            <section className="mt-9"><h2>Como imaginar seus dias</h2><p>{copy.days}</p></section>
            <section className="mt-9"><h2>Da vontade ao planejamento</h2><p>{copy.planning}</p></section>
            {copy.story && (
              <section className="mt-9">
                <h2>Providencia no Diário de Campo</h2>
                <p>A Pamela conta como chegou à ilha e como foi sair de barco para mergulhar em Providencia.</p>
                <Link to="/journal/$slug" params={{ slug: "providencia-colombia-island-guide" }} className="mt-3 inline-block underline">Ler o relato de Providencia →</Link>
              </section>
            )}
          </>
        ) : (
          <dl className="mt-12 grid grid-cols-2 gap-x-6 border-y border-stone/20 py-7">
            <Fact label={t.inquiry.factSeason} value={trip.season} />
            <Fact label={t.inquiry.factDuration} value={durationLabel(trip)} />
          </dl>
        )}
        <InquireForm tripId={trip.id} tripName={copy?.title ?? trip.destination} operator={trip.operator} soon={copy?.soon} />
      </article>

      {related.length > 0 && (
        <section className="border-t border-stone/15 px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">{t.inquiry.tripsLikeThis}</h2>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <TripCard key={t.id} trip={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <TripsFooter />
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">{label}</dt>
      <dd className="mt-2 font-serif text-base text-ink">{value || "A consultar"}</dd>
    </div>
  );
}
