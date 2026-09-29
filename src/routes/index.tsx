import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import {
  ACTIVITIES,
  activityLabel,
  getPublicSpots,
  placeLabel,
  slugify,
  spotImage,
  type Spot,
} from "@/lib/spots-data";
import { CATEGORY_LABEL, getPublishedArticles, type JournalArticle } from "@/lib/journal-data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { useT } from "@/i18n/useT";
import { seoT } from "@/i18n/seoT";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  loader: ({ context }) => ({ locale: (context as { locale?: import("@/i18n").Locale }).locale }),
  head: ({ loaderData }) => {
    const t = seoT(loaderData?.locale);
    return {
      meta: [
        { title: t.seo.homeTitle },
        { name: "description", content: t.seo.homeDescription },
        { property: "og:title", content: t.seo.homeTitle },
        { property: "og:description", content: t.seo.homeDescription },
        { property: "og:url", content: `${SITE_URL}/` },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t.seo.homeTitle },
        { name: "twitter:description", content: t.seo.homeDescription },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.seo.homeTitle,
            description: t.seo.homeDescription,
            url: `${SITE_URL}/`,
            isPartOf: { "@type": "WebSite", name: "Trovr", url: SITE_URL },
            about: [
              "viagens fora do óbvio",
              "lugares além dos circuitos turísticos tradicionais",
              "experiências de viagem",
              "esportes",
              "cultura local",
              "roteiros personalizados",
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.home.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        },
      ],
    };
  },
  component: Index,
});

type HeroSlide = { src: string; alt: string; caption: string };

function heroSlides(spots: Spot[]): HeroSlide[] {
  return spots.slice(0, 6).map((spot) => ({
    src: spotImage(spot, 1800, 1200),
    alt: `${spot.name}, ${placeLabel(spot.country)}`,
    caption: `${placeLabel(spot.country)} · ${activityLabel(spot.activity)}`,
  }));
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match?.[0] ?? text).trim();
}

function Index() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader transparent />
      <Hero />
      <SportsEntry />
      <MapEntry />
      <FeaturedPlaces />
      <Stories />
      <Manifesto />
      <Founder />
      <ItineraryService />
      <Newsletter />
      <HomeFaq />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  const t = useT();
  const slides = useMemo(() => heroSlides(getPublicSpots()), []);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink">
      {slides.map((slide, index) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={index === active ? slide.alt : ""}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? "high" : "auto"}
          className="hero-slide ken-burns absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: index === active ? 1 : 0 }}
        />
      ))}
      <div aria-hidden className="brand-photo-overlay absolute inset-0 z-[1]" />

      <div className="relative z-10 flex min-h-[100svh] items-end px-6 pb-14 pt-28 sm:px-12 sm:pb-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-12 md:flex-row md:items-end">
          <div className="trovr-glass-dark max-w-3xl rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-paper/85">{t.home.heroKicker}</p>
            <h1 className="mt-6 max-w-[13ch] font-serif text-[2.8rem] leading-[1.02] text-paper sm:text-6xl md:text-7xl">
              {t.home.heroHeadline()}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-paper/90 sm:text-lg">
              {t.home.heroBody}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/spots"
                data-analytics-event="select_sport"
                data-analytics-name="hero_all_sports"
                className="group inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
              >
                {t.home.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/roteiro"
                data-analytics-event="open_contact"
                data-analytics-name="hero"
                className="inline-flex items-center rounded-full border border-paper/70 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
              >
                {t.home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 text-paper">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-paper/50 transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
              aria-label={paused ? t.home.playGallery : t.home.pauseGallery}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <div>
              <p className="font-serif text-xl">
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-paper/80">
                {slides[active].caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.24em] text-coffee">{kicker}</p>
      <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl">{title}</h2>
      <p className="mt-6 max-w-2xl text-base leading-7 text-coffee sm:text-lg">{body}</p>
    </div>
  );
}

function SportsEntry() {
  const t = useT();
  const activities = ACTIVITIES.filter((activity) => activity.active);
  const spots = getPublicSpots();
  return (
    <section id="sports" className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          kicker={t.home.sportsKicker}
          title={t.home.sportsTitle}
          body={t.home.sportsBody}
        />
        <div className="mt-12 grid border-y border-coffee/20 md:grid-cols-2 md:divide-x md:divide-coffee/20">
          {activities.map((activity, index) => {
            const spot = spots.find((candidate) => candidate.activity === activity.id);
            return (
              <Link
                key={activity.id}
                to="/spots"
                search={{ activity: activity.id }}
                data-analytics-event="select_sport"
                data-analytics-name={activity.label}
                data-analytics-category={activity.id}
                className="group flex min-h-28 items-center gap-4 border-b border-coffee/20 py-5 transition-colors last:border-b-0 hover:bg-sand/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage md:px-6 md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <span className="w-7 shrink-0 text-[10px] tracking-[0.2em] text-coffee/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {spot && (
                  <img
                    src={spotImage(spot, 360, 240)}
                    alt=""
                    loading="lazy"
                    className="h-16 w-24 shrink-0 rounded-sm object-cover grayscale-[20%] transition-all duration-500 group-hover:grayscale-0 sm:h-20 sm:w-32"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-2xl leading-tight text-ink sm:text-3xl">
                    {activity.label}
                  </span>
                  {spot && (
                    <span className="mt-1 block truncate text-xs uppercase tracking-[0.14em] text-coffee">
                      {spot.name} · {placeLabel(spot.country)}
                    </span>
                  )}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-coffee transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MapEntry() {
  const t = useT();
  const spot = getPublicSpots()[0];
  return (
    <section className="px-6 pb-20 sm:pb-28">
      <div className="relative mx-auto min-h-[520px] max-w-7xl overflow-hidden rounded-2xl bg-ink">
        {spot && (
          <img
            src={spotImage(spot, 1800, 1000)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div aria-hidden className="brand-photo-overlay absolute inset-0" />
        <div className="relative z-10 flex min-h-[520px] max-w-3xl flex-col justify-end p-5 text-paper sm:p-8">
          <div className="trovr-glass-dark rounded-2xl p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-paper/80">{t.home.mapKicker}</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">
              {t.home.mapTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-paper/90 sm:text-lg">
              {t.home.mapBody}
            </p>
            <Link
              to="/spots"
              data-analytics-event="open_map"
              data-analytics-name="home_map"
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-paper px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
            >
              {t.home.mapCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedPlaces() {
  const t = useT();
  const spots = getPublicSpots().slice(0, 6);
  return (
    <section className="bg-ink px-6 py-20 text-paper sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-sand">{t.home.placesKicker}</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">
              {t.home.placesTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-paper/80 sm:text-lg">
              {t.home.placesBody}
            </p>
          </div>
          <Link
            to="/spots"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-sand hover:text-paper"
          >
            {t.home.allPlaces} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {spots.map((spot) => (
            <Link
              key={spot.id}
              to="/spots/$continent/$region/$spot"
              params={{
                continent: slugify(spot.region),
                region: slugify(spot.city),
                spot: slugify(spot.name),
              }}
              data-analytics-event="view_place"
              data-analytics-name={spot.name}
              data-analytics-category={spot.activity}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-coffee shadow-[0_18px_50px_rgb(0_0_0/0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
            >
              <img
                src={spotImage(spot, 900, 1125)}
                alt={`${spot.name}, ${placeLabel(spot.country)}`}
                loading="lazy"
                className="card-img absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div aria-hidden className="brand-photo-overlay absolute inset-0" />
              <div className="trovr-glass-dark absolute inset-x-4 bottom-4 rounded-xl p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-paper/80">
                  {activityLabel(spot.activity)} · {placeLabel(spot.country)}
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-tight text-paper">{spot.name}</h3>
                <p className="mt-3 line-clamp-2 text-base leading-6 text-paper/85">
                  {firstSentence(spot.description)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-sand">
                  {t.home.placeCta} <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stories() {
  const t = useT();
  const articles = getPublishedArticles().slice(0, 3);
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          kicker={t.home.storiesKicker}
          title={t.home.storiesTitle}
          body={t.home.storiesBody}
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          {articles[0] && (
            <Link
              key={articles[0].id}
              to="/journal/$slug"
              params={{ slug: articles[0].slug }}
              data-analytics-event="read_article"
              data-analytics-name={articles[0].title}
              data-analytics-category={articles[0].category}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-ink sm:aspect-[16/10]">
                <img
                  src={articles[0].heroImage}
                  alt={articles[0].title}
                  loading="lazy"
                  className="card-img h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-coffee">
                {CATEGORY_LABEL[articles[0].category]} · {articles[0].readTime} min de leitura
              </p>
              <h3 className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-ink sm:text-4xl">
                {articles[0].title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-6 text-coffee">{articles[0].dek}</p>
            </Link>
          )}
          <div className="divide-y divide-coffee/20 border-y border-coffee/20">
            {articles.slice(1).map((article: JournalArticle) => (
              <Link
                key={article.id}
                to="/journal/$slug"
                params={{ slug: article.slug }}
                data-analytics-event="read_article"
                data-analytics-name={article.title}
                data-analytics-category={article.category}
                className="group grid grid-cols-[7rem_1fr] gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage lg:grid-cols-1"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-ink lg:aspect-[16/7]">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    loading="lazy"
                    className="card-img h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-coffee">
                    {CATEGORY_LABEL[article.category]} · {article.readTime} min
                  </p>
                  <h3 className="mt-2 font-serif text-xl leading-tight text-ink sm:text-2xl">
                    {article.title}
                  </h3>
                  <p className="mt-2 hidden text-sm leading-6 text-coffee sm:line-clamp-2">
                    {article.dek}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Link
          to="/journal"
          className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-coffee hover:text-ink"
        >
          {t.home.storiesCta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Manifesto() {
  const t = useT();
  return (
    <section className="bg-sand px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-coffee">
            {t.home.manifestoKicker}
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t.home.manifestoHeadline()}
          </h2>
        </div>
        <div className="space-y-6 text-base leading-7 text-coffee sm:text-lg">
          <p>{t.home.manifestoP1}</p>
          <p>{t.home.manifestoP2}</p>
          <p className="font-serif text-xl italic text-ink">{t.home.manifestoClosing}</p>
        </div>
      </div>
    </section>
  );
}

function Founder() {
  const t = useT();
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <div className="aspect-[4/5] overflow-hidden rounded-sm bg-sand">
          <img
            src="/images/founder-kite.jpg"
            alt="Pamela Sarti praticando kitesurf"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-coffee">{t.home.founderKicker}</p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl">
            {t.home.founderTitle}
          </h2>
          <p className="mt-7 text-base leading-7 text-coffee sm:text-lg">{t.home.founderBody}</p>
          <p className="mt-5 text-sm text-coffee">— Curadoria Trovr</p>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-coffee hover:text-ink"
          >
            {t.home.founderCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ItineraryService() {
  const t = useT();
  return (
    <section className="border-y border-coffee/10 bg-sand/55 px-6 py-20 text-ink sm:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-coffee">{t.home.serviceKicker}</p>
        <h2 className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-[1.08] sm:text-5xl">
          {t.home.serviceTitle}
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-coffee sm:text-lg">
          {t.home.serviceBody}
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-coffee/80">
          {t.home.serviceDisclaimer}
        </p>
        <Link
          to="/roteiro"
          data-analytics-event="open_contact"
          data-analytics-name="home_service"
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          {t.home.serviceCta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      const body = await response.text();
      const captured =
        response.ok && (response.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Formulário não capturado");
      trackEvent("newsletter_signup", { source: "home" });
      setDone(true);
    } catch {
      setError(t.newsletter.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="bg-ink px-6 py-20 text-paper sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-sand">{t.newsletter.kicker}</p>
        <h2 className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">
          {t.newsletter.headline()}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-paper/80 sm:text-lg">
          {t.newsletter.subtext}
        </p>
        {done ? (
          <p className="mt-10 font-serif text-xl italic text-sand">{t.newsletter.success}</p>
        ) : (
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <p className="hidden">
              <label>
                Não preencha: <input name="bot-field" />
              </label>
            </p>
            <label htmlFor="newsletter-email" className="sr-only">
              Endereço de email
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.newsletter.emailPlaceholder}
              className="min-h-12 flex-1 rounded-full border border-paper/50 bg-paper/10 px-6 text-base text-paper placeholder:text-paper/60 focus:border-paper focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="min-h-12 rounded-full bg-sage px-7 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-terracotta disabled:opacity-60"
            >
              {submitting ? t.newsletter.subscribing : t.newsletter.subscribe}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-sand">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

function HomeFaq() {
  const t = useT();
  return (
    <section className="px-6 py-20 sm:py-28" aria-labelledby="home-faq-title">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.24em] text-coffee">{t.home.faqKicker}</p>
        <h2
          id="home-faq-title"
          className="mt-5 font-serif text-4xl leading-[1.08] text-ink sm:text-5xl"
        >
          {t.home.faqTitle}
        </h2>
        <div className="mt-10 divide-y divide-coffee/20 border-y border-coffee/20">
          {t.home.faq.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-xl text-ink sm:text-2xl">
                {item.question}
                <span aria-hidden className="text-coffee transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-base leading-7 text-coffee">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
