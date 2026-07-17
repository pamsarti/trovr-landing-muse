import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ACTIVITY_LABEL,
  durationLabel,
  findTrip,
  ALL_TRIPS,
  tripExtraImages,
  tripImage,
  type Trip,
} from "@/lib/trips-data";
import { editorialFor, priceSymbol } from "@/data/trip-editorials";
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
          { title: `${loaderData.trip.destination} — Trovr` },
          { name: "description", content: loaderData.trip.summary },
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
        <Link to="/trips" className="mt-6 inline-block text-stone underline">
          Back to all trips
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
  const extra = tripExtraImages(trip);
  const related = relatedFor(trip);

  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" />

      <div className="w-full">
        <div className="aspect-video w-full overflow-hidden bg-stone/10">
          <img
            src={tripImage(trip, 1920, 1080)}
            alt={trip.destination}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {trip.country} · {ACTIVITY_LABEL[trip.activity]} · {durationLabel(trip)} · {trip.level}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {trip.destination}
        </h1>
        <p className="mt-8 font-serif text-lg leading-relaxed text-ink/90 sm:text-xl">
          {editorialFor(trip.id)}
        </p>

        <dl className="mt-12 grid grid-cols-1 gap-y-6 border-y border-stone/20 py-10 sm:grid-cols-2">
          <Fact label={t.inquiry.factOperator} value={trip.operator} />
          <Fact label={t.inquiry.factSeason} value={trip.season} />
          <Fact label={t.inquiry.factLevel} value={trip.level} />
          <Fact label={t.inquiry.factDuration} value={durationLabel(trip)} />
          <Fact label={t.inquiry.factPrice} value={priceSymbol(trip.price_range)} />
        </dl>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {extra.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-stone/10">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <InquireForm tripId={trip.id} tripName={trip.destination} operator={trip.operator} />
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
      <dd className="mt-2 font-serif text-base text-ink">{value}</dd>
    </div>
  );
}

function InquireForm({
  tripId,
  tripName,
  operator,
}: {
  tripId: string;
  tripName: string;
  operator: string;
}) {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Submit to Netlify Forms: form-encoded POST to the STATIC "/__forms.html"
    // path (not "/", which the SSR function owns and would swallow, returning a
    // 200 HTML page that looks like success). Static paths are served before the
    // SSR catch-all, so Netlify's form pipeline actually captures the submission.
    const data = new FormData(e.currentTarget);
    data.set("source_page", typeof window !== "undefined" ? window.location.href : "");
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      // Proof of a real capture: Netlify's form pipeline answers with its
      // "Your form submission has been received" success page (and/or a 303
      // redirect to it). A plain 200 that echoes our own static __forms.html —
      // what `vite dev` returns locally, since it has no form backend, and what
      // the SSR function would return if it intercepted the POST — is NOT a
      // capture, so we must not show the success state.
      const body = await res.text();
      const captured =
        res.ok && (res.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Not captured by Netlify Forms");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-16 border border-stone/30 px-6 py-14 text-center">
        <p className="font-serif text-xl italic text-ink sm:text-2xl">{t.inquiry.success}</p>
        <p className="mt-8 font-serif text-3xl lowercase text-ink">trovr</p>
      </div>
    );
  }

  return (
    <form
      name="inquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="mt-16"
    >
      <input type="hidden" name="form-name" value="inquiry" />
      <input type="hidden" name="trip_id" value={tripId} />
      <input type="hidden" name="trip_name" value={tripName} />
      <input type="hidden" name="operator" value={operator} />
      <p className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
        </label>
      </p>
      <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t.inquiry.heading}</h2>
      <p className="mt-3 text-sm text-stone">{t.inquiry.subheading}</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field name="name" label={t.inquiry.name} required />
        <Field name="email" label={t.inquiry.email} type="email" required />
        <Field name="phone" label={t.inquiry.phone} />
        <Field name="when" label={t.inquiry.when} placeholder={t.inquiry.whenPlaceholder} />
      </div>
      <div className="mt-6">
        <label className="text-[11px] uppercase tracking-[0.2em] text-stone">
          {t.inquiry.about}
        </label>
        <textarea
          name="about"
          rows={4}
          placeholder={t.inquiry.aboutPlaceholder}
          className="mt-2 w-full border border-stone/30 bg-transparent px-3 py-2 font-serif text-base text-ink focus:border-ink focus:outline-none"
        />
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{t.inquiry.error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {submitting ? t.inquiry.sending : t.inquiry.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-stone">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border border-stone/30 bg-transparent px-3 py-2 font-serif text-base text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}
