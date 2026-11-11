import { TRIP_HERO_PHOTOS } from "@/lib/trip-hero-photos";

export function TripPhotoCredits() {
  return (
    <p className="px-6 py-3 text-center text-xs text-stone">
      Fotos de viagens:{" "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Puerto_Chicama,_Peru_-_waves.jpg">
        Chicama, Henry__Spencer
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
      {" · "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Young_Male_Humpback_Whale-Megaptera_novaeangliae_(16819905665).jpg">
        Tonga, Sylke Rohrlach
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>)
      {" · "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Cayo_Cangrejo_en_Providencia,_Colombia,_febrero_de_2016,_by_Sergio_Jara_(Unsplash).jpg">
        Providencia, Sergio Jara
      </a>{" · "}
      <a className="underline" href="https://unsplash.com/photos/person-surfing-on-sea-during-daytime-mC-VMdFSr1w">
        Kitesurf, Raimond Klavins
      </a>.
      {" Fotos ilustrativas dos carrosséis: "}
      {Object.values(TRIP_HERO_PHOTOS).map((photo, index) => photo && (
        <span key={photo.src}>
          {index > 0 && " · "}
          <a className="underline" href={photo.source}>{photo.credit}</a>
        </span>
      ))}.
      Imagens em WebP, com recorte na exibição.
    </p>
  );
}
