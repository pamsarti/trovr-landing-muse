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
        <figure><img src="https://images.pexels.com/photos/15141396/pexels-photo-15141396.jpeg?auto=compress&w=1400" alt="Vista do mar a partir do convés de um veleiro" /></figure>
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
            <figure><img src="https://images.pexels.com/photos/1861787/pexels-photo-1861787.jpeg?auto=compress&w=1400" alt="Mesa de café da manhã com frutas e panquecas" /></figure>
            <figure><img src="https://images.pexels.com/photos/8982349/pexels-photo-8982349.jpeg?auto=compress&w=1400" alt="Peixe grelhado servido com limão e verduras" /></figure>
          </div>
        </div>
      </section>
      <section id="mais-tempo" className="kite-feature">
        <img src="https://images.pexels.com/photos/15875280/pexels-photo-15875280.jpeg?auto=compress&w=1800" alt="Kitesurfista em um salto sobre o mar" />
        <div className="kite-shell"><h2>Mais tempo no mar</h2><p>O barco vai com você. Dá para mudar de ponto de kite sem refazer as malas e passar o intervalo entre sessões com o mar à sua volta.</p></div>
      </section>
      <section id="inclusoes" className="kite-shell kite-section">
        <h2>O que está incluído</h2>
        <p className="kite-lead">A viagem está em preparação. Os detalhes da saída serão divulgados quando estiverem confirmados.</p>
        <p className="kite-kicker">Itens em definição</p>
        <ul className="kite-inclusions"><li>Hospedagem e refeições</li><li>Equipamento de kite</li><li>Apoio durante as sessões</li></ul>
      </section>
      <section id="interesse" className="kite-section kite-close">
        <div className="kite-shell"><InquireForm tripId={trip.id} tripName="Kitesurf a bordo" operator={trip.operator} soon /></div>
      </section>
      <div className="kite-shell kite-credits">
        <Link to="/trips">← Todas as experiências</Link>
        <p>Fotos no Pexels · <a href="https://www.pexels.com/photo/yacht-in-exotic-sea-14762450/">Barco</a> · <a href="https://www.pexels.com/photo/person-kitesurfing-in-ocean-14762105/">Kite</a> · <a href="https://www.pexels.com/photo/a-view-of-the-ocean-from-a-boat-15141396/">Convés</a> · <a href="https://www.pexels.com/photo/photo-of-people-eating-breakfast-1861787/">Café</a> · <a href="https://www.pexels.com/photo/close-up-photo-of-a-delicious-cooked-food-on-a-plate-8982349/">Prato</a> · <a href="https://www.pexels.com/photo/man-flying-above-the-sea-while-kitesurfing-15875280/">Salto</a></p>
      </div>
    </div>
      <TripsFooter />
    </main>
  );
}
