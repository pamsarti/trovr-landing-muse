import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  getPublicSpots,
  spotImage,
  spotHomeMetrics,
  activityLabel,
  slugify,
  type Spot,
} from "@/lib/spots-data";
import { getPublishedArticles, CATEGORY_LABEL, type JournalArticle } from "@/lib/journal-data";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { useT } from "@/i18n/useT";
import { seoT } from "@/i18n/seoT";

export const Route = createFileRoute("/")({
  loader: ({ context }) => ({ locale: (context as { locale?: import("@/i18n").Locale }).locale }),
  head: ({ loaderData }) => {
    const t = seoT(loaderData?.locale);
    return {
      meta: [
        { title: t.seo.homeTitle },
        {
          name: "description",
          content: t.seo.homeDescription,
        },
        { property: "og:url", content: `${SITE_URL}/` },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/` },
        {
          rel: "preload",
          as: "image",
          href: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=70",
          fetchpriority: "high",
        },
      ],
    };
  },
  component: Index,
});

/* ---------- Data ---------- */

/**
 * Fisher–Yates shuffle using a seed, so the order is deterministic for a given
 * seed. The homepage seeds it on the CLIENT after mount (see useShuffled) — SSR
 * renders the stable source order, then the client reshuffles once, which keeps
 * hydration intact while still varying the order each visit.
 */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const a = items.slice();
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Stable source order on the server; one client-side reshuffle after mount. */
function useShuffled<T>(items: readonly T[]): T[] {
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 0x7fffffff) || 1);
  }, []);
  return useMemo(() => (seed === 0 ? items.slice() : seededShuffle(items, seed)), [items, seed]);
}

/** Hero slide, sourced from a public spot or a published journal article. */
type HeroSlide = { src: string; alt: string; caption: string };

function heroSlidesFrom(spots: Spot[], articles: JournalArticle[]): HeroSlide[] {
  const fromSpots: HeroSlide[] = spots.map((s) => ({
    src: spotImage(s, 1600, 1000),
    alt: s.name,
    caption: `${s.country} · ${activityLabel(s.activity)}`,
  }));
  const fromArticles: HeroSlide[] = articles.map((a) => ({
    src: a.heroImage,
    alt: a.title,
    caption: `${CATEGORY_LABEL[a.category]} · Journal`,
  }));
  return [...fromSpots, ...fromArticles];
}

/* ---------- Page ---------- */

function Index() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader transparent />
      <Hero />
      <Reveal as="div">
        <ManifestoStrip />
      </Reveal>
      <SpotsAndJournal />
      <Reveal as="div">
        <StatsBar />
      </Reveal>
      <Newsletter />
      <Footer />
    </main>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const t = useT();
  // Hero images come from public spots + published journal articles, reshuffled
  // once on the client so each visit sees a different order (SSR-safe).
  const allSlides = useMemo(() => heroSlidesFrom(getPublicSpots(), getPublishedArticles()), []);
  const slides = useShuffled(allSlides).slice(0, 6);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);
  // Guard the index if the slide count changes after the client reshuffle.
  const active = slides.length ? i % slides.length : 0;

  if (slides.length === 0) return null;

  return (
    <section className="relative isolate h-[100svh] w-full overflow-hidden bg-ink">
      {slides.map((s, idx) => (
        <div
          key={`${s.src}-${idx}`}
          aria-hidden={idx !== active}
          className="ken-burns hero-slide absolute inset-0 -z-10 transition-opacity duration-[800ms] ease-in-out"
          style={{
            opacity: idx === active ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "brightness(0.72)",
          }}
        />
      ))}

      {/* Legibility overlays — subtle but WCAG AA safe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.78) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 20% 90%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)",
        }}
      />

      {/* Content — visible immediately so the headline is readable without waiting for animation */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 sm:px-12 sm:pb-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10.5px] uppercase tracking-[0.28em] text-white/70">
              {t.home.heroKicker}
            </p>
            <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-white sm:text-6xl md:text-7xl">
              {t.home.heroHeadline()}
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href="#expeditions"
                className="group inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-paper shadow-lg shadow-black/20 transition-colors duration-200 ease-out hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none"
              >
                {t.home.seeExpeditions}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none" />
              </a>
              <a
                href="#newsletter"
                className="rounded-sm text-[10.5px] uppercase tracking-[0.22em] text-white/80 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t.home.earlyAccessArrow}
              </a>
            </div>
          </div>

          {/* Right: slide indicator */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="font-serif text-2xl tracking-wide text-white">
              <span className="text-white">{String(active + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-white/40">/</span>
              <span className="text-white/60">{String(slides.length).padStart(2, "0")}</span>
            </div>
            <div
              role="tablist"
              aria-label="Hero slideshow"
              className="flex items-center gap-2"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  setI((n) => (n + 1) % slides.length);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setI((n) => (n - 1 + slides.length) % slides.length);
                }
              }}
            >
              {slides.map((s, idx) => (
                <button
                  key={`${s.src}-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === active}
                  aria-label={`Show slide ${idx + 1} of ${slides.length}: ${s.caption}`}
                  tabIndex={idx === active ? 0 : -1}
                  onClick={() => setI(idx)}
                  className="group -my-3 flex h-6 w-10 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span
                    aria-hidden
                    className="block h-[2px] w-full origin-left transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{
                      transform: idx === active ? "scaleX(1)" : "scaleX(0.4)",
                      background:
                        idx === active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)",
                    }}
                  />
                </button>
              ))}
            </div>
            <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/70">
              {slides[active]?.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Manifesto Strip ---------- */

function ManifestoStrip() {
  const t = useT();
  return (
    <section className="px-6 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-20">
        <div>
          <p className="mb-6 text-[10.5px] uppercase tracking-[0.28em] text-mid">
            {t.home.manifestoKicker}
          </p>
          <h2 className="font-serif text-[2.25rem] leading-[1.1] text-ink sm:text-5xl md:text-[3.5rem]">
            {t.home.manifestoHeadline()}
          </h2>
        </div>
        <div>
          <div className="space-y-6">
            <p className="text-base leading-[1.75] text-mid sm:text-lg">{t.home.manifestoP1}</p>
            <p className="text-base leading-[1.75] text-mid sm:text-lg">{t.home.manifestoP2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Spots + Journal, interleaved ---------- */

/**
 * The main body of the homepage: full-screen spot scenes, with a journal band
 * slotted in after every two spots. Both lists are reshuffled once on the
 * client, and the journal band rotates through the published articles as the
 * page goes — so as more spots and articles are added, the rhythm just keeps
 * going without any layout change.
 */
function SpotsAndJournal() {
  const spots = useShuffled(getPublicSpots());
  const articles = useShuffled(getPublishedArticles());

  if (spots.length === 0) return null;

  const blocks: React.ReactNode[] = [];
  let sceneIndex = 0;
  let articleIndex = 0;

  spots.forEach((spot, i) => {
    blocks.push(
      <SpotScene key={`spot-${spot.id}`} spot={spot} index={sceneIndex} delay={-(i % 4) * 6} />,
    );
    sceneIndex += 1;
    // After every two spots, drop in one journal band (if any articles exist).
    const isSecondOfPair = (i + 1) % 2 === 0;
    const moreSpotsAfter = i < spots.length - 1;
    if (isSecondOfPair && articles.length > 0 && moreSpotsAfter) {
      const article = articles[articleIndex % articles.length];
      blocks.push(<JournalBand key={`journal-${article.id}-${articleIndex}`} article={article} />);
      articleIndex += 1;
    }
  });

  return (
    <>
      <div id="expeditions" className="bg-ink">
        {blocks}
      </div>
    </>
  );
}

/**
 * One journal article as a full-width band, breaking up the run of spot scenes.
 * Reuses JournalCard's photo + label treatment at full width.
 */
function JournalBand({ article }: { article: JournalArticle }) {
  const t = useT();
  return (
    <section className="bg-paper px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-[10.5px] uppercase tracking-[0.28em] text-mid">
              {t.home.journalKicker}
            </p>
            <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
              {t.home.journalHeadline()}
            </h2>
          </div>
          <Link
            to="/journal"
            className="hidden text-[10.5px] uppercase tracking-[0.22em] text-mid hover:text-ink md:inline-flex"
          >
            {t.home.allEntries}
          </Link>
        </div>
        <div className="grid grid-cols-1">
          <JournalCard article={article} span="" ratio="aspect-[16/9] md:aspect-[21/9]" />
        </div>
      </div>
    </section>
  );
}

function JournalCard({
  article,
  span,
  ratio,
}: {
  article: JournalArticle;
  span: string;
  ratio: string;
}) {
  return (
    <Link
      to="/journal/$slug"
      params={{ slug: article.slug }}
      className={`group relative block overflow-hidden rounded-[4px] bg-ink ${span} ${ratio} md:h-full`}
    >
      <img
        src={article.heroImage}
        alt={article.title}
        loading="lazy"
        className="card-img absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
        style={{ filter: "brightness(0.95)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
      >
        <ArrowUpRight className="h-4 w-4 text-ink" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/80">
          {CATEGORY_LABEL[article.category]} · {article.readTime} min read
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-white sm:text-3xl">
          <span className="relative inline after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
            {article.title}
          </span>
        </h3>
        <p className="mt-1.5 max-w-md font-serif italic text-white/80 line-clamp-2">
          {article.dek}
        </p>
      </div>
    </Link>
  );
}

/** First sentence of a spot's description, for the italic line under its name. */
function firstSentence(text: string): string {
  const m = text.match(/^.*?[.!?](\s|$)/);
  const s = (m ? m[0] : text).trim();
  return s.length > 160 ? s.slice(0, 159) + "…" : s;
}

/**
 * One spot, full screen — the same layout the trip scenes used, now fed by real
 * spot data. The dossier shows only fields that exist on the spot (activity,
 * country, recommended level, best time); nothing is invented. The image is a
 * curated per-activity placeholder until real spot photos land.
 */
function SpotScene({ spot, index, delay }: { spot: Spot; index: number; delay: number }) {
  const t = useT();
  const titleLeft = index % 2 === 0;
  const kicker = `${spot.region.toUpperCase()} · ${spot.country.toUpperCase()}`;
  const metricLabels: Record<string, string> = {
    activity: t.home.metricActivity,
    country: t.home.metricCountry,
    region: t.home.metricRegion,
    best: t.home.metricBest,
  };
  const metrics = spotHomeMetrics(spot).map((m) => ({
    label: metricLabels[m.label] ?? m.label,
    value: m.value,
  }));

  return (
    <article className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <img
        src={spotImage(spot, 1600, 1000)}
        alt={spot.name}
        loading="lazy"
        className="ken-burns absolute inset-0 h-full w-full object-cover"
        style={{ animationDelay: `${delay}s` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/40" />
      <div
        className={`absolute inset-0 ${titleLeft ? "bg-gradient-to-r from-ink/60 via-transparent to-transparent" : "bg-gradient-to-l from-ink/60 via-transparent to-transparent"}`}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 md:grid-cols-2 md:items-end">
          {/* Title block */}
          <div className={titleLeft ? "md:order-1 md:pr-8" : "md:order-2 md:pl-8"}>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/80">{kicker}</p>
            <h3 className="mt-4 max-w-[16ch] font-serif text-[clamp(2rem,5.5vw,5rem)] leading-[1.03] tracking-[-0.02em] text-white">
              {spot.name}
            </h3>
            <p className="mt-4 max-w-md font-serif text-lg italic text-white/85">
              {firstSentence(spot.description)}
            </p>
          </div>

          {/* Dossier — real spot fields only */}
          <aside
            className={`${titleLeft ? "md:order-2 md:justify-self-end" : "md:order-1 md:justify-self-start"} w-full max-w-md rounded-sm border border-white/15 bg-ink/55 p-5 backdrop-blur-md md:p-6`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3">
              <span className="inline-flex items-center rounded-full border border-white/25 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                {activityLabel(spot.activity)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                {spot.country}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-[9.5px] uppercase tracking-[0.22em] text-white/60">
                    {m.label}
                  </dt>
                  <dd className="mt-1.5 font-serif text-lg leading-tight text-white">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center justify-end border-t border-white/15 pt-4">
              <Link
                to="/spots/$continent/$region/$spot"
                params={{
                  continent: slugify(spot.region),
                  region: slugify(spot.city),
                  spot: slugify(spot.name),
                }}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-sage transition-colors hover:text-white"
              >
                {t.home.seeThisSpot}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

/* ---------- Stats Bar ---------- */

import homeStats from "@/data/home-stats.json";

const STATS = [
  { value: String(homeStats.activeSpots), sup: "" },
  { value: String(homeStats.activeContinents), sup: "" },
  { value: "2026", sup: "" },
];

function StatsBar() {
  const t = useT();
  const labels = [t.home.statPlaces, t.home.statContinents, t.home.statLaunching];
  return (
    <section className="px-6 pb-8">
      <div className="mx-auto max-w-7xl rounded-[4px] bg-paper-card">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {STATS.map((s, idx) => (
            <div
              key={labels[idx]}
              className={`group relative px-6 py-10 sm:py-12 ${
                idx > 0 ? "border-t sm:border-t-0 sm:border-l border-[var(--line)]" : ""
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl text-ink sm:text-5xl">{s.value}</span>
                {s.sup && <span className="font-serif text-xl text-sage sm:text-2xl">{s.sup}</span>}
              </div>
              <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-mid">
                {labels[idx]}
              </p>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-sage transition-all duration-500 group-hover:w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */

function Newsletter() {
  const t = useT();
  const bgSlides = useMemo(
    () => heroSlidesFrom(getPublicSpots(), getPublishedArticles()).slice(0, 4),
    [],
  );
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (bgSlides.length <= 1) return;
    const timer = setInterval(() => setBgIndex((n) => (n + 1) % bgSlides.length), 6000);
    return () => clearInterval(timer);
  }, [bgSlides.length]);

  useEffect(() => {
    const el = document.getElementById("newsletter");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setRevealed(true);
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Netlify Forms: POST form-encoded to the STATIC "/__forms.html" path (not
    // "/", which the SSR function owns and would swallow). Static paths are
    // served before the SSR catch-all, so Netlify's form pipeline captures the
    // submission. Only show the thank-you state on a genuinely OK response.
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      // Proof of a real capture: Netlify's form pipeline answers with its
      // "Your form submission has been received" success page (and/or a 303
      // redirect to it). A plain 200 that echoes our own static __forms.html —
      // what `vite dev` returns locally, since it has no form backend, and what
      // the SSR function would return if it intercepted the POST — is NOT a
      // capture, so we must not show the thank-you state.
      const body = await res.text();
      const captured =
        res.ok && (res.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Not captured by Netlify Forms");
      setDone(true);
    } catch {
      setError(t.newsletter.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden text-white"
      style={{ minHeight: "100svh" }}
    >
      {/* Fixed background slideshow (parallax via background-attachment: fixed) */}
      {bgSlides.map((s, idx) => (
        <div
          key={`${s.src}-${idx}`}
          aria-hidden
          className="absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-in-out"
          style={{
            opacity: idx === bgIndex ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      ))}

      {/* Dark gradient overlay for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Progressive reveal content */}
      <div
        className={`relative mx-auto flex min-h-[100svh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center transition-all duration-[1400ms] ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="mb-5 text-[10.5px] uppercase tracking-[0.28em] text-white/70">
          {t.newsletter.kicker}
        </p>
        <h2 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
          {t.newsletter.headline()}
        </h2>
        <p className="mt-6 text-base text-white/75 sm:text-lg">{t.newsletter.subtext}</p>

        {done ? (
          <p className="mt-12 font-serif text-xl italic text-white">{t.newsletter.success}</p>
        ) : (
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="mx-auto mt-12 flex w-full max-w-xl items-center gap-2 rounded-full bg-paper-card/95 p-2 pl-6 backdrop-blur"
            style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.45)" }}
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <p className="hidden">
              <label>
                Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
              </label>
            </p>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.emailPlaceholder}
              id="newsletter-email"
              aria-label="Email address"
              className="flex-1 bg-transparent text-base text-ink placeholder:text-mid/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-sage px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink disabled:opacity-60"
            >
              {submitting ? t.newsletter.subscribing : t.newsletter.subscribe}
            </button>
          </form>
        )}
        {error && !done && <p className="mt-4 text-sm text-white/80">{error}</p>}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-[var(--line)] px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="font-serif text-5xl lowercase text-ink sm:text-6xl">trovr</p>
          <p className="mt-2 font-serif text-base italic text-mid">{t.footer.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-[10.5px] uppercase tracking-[0.22em] text-mid md:items-end">
          <span>{t.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
