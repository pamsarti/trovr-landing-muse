import { Link } from "@tanstack/react-router";
import { TRIP_HERO_PHOTOS } from "@/lib/trip-hero-photos";
import type { Trip } from "@/lib/trips-data";
import { InquireForm } from "./InquireForm";
import { TripsFooter, TripsHeader } from "./TripsChrome";
import "./kite-trip.css";

export function KiteTripPage({ trip }: { trip: Trip }) {
  const photo = TRIP_HERO_PHOTOS[trip.id];
  if (!photo) throw new Error("Missing kite trip hero photo");

  return (
    <main className="experience-site bg-paper text-ink font-sans antialiased">
      <TripsHeader current="trips" experience />
    <div className="kite-page">
      <section className="kite-hero">
        <img src={photo.src} alt={photo.alt} data-photo="k1" style={{ objectPosition: photo.objectPosition }} />
        <div className="kite-hero-copy">
          <p className="kite-kicker">Trovr · Em breve</p>
          <h1>Kitesurf<br />a bordo</h1>
          <a href="#experiencia">Conheça a experiência ↓</a>
        </div>
      </section>
      <figure className="kite-wide"><img src="https://images.pexels.com/photos/7941991/pexels-photo-7941991.jpeg?auto=compress&w=2400" alt="Catamarã visto de cima sobre um recife" loading="lazy" /></figure>
      <nav className="kite-nav" aria-label="Nesta ficha">
        <a href="#experiencia">A experiência</a><a href="#dia-a-dia">Dia a dia</a>
        <a href="#gastronomia">Gastronomia</a><a href="#mais-tempo">Mais tempo no mar</a>
        <a href="#inclusoes">O que está incluído</a>
      </nav>
      <section id="experiencia" className="kite-shell kite-section">
        <div className="kite-intro">
          <p className="kite-kicker">A experiência</p>
          <div><h2>Do convés<br />para a água.</h2><p className="kite-lead">Você dorme a bordo e navega entre pontos de kitesurf. As condições do dia ajudam a definir onde velejar. Terminou a sessão? O barco é onde você volta para descansar.</p></div>
        </div>
        <figure className="kite-wide"><img src="https://images.pexels.com/photos/14762105/pexels-photo-14762105.jpeg?auto=compress&w=1800" alt="Kitesurfista velejando em mar turquesa, visto de cima" /></figure>
      </section>
      <section id="dia-a-dia" className="kite-shell kite-section kite-split">
        <figure><img src="https://images.pexels.com/photos/35010455/pexels-photo-35010455.jpeg?auto=compress&w=1800" alt="Catamarã navegando em águas de Barbados" loading="lazy" /></figure>
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
        <h2>O que está incluído</h2>
        <p className="kite-lead">A viagem está em preparação. Os detalhes da saída serão divulgados quando estiverem confirmados.</p>
        <p className="kite-kicker">Itens em definição</p>
        <ul className="kite-inclusions"><li>Hospedagem e refeições</li><li>Equipamento de kite</li><li>Apoio durante as sessões</li></ul>
        <figure className="kite-wide"><img src="https://images.pexels.com/photos/14762515/pexels-photo-14762515.jpeg?auto=compress&w=2400" alt="Kitesurfista velejando perto de uma faixa de areia, visto de cima" loading="lazy" /></figure>
      </section>
      <figure className="kite-wide"><img src="https://images.pexels.com/photos/14762444/pexels-photo-14762444.jpeg?auto=compress&w=2400" alt="Vista aérea de kitesurf e de um iate junto à praia" loading="lazy" /></figure>
      <section id="interesse" className="kite-section kite-close">
        <div className="kite-shell"><InquireForm tripId={trip.id} tripName="Kitesurf a bordo" operator={trip.operator} soon /></div>
      </section>
      <div className="kite-shell kite-credits">
        <Link to="/trips">← Todas as experiências</Link>
        <p>Fotos no Pexels
          {" · "}<a href="https://www.pexels.com/photo/14762450/">Iate</a>
          {" · "}<a href="https://www.pexels.com/photo/7941991/">Recife</a>
          {" · "}<a href="https://www.pexels.com/photo/14762105/">Sessão de kite</a>
          {" · "}<a href="https://www.pexels.com/photo/35010455/">Barbados</a>
          {" · "}<a href="https://www.pexels.com/photo/31372386/">Peixe</a>
          {" · "}<a href="https://www.pexels.com/photo/37363605/">Brunch</a>
          {" · "}<a href="https://www.pexels.com/photo/4784342/">Catamarã</a>
          {" · "}<a href="https://www.pexels.com/photo/14762515/">Kite junto à ilha</a>
          {" · "}<a href="https://www.pexels.com/photo/14762444/">Vista aérea</a>
        </p>
      </div>
    </div>
      <TripsFooter />
    </main>
  );
}
