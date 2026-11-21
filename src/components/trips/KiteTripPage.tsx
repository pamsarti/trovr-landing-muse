import { TripOpening } from "./TripOpening";
import type { Trip } from "@/lib/trips-data";
import { InquireForm } from "./InquireForm";
import { ContactChannels } from "@/components/ContactChannels";
import { TripsHeader } from "./TripsChrome";
import "./kite-trip.css";

export function KiteTripPage({ trip }: { trip: Trip }) {

  return (
    <main className="trovr-public experience-site bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" experience transparent />
    <div className="kite-page">
      <TripOpening trip={trip} />
      <nav className="kite-nav" aria-label="Nesta ficha">
        <a href="#experiencia">A experiência</a><a href="#dia-a-dia">Dia a dia</a>
        <a href="#gastronomia">Gastronomia</a><a href="#mais-tempo">Mais tempo no mar</a>
        <a href="#inclusoes">O que estamos preparando</a>
      </nav>
      <section id="experiencia" className="kite-shell kite-section kite-split kite-experience">
        <div>
          <p className="kite-kicker">A experiência</p>
          <h2>Do convés<br />para a água.</h2><p className="kite-lead">Você dorme a bordo e navega entre pontos de kitesurf. As condições do dia ajudam a definir onde velejar. Terminou a sessão? O barco é onde você volta para descansar.</p>
        </div>
        <figure className="kite-wide"><img src="https://images.pexels.com/photos/14762105/pexels-photo-14762105.jpeg?auto=compress&w=1800" alt="Kitesurfista velejando em mar turquesa, visto de cima" /></figure>
      </section>
      <section id="dia-a-dia" className="kite-shell kite-section kite-split">
        <figure><img src="https://images.pexels.com/photos/7941991/pexels-photo-7941991.jpeg?auto=compress&w=1800" alt="Catamarã visto de cima sobre um recife" loading="lazy" /></figure>
        <div>
          <h2>Dia a dia</h2>
          <dl className="kite-rhythm">
            <div><dt>Manhã</dt><dd>Café no convés. Olhe o vento e prepare o equipamento.</dd></div>
            <div><dt>Na água</dt><dd>Entre quando as condições permitirem. Depois da sessão, volte para o barco.</dd></div>
            <div><dt>Fim do dia</dt><dd>Guarde o kite e veja a luz baixar sobre a água.</dd></div>
          </dl>
        </div>
      </section>
      <section id="gastronomia" className="kite-section kite-food">
        <div className="kite-shell">
          <h2>Gastronomia</h2>
          <div className="kite-food-pair">
            <figure><img src="https://images.pexels.com/photos/31372386/pexels-photo-31372386.jpeg?auto=compress&w=1800" alt="Peixe grelhado servido com pão e limão" loading="lazy" /></figure>
            <figure><img src="https://images.pexels.com/photos/37363605/pexels-photo-37363605.jpeg?auto=compress&w=1600" alt="Mesa de brunch com frutas, salada e pães" loading="lazy" /></figure>
          </div>
        </div>
      </section>
      <section id="mais-tempo" className="kite-feature">
        <img src="https://images.pexels.com/photos/4784342/pexels-photo-4784342.jpeg?auto=compress&w=2400" alt="Catamarã no mar visto de cima" loading="lazy" />
        <div className="kite-shell"><h2>Mais tempo no mar</h2><p>O barco vai com você. Dá para mudar de ponto de kite sem refazer as malas e passar o intervalo entre sessões com o mar à sua volta.</p></div>
      </section>
      <section id="inclusoes" className="kite-shell kite-section">
        <h2>O que estamos preparando</h2>
        <p className="kite-lead">A viagem está em preparação. Destino, embarcação, temporada e duração ainda estão em definição. Os detalhes da saída serão divulgados quando estiverem confirmados.</p>
        <p className="kite-kicker">Itens em definição</p>
        <ul className="kite-inclusions"><li>Hospedagem e refeições</li><li>Equipamento de kite</li><li>Apoio durante as sessões</li></ul>
        <figure className="kite-wide"><img src="https://images.pexels.com/photos/14762515/pexels-photo-14762515.jpeg?auto=compress&w=2400" alt="Kitesurfista velejando perto de uma faixa de areia, visto de cima" loading="lazy" /></figure>
      </section>
      <section id="interesse" className="kite-contact">
        <img src="https://images.pexels.com/photos/14762444/pexels-photo-14762444.jpeg?auto=compress&w=2400" alt="Vista aérea de kitesurf e de um iate junto à praia" loading="lazy" />
        <div className="kite-contact-content">
          <p className="kite-kicker">Kitesurf a bordo · Em breve</p>
          <h2>Sua próxima viagem<br />começa com uma conversa.</h2>
          <p>Fale com a Trovr e acompanhe o que vem por aí.</p>
          <ContactChannels context="Kitesurf a bordo" dark />
          <details className="kite-contact-email">
            <summary>Prefiro receber novidades por e-mail</summary>
            <InquireForm tripId={trip.id} tripName="Kitesurf a bordo" operator={trip.operator} soon />
          </details>
          <p className="kite-contact-brand">TROVR</p>
        </div>
      </section>

    </div>
    </main>
  );
}
