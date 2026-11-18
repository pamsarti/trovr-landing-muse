
export function TripPhotoCredits() {
  return (
    <details className="mx-auto max-w-3xl px-6 py-3 text-center text-[10px] text-stone">
      <summary className="cursor-pointer">Créditos das imagens</summary>
      <p className="mt-2">
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Puerto_Chicama,_Peru_-_waves.jpg">
        Chicama, Henry__Spencer
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
      {" · "}
      <a className="underline" href="https://commons.wikimedia.org/wiki/File:Young_Male_Humpback_Whale-Megaptera_novaeangliae_(16819905665).jpg">
        Tonga, Sylke Rohrlach
      </a>{" "}
      (<a className="underline" href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>)
      <span>. Imagens convertidas para WebP e recortadas na exibição.</span>
      </p>
    </details>
  );
}
