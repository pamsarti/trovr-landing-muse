import { Link } from "@tanstack/react-router";
import { ALL_TRIPS } from "@/lib/trips-data";
import { TRIP_PRESENTATION } from "@/lib/trip-presentation";
import { TripCard } from "./TripsChrome";

export const experiences = Object.keys(TRIP_PRESENTATION).flatMap((id) => {
  const trip = ALL_TRIPS.find((item) => item.id === id);
  return trip ? [trip] : [];
});

export function ExperienceGrid({ home = false }: { home?: boolean }) {
  return (
    <section className="experience-section scroll-mt-20" id={home ? undefined : "experiencias"}>
      {home ? (
        <>
          <h2>O que você quer viver na próxima viagem?</h2>
          <p className="experience-lead">Surfar uma esquerda que acompanha a costa de Chicama, sair de barco para nadar com jubartes em Tonga ou mergulhar nos recifes de Providencia. Explore as experiências e conte pra gente qual delas você quer viver, por conta própria ou com a sua turma.</p>
        </>
      ) : (
        <>
          <p className="experience-label">Viagens Trovr</p>
          <h1>Escolha o que você quer viver.</h1>
          <p className="experience-lead">Tem viagem que começa com uma onda. Outra, com a vontade de ver o que existe abaixo da superfície. Conheça as experiências e conte como você imagina a sua, por conta própria ou com um grupo.</p>
        </>
      )}
      <div className={home ? "mt-10 grid gap-10 sm:grid-cols-2" : "mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"}>
        {experiences.map((trip) => {
          const copy = TRIP_PRESENTATION[trip.id];
          return (
            <div key={trip.id}>
              <TripCard trip={trip} presentation />
              {!home && copy?.story && (
                <Link to="/journal/$slug" params={{ slug: "providencia-colombia-island-guide" }} className="mx-1 text-sm underline underline-offset-4">
                  Ler o relato de Providencia →
                </Link>
              )}
              {!home && copy?.soon && (
                <Link to="/trips/$id" params={{ id: trip.id }} hash="interesse" className="mx-1 text-sm underline underline-offset-4">
                  Quero receber novidades →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function HowToTravel() {
  return (
    <section className="experience-section">
      <h2>Como você quer viajar?</h2>
      <div className="my-6 grid gap-6 sm:grid-cols-2">
        <div><h3>Vou por conta própria</h3><p>Conte o que quer viver e quando pensa em ir. Se quiser viajar com outras pessoas, diga isso na conversa.</p></div>
        <div><h3>Já tenho um grupo</h3><p>Conte quantas pessoas estão pensando em ir, o que vocês querem fazer e quais datas funcionam para a turma.</p></div>
      </div>
      <Link to="/" hash="contato" className="experience-button">Fale com a Trovr</Link>
    </section>
  );
}

export function ExperienceAbout() {
  return (
    <section className="experience-section" id="sobre">
      <p className="experience-label">Sobre a Trovr</p>
      <h2>A vontade de viver algo dá o primeiro passo.</h2>
      <p className="experience-lead">A Trovr nasceu das viagens da Pamela e da curiosidade de saber o que muda quando a gente escolhe um lugar pelo que pode viver ali. Selecionamos experiências em que o esporte e a natureza dão forma à viagem e conversamos com você sobre como torná-la possível.</p>
      <Link to="/journal/$slug" params={{ slug: "providencia-colombia-island-guide" }} className="mt-4 inline-block underline">Leia o relato de Providencia no Diário de Campo →</Link>
    </section>
  );
}
