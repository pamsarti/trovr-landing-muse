import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const TRIPS = [
  {
    place: "Patagonia",
    days: "04",
    tagline: "Six hundred kilometers of wind. It shuts you up.",
    img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=80",
    alt: "Patagonian peaks at dusk",
  },
  {
    place: "Iceland",
    days: "03",
    tagline: "Active volcano. Three days walking around it.",
    img: "https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118?auto=format&fit=crop&w=1600&q=80",
    alt: "Icelandic volcanic landscape",
  },
  {
    place: "Atacama",
    days: "05",
    tagline: "Four thousand meters up. The sky moves closer.",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    alt: "Atacama desert plateau",
  },
  {
    place: "Lofoten",
    days: "07",
    tagline: "Light that doesn't behave like light anywhere else.",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
    alt: "Lofoten islands coastline",
  },
];

function Index() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <Hero />
      <Manifesto />
      <Trips />
      <Newsletter />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80"
        alt="Mountain dawn"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(0.55) brightness(0.78)" }}
      />
      <div className="absolute inset-0 bg-ink/25" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-paper">
        <h1 className="font-serif text-[2.5rem] leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Travel to find.
          <br />
          Not to escape.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base text-paper/80 sm:text-lg">
          A curated marketplace of immersive trips, for people who travel to feel.
        </p>
      </div>
    </section>
  );
}

function Manifesto() {
  const paragraphs = [
    "Some people feel intensity as a necessity, not a preference. Big waves. Long crossings. Places without signal.",
    "We curate trips for those people — the seasoned ones, and the ones just starting to recognize the pull.",
    "Adrenaline is the path. What you find along the way is the destination.",
  ];
  return (
    <section className="px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-[640px] space-y-10 text-center">
        {paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-2xl leading-[1.5] text-ink sm:text-[28px]">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function Trips() {
  return (
    <section className="px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
          First trips. Fall 2026.
        </h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {TRIPS.map((t) => (
            <article key={t.place} className="group">
              <div className="aspect-[16/9] overflow-hidden bg-stone/20">
                <img
                  src={t.img}
                  alt={t.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                  style={{ filter: "saturate(0.7)" }}
                />
              </div>
              <div className="mt-5">
                <p className="font-sans text-sm tracking-wide text-ink">
                  {t.place} · {t.days} days
                </p>
                <p className="mt-2 font-serif text-lg italic text-stone sm:text-xl">
                  {t.tagline}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to Resend or Formspree endpoint
    setDone(true);
  };

  return (
    <section className="border-t border-stone/20 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-[480px] text-center">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">Leave your email.</h2>
        <p className="mt-5 text-base text-stone sm:text-lg">
          We'll write when the first trips open.
        </p>
        {done ? (
          <p className="mt-10 font-serif text-xl italic text-ink">
            Thank you. We'll be in touch.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border border-stone/40 bg-transparent px-4 py-3 text-base text-ink placeholder:text-stone/60 focus:border-ink focus:outline-none"
              style={{ borderRadius: 2 }}
            />
            <button
              type="submit"
              className="border border-ink bg-transparent px-6 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink/5"
              style={{ borderRadius: 2 }}
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone/20 px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="font-serif text-5xl lowercase text-ink sm:text-6xl">trovr</p>
        <p className="font-serif text-base italic text-stone sm:text-lg">
          Travel to find, not to escape.
        </p>
        <p className="text-xs tracking-wide text-stone">
          © 2026 · hello@trovr.agency
        </p>
      </div>
    </footer>
  );
}