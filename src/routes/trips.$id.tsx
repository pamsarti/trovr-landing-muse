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
  notFoundComponent: () => (
    <main className="bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Trip not found.</h1>
        <Link to="/trips" className="mt-6 inline-block text-stone underline">
          Back to all trips
        </Link>
      </div>
      <TripsFooter />
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main className="bg-paper text-ink font-sans">
      <TripsHeader current="trips" />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">This trip didn't load.</h1>
        <button onClick={reset} className="mt-6 text-stone underline">Try again</button>
      </div>
      <TripsFooter />
    </main>
  ),
  component: TripDetail,
});

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
          <Fact label="Operator" value={trip.operator} />
          <Fact label="Season" value={trip.season} />
          <Fact label="Level" value={trip.level} />
          <Fact label="Duration" value={durationLabel(trip)} />
          <Fact label="Price range" value={priceSymbol(trip.price_range)} />
        </dl>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {extra.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-stone/10">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <InquireForm tripId={trip.id} tripName={trip.destination} />
      </article>

      {related.length > 0 && (
        <section className="border-t border-stone/15 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">Trips like this.</h2>
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

function InquireForm({ tripId, tripName }: { tripId: string; tripName: string }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    const payload = {
      trip_id: tripId,
      trip_name: tripName,
      source_page: typeof window !== "undefined" ? window.location.href : null,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || null,
      preferred_when: String(data.get("when") ?? "") || null,
      message: String(data.get("about") ?? "") || null,
    };
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to send inquiry");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-16 border border-stone/30 px-6 py-10 text-center">
        <p className="font-serif text-xl italic text-ink">
          Thanks. We'll get in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-16">
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Inquire about this trip.</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone (optional)" />
        <Field name="when" label="When you'd like to go" placeholder="e.g. October 2026" />
      </div>
      <div className="mt-6">
        <label className="text-[11px] uppercase tracking-[0.2em] text-stone">
          A line about you
        </label>
        <textarea
          name="about"
          rows={4}
          className="mt-2 w-full border border-stone/30 bg-transparent px-3 py-2 font-serif text-base text-ink focus:border-ink focus:outline-none"
        />
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Sending…" : "Inquire"}
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