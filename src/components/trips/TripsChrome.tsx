import { Link } from "@tanstack/react-router";
import type { Trip } from "@/lib/trips-data";
import { tripImage, tripTag, ACTIVITY_LABEL, durationLabel } from "@/lib/trips-data";

export function TripsHeader({ current }: { current?: "trips" | "spots" | "about" | "home" }) {
  const link = (active: boolean) =>
    active ? "text-ink" : "text-stone transition-colors hover:text-ink";
  return (
    <header className="border-b border-stone/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">
          trovr
        </Link>
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
          <Link to="/" className={link(current === "home")}>Home</Link>
          <Link to="/spots" className={link(current === "spots")}>Spots</Link>
          <Link to="/trips" className={link(current === "trips")}>Trips</Link>
          <Link to="/about" className={link(current === "about")}>About</Link>
        </nav>
      </div>
    </header>
  );
}

export function TripsFooter() {
  return (
    <footer className="border-t border-stone/20 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-4xl lowercase text-ink">trovr</p>
        <p className="font-serif text-sm italic text-stone">
          Travel to find, not to escape.
        </p>
      </div>
    </footer>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link
      to="/trips/$id"
      params={{ id: trip.id }}
      className="group block border border-transparent transition-colors duration-300 hover:border-stone/30"
    >
      <div className="aspect-video w-full overflow-hidden bg-stone/10">
        <img
          src={tripImage(trip, 800, 450)}
          alt={trip.destination}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-1 py-4">
        <h3 className="font-serif text-xl text-ink">{trip.destination}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
          {trip.country} · {ACTIVITY_LABEL[trip.activity]} · {durationLabel(trip)}
        </p>
        <p className="mt-3 font-serif text-sm italic leading-[1.35] text-ink/80 line-clamp-2">
          {trip.summary}
        </p>
      </div>
    </Link>
  );
}

export function SmallSeasonCard({ trip }: { trip: Trip }) {
  return (
    <Link
      to="/trips/$id"
      params={{ id: trip.id }}
      className="group block w-56 shrink-0 sm:w-64"
    >
      <div className="aspect-square w-full overflow-hidden bg-stone/10">
        <img
          src={tripImage(trip, 600, 600)}
          alt={trip.destination}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h4 className="mt-3 font-serif text-lg text-ink">{trip.destination}</h4>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
        {trip.country} · in season {trip.season}
      </p>
    </Link>
  );
}

export { tripTag };