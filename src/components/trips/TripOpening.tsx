import { TRIP_PRESENTATION } from "@/lib/trip-presentation";
import { TRIP_HERO_PHOTOS } from "@/lib/trip-hero-photos";
import { ACTIVITY_LABEL, tripImage, type Trip } from "@/lib/trips-data";
import "./trip-opening.css";

export function TripOpening({ trip }: { trip: Trip }) {
  const copy = TRIP_PRESENTATION[trip.id];
  const photo = TRIP_HERO_PHOTOS[trip.id];
  const label = (copy
    ? [copy.place, copy.type]
    : [trip.country, ACTIVITY_LABEL[trip.activity]]
  ).filter(Boolean).join(" · ");

  return (
    <section className="trip-opening">
      <img
        src={photo?.src ?? tripImage(trip)}
        alt={photo?.alt ?? trip.destination}
        data-photo={photo?.src.split("/").pop()?.split(".")[0]}
        style={{ objectPosition: photo?.objectPosition }}
        className={copy?.soon ? "experience-photo-muted" : undefined}
        fetchPriority="high"
      />
      <div className="trip-opening-copy">
        {copy?.soon && <p className="trip-opening-status">Em breve</p>}
        <p className="trip-opening-label">{label}</p>
        <h1>{copy?.title ?? trip.destination}</h1>
        <p className="trip-opening-summary">{copy?.summary ?? trip.detail}</p>
        {copy && (
          <a href="#interesse" className="experience-button">
            {copy.soon ? "Quero receber novidades" : "Conversar sobre esta viagem"}
          </a>
        )}
      </div>
    </section>
  );
}
