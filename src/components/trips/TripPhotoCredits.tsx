export function TripPhotoCredits() {
  return (
    <p className="px-6 py-3 text-center text-xs text-stone">
      Fotos de viagens:{" "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Puerto_Chicama,_Peru_-_waves.jpg">
        Chicama, Henry__Spencer
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
      {" · "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Serengeti_Balloon.jpg">
        Serengeti, Eric Kilby
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>).
      Imagens em WebP, com recorte na exibição.
    </p>
  );
}
