import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  findTrip,
  durationLabel,
  ACTIVITY_LABEL,
  tripImage,
  type Trip,
} from "@/lib/trips-data";
import {
  getPublishedArticles,
  CATEGORY_LABEL,
  type JournalArticle,
} from "@/lib/journal-data";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- Data ---------- */

type HomeTrip = { trip: Trip; line: string; span: string };

const HOME_TRIPS: HomeTrip[] = [
  {
    trip: findTrip("egypt-kite-dragonfly")!,
    line: "Wind that lasts longer than your fear of it.",
    span: "md:col-span-7 md:row-span-2",
  },
  {
    trip: findTrip("maldives-surf-surftribe")!,
    line: "An ocean that pays in a currency the office doesn't accept.",
    span: "md:col-span-5 md:row-span-1",
  },
  {
    trip: findTrip("kyrgyzstan-horse-tatosh")!,
    line: "Where the steppe still belongs to the people who cross it.",
    span: "md:col-span-5 md:row-span-1",
  },
  {
    trip: findTrip("alaska-wildlife-geographic")!,
    line: "Quiet is its own kind of cathedral.",
    span: "md:col-span-12 md:row-span-1",
  },
].filter((t): t is HomeTrip => !!t.trip);

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80",
    alt: "Mountain dawn",
    caption: "Patagonia · trekking",
  },
  {
    src: "https://images.unsplash.com/photo-1502933691298-84fc14542831?auto=format&fit=crop&w=2400&q=80",
    alt: "Surfer at golden hour",
    caption: "Maldives · surf",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80",
    alt: "Open steppe at sunset",
    caption: "Kyrgyzstan · horseback",
  },
];

/* ---------- Page ---------- */

function Index() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader transparent />
      <Hero />
      <ManifestoStrip />
      <JournalSection />
      <Expeditions />
      <StatsBar />
      <Newsletter />
      <Footer />
    </main>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative isolate h-[100svh] w-full overflow-hidden bg-ink">
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.src}
          aria-hidden={idx !== i}
          className="absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-in-out"
          style={{
            opacity: idx === i ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            filter: "brightness(0.82)",
          }}
        />
      ))}

      {/* Subtle linear gradient for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex h-full flex-col justify-end px-6 pb-14 transition-all duration-[1400ms] ease-out sm:px-12 sm:pb-20 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10.5px] uppercase tracking-[0.28em] text-white/70">
              An atlas for those who travel to feel
            </p>
            <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.05] text-white sm:text-6xl md:text-7xl">
              Travel to <em className="italic font-normal">find.</em>
              <br />
              Not to escape.
            </h1>
            <div className="mt-10 flex items-center gap-5">
              <a
                href="#expeditions"
                className="group inline-flex items-center gap-3 rounded-full bg-paper-card px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-white"
              >
                See expeditions
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#newsletter"
                className="text-[11px] uppercase tracking-[0.22em] text-white/80 hover:text-white"
              >
                Early access →
              </a>
            </div>
          </div>

          {/* Right: slide indicator */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="font-serif text-2xl tracking-wide text-white">
              <span className="text-white">{String(i + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-white/40">/</span>
              <span className="text-white/60">
                {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className="h-[2px] transition-all duration-500"
                  style={{
                    width: idx === i ? 40 : 16,
                    background:
                      idx === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
            <p className="text-[10.5px] uppercase tracking-[0.22em] text-white/70">
              {HERO_SLIDES[i].caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Manifesto Strip ---------- */

const TAGS = ["Kite", "Surf", "Horseback", "Wildlife", "Martial Arts", "River Cruise"];

function ManifestoStrip() {
  return (
    <section className="px-6 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
        <div>
          <p className="mb-6 text-[10.5px] uppercase tracking-[0.28em] text-mid">
            The manifesto
          </p>
          <h2 className="font-serif text-[2rem] leading-[1.15] text-ink sm:text-5xl">
            Some people feel{" "}
            <em className="italic font-normal">intensity</em> as a necessity, not a
            preference.
          </h2>
        </div>
        <div className="md:pt-12">
          <div className="space-y-8">
            <p className="text-base leading-[1.75] text-mid sm:text-lg">
              Big waves. Long crossings. Places without signal.
            </p>
            <p className="text-base leading-[1.75] text-mid sm:text-lg">
              We curate trips for those people — the seasoned ones, and the ones just starting to recognize the pull.
            </p>
            <p className="text-base leading-[1.75] text-mid sm:text-lg">
              Adrenaline is the path. What you find along the way is the destination.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {TAGS.map((t) => (
              <li
                key={t}
                className="rounded-full bg-sage-bg px-4 py-1.5 text-xs tracking-wide text-sage"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Expeditions Masonry ---------- */

function JournalSection() {
  const articles = getPublishedArticles().slice(0, 3);
  if (articles.length === 0) return null;
  const spans = [
    "md:col-span-7 md:row-span-2",
    "md:col-span-5 md:row-span-1",
    "md:col-span-5 md:row-span-1",
  ];
  return (
    <section id="journal" className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[10.5px] uppercase tracking-[0.28em] text-mid">
              Field notes
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              From the <em className="italic font-normal">journal.</em>
            </h2>
          </div>
          <Link
            to="/journal"
            className="hidden text-[10.5px] uppercase tracking-[0.22em] text-mid hover:text-ink md:inline-flex"
          >
            All entries →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[280px] lg:auto-rows-[320px]">
          {articles.map((a, idx) => (
            <JournalCard
              key={a.id}
              article={a}
              span={spans[idx] ?? "md:col-span-12"}
              ratio={idx === 0 ? "aspect-[4/5] md:aspect-auto" : "aspect-[4/3] md:aspect-auto"}
            />
          ))}
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
        className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.06]"
        style={{ filter: "brightness(0.95)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
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
          {article.title}
        </h3>
        <p className="mt-1.5 max-w-md font-serif italic text-white/80 line-clamp-2">
          {article.dek}
        </p>
      </div>
    </Link>
  );
}

function Expeditions() {
  return (
    <section id="expeditions" className="px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-[10.5px] uppercase tracking-[0.28em] text-mid">
              Fall 2026
            </p>
            <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              First <em className="italic font-normal">expeditions.</em>
            </h2>
          </div>
          <Link
            to="/trips"
            className="hidden text-[10.5px] uppercase tracking-[0.22em] text-mid hover:text-ink md:inline-flex"
          >
            All expeditions →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[280px] lg:auto-rows-[320px]">
          {HOME_TRIPS.map(({ trip, line, span }, idx) => (
            <ExpeditionCard
              key={trip.id}
              trip={trip}
              line={line}
              span={span}
              ratio={idx === 0 ? "aspect-[4/5] md:aspect-auto" : "aspect-[4/3] md:aspect-auto"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpeditionCard({
  trip,
  line,
  span,
  ratio,
}: {
  trip: Trip;
  line: string;
  span: string;
  ratio: string;
}) {
  return (
    <Link
      to="/coming-soon"
      className={`group relative block overflow-hidden rounded-[4px] bg-ink ${span} ${ratio} md:h-full`}
    >
      <img
        src={tripImage(trip, 1600, 1000)}
        alt={trip.destination}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.06]"
        style={{ filter: "brightness(0.95)" }}
      />
      {/* Bottom info gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Floating button */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
      >
        <ArrowUpRight className="h-4 w-4 text-ink" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/80">
          {trip.country} · {ACTIVITY_LABEL[trip.activity]} · {durationLabel(trip)}
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-tight text-white sm:text-3xl">
          {trip.destination}
        </h3>
        <p className="mt-1.5 max-w-md font-serif italic text-white/80">{line}</p>
      </div>
    </Link>
  );
}

/* ---------- Stats Bar ---------- */

const STATS = [
  { value: "600", sup: "+", label: "Spots mapped" },
  { value: "5", sup: "", label: "Continents" },
  { value: "41", sup: "", label: "Trips" },
  { value: "2026", sup: "", label: "First season" },
];

function StatsBar() {
  return (
    <section className="px-6 pb-8">
      <div className="mx-auto max-w-7xl rounded-[4px] bg-paper-card">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, idx) => (
            <div
              key={s.label}
              className={`group relative px-6 py-10 sm:py-12 ${
                idx > 0 ? "md:border-l border-[var(--line)]" : ""
              } ${idx >= 2 ? "border-t md:border-t-0 border-[var(--line)]" : ""} ${
                idx % 2 === 1 ? "border-l md:border-l border-[var(--line)]" : ""
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl text-ink sm:text-5xl">
                  {s.value}
                </span>
                {s.sup && (
                  <span className="font-serif text-xl text-sage sm:text-2xl">
                    {s.sup}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-mid">
                {s.label}
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
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setInterval(
      () => setBgIndex((n) => (n + 1) % HERO_SLIDES.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

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
    // Netlify Forms: form-encoded POST to "/" with form-name. Best-effort —
    // we show the thank-you state regardless of network result.
    const data = new FormData(e.currentTarget);
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
    } catch {
      /* ignore */
    }
    setDone(true);
  };

  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden text-white"
      style={{ minHeight: "100svh" }}
    >
      {/* Fixed background slideshow (parallax via background-attachment: fixed) */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.src}
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
          Early access
        </p>
        <h2 className="font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
          When the <em className="italic font-normal">first</em> expeditions
          open, you'll be the first to know.
        </h2>
        <p className="mt-6 text-base text-white/75 sm:text-lg">
          No noise. Only the letters that matter.
        </p>

        {done ? (
          <p className="mt-12 font-serif text-xl italic text-white">
            Thank you. We'll be in touch soon.
          </p>
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
              placeholder="your@email.com"
              className="flex-1 bg-transparent text-base text-ink placeholder:text-mid/70 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-sage px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <p className="font-serif text-5xl lowercase text-ink sm:text-6xl">trovr</p>
          <p className="mt-2 font-serif text-base italic text-mid">
            Travel to find, not to escape.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-[10.5px] uppercase tracking-[0.22em] text-mid md:items-end">
          <a href="mailto:hello@trovr.agency" className="hover:text-ink">
            hello@trovr.agency
          </a>
          <span>© 2026 trovr</span>
        </div>
      </div>
    </footer>
  );
}