import { TripPhotoCredits } from "./TripPhotoCredits";
import { Link } from "@tanstack/react-router";
import type { Trip } from "@/lib/trips-data";
import { tripImage, tripTag, ACTIVITY_LABEL, durationLabel } from "@/lib/trips-data";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/i18n/useT";

export function TripsHeader(_props?: { current?: string }) {
  return <SiteHeader />;
}

export function TripsFooter() {
  const t = useT();
  return (
    <footer className="border-t border-stone/20 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-4xl uppercase tracking-[0.04em] text-ink">TROVR</p>
        <p className="font-serif text-sm italic text-stone">{t.footer.tagline}</p>
        <TripPhotoCredits />
      </div>
    </footer>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  const comingSoon = trip.id === "kite-a-bordo";
  return (
    <Link
      to="/trips/$id"
      params={{ id: trip.id }}
      className="group block border border-transparent transition-colors duration-300 hover:border-stone/30"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-stone/10">
        <img
          src={tripImage(trip)}
          alt={trip.destination}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${comingSoon ? "grayscale-[35%]" : ""}`}
        />
        {comingSoon && (
          <span className="absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink">
            Em breve
          </span>
        )}
      </div>
      <div className="px-1 py-4">
        <h3 className="font-serif text-xl text-ink">{trip.destination}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
          {[trip.country, ACTIVITY_LABEL[trip.activity], durationLabel(trip)].filter(Boolean).join(" · ")}
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
    <Link to="/trips/$id" params={{ id: trip.id }} className="group block w-56 shrink-0 sm:w-64">
      <div className="aspect-square w-full overflow-hidden bg-stone/10">
        <img
          src={tripImage(trip)}
          alt={trip.destination}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h4 className="mt-3 font-serif text-lg text-ink">{trip.destination}</h4>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone">
        {[trip.country, trip.season ? `temporada ${trip.season}` : ACTIVITY_LABEL[trip.activity]].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}

export { tripTag };
