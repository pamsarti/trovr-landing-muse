import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InquireForm } from "@/components/trips/InquireForm";
import { TRIP_PRESENTATION } from "@/lib/trip-presentation";
import { TRIP_HERO_PHOTOS } from "@/lib/trip-hero-photos";
import {
  ACTIVITY_LABEL,
  durationLabel,
  findTrip,
  ALL_TRIPS,
  tripImage,
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
    <main className="bg-paper text-ink font-sans">
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
    <main className="bg-paper text-ink font-sans">
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
  const photo = copy ? TRIP_HERO_PHOTOS[trip.id] : undefined;
  const related = copy ? [] : relatedFor(trip);

  return (
    <main className="experience-site bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" experience />

      <div className="w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-stone/10">
          <img
            src={photo?.src ?? tripImage(trip)}
            alt={photo?.alt ?? trip.destination}
            data-photo={photo?.src.split("/").pop()?.split(".")[0]}
            style={{ objectPosition: photo?.objectPosition }}
            className={copy?.soon ? "experience-photo-muted h-full w-full object-cover" : "h-full w-full object-cover"}
          />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link to="/trips" className="mb-5 inline-block underline">← Todas as experiências</Link>
        {copy?.soon && <p className="mb-3 text-sm">Em breve</p>}
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {(copy ? [copy.place, copy.type] : [trip.country, ACTIVITY_LABEL[trip.activity]]).filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {copy?.title ?? trip.destination}
        </h1>
        <p className="mt-8 font-serif text-lg leading-relaxed text-ink/90 sm:text-xl">
          {copy?.summary ?? trip.detail}
        </p>

        {copy ? (
          <>
            <a href="#interesse" className="experience-button mt-6">
              {copy.soon ? "Quero receber novidades" : "Conversar sobre esta viagem"}
            </a>
            <section className="mt-9"><h2>O que você vai viver</h2><p>{copy.scene}</p></section>
            <section className="mt-9"><h2>O que vale saber</h2><p>{copy.practical}</p></section>
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
