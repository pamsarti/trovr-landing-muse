import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ACTIVITY_LABEL,
  durationLabel,
  findTrip,
  relatedTrips,
  tripExtraImages,
  tripImage,
  type Trip,
} from "@/lib/trips-data";
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

function editorialParagraph(trip: Trip): string {
  // Simple editorial paragraph anchored to facts in summary.
  const facts = trip.summary.replace(/\s+/g, " ").trim();
  return `${facts} The days find their own shape — wind, water, light, the slow learning of a place. You leave with less than you brought, and more than you came for.`;
}

function TripDetail() {
  const { trip } = Route.useLoaderData() as { trip: Trip };
  const extra = tripExtraImages(trip);
  const related = relatedTrips(trip);

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
          {trip.country} · {ACTIVITY_LABEL[trip.activity]} · {durationLabel(trip)} ·{" "}
          {trip.level}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          {trip.destination}
        </h1>
        <p className="mt-8 font-serif text-lg leading-relaxed text-ink/90 sm:text-xl">
          {editorialParagraph(trip)}
        </p>

        <dl className="mt-12 grid grid-cols-1 gap-y-6 border-y border-stone/20 py-10 sm:grid-cols-2">
          <Fact label="Operator" value={trip.operator} />
          <Fact label="Season" value={trip.season} />
          <Fact label="Level" value={trip.level} />
          <Fact label="Price range" value={trip.price_range} />
          <Fact label="Languages" value="English (confirm with operator)" />
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = {
      tripId,
      tripName,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      when: data.get("when"),
      about: data.get("about"),
    };
    // TODO: wire to real inquiry endpoint
    console.log("inquiry", payload);
    await new Promise((r) => setTimeout(r, 400));
    setSent(true);
    setSubmitting(false);
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