import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

const FAQ_ITEMS = [
  {
    question: "What is Trovr?",
    answer:
      "Trovr is a hand-curated collection of immersive, non-touristy adventure trips — journeys built around sport, exploration, and genuine discovery rather than sightseeing. Every trip is chosen for one reason: that it adds something real to your life. The adventure is the way in; what you find out there is why it matters.",
  },
  {
    question: "What kind of trips does Trovr offer?",
    answer:
      "Trovr curates active, off-the-map experiences across five continents — kitesurfing, surfing, freediving, horseback expeditions, wildlife journeys, and more. These are trips that ask something of you and give back more than they took: remote places, real terrain, and the kind of challenge you come back from a little changed. They range from journeys for seasoned adventurers to ones for people just beginning to feel the pull.",
  },
  {
    question: "How does Trovr curate its trips?",
    answer:
      "Every trip is chosen by hand, against a single question: would we go ourselves? Trovr looks for journeys that change the people who take them, that aren't the obvious touristy option, and that are lived rather than performed for a photo. There's no committee and no checklist dressed up as science — just a high, personal bar applied to every trip, so that by the time one reaches you, it's already earned the only approval that counts.",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Trovr" },
      {
        name: "description",
        content:
          "The story behind Trovr — a hand-curated collection of immersive, non-touristy adventure trips for people who travel to explore, feel intensely, and come back changed.",
      },
      { property: "og:title", content: "About — Trovr" },
      {
        property: "og:description",
        content:
          "The story behind Trovr — a hand-curated collection of immersive, non-touristy adventure trips for people who travel to explore, feel intensely, and come back changed.",
      },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About — Trovr" },
      {
        name: "twitter:description",
        content:
          "The story behind Trovr — a hand-curated collection of immersive, non-touristy adventure trips for people who travel to explore, feel intensely, and come back changed.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader transparent />
      <Hero />
      <WhyExists />
      <HowWeCurate />
      <Newsletter />
      <Footer />
    </main>
  );
}

const HERO_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=80",
    alt: "Mountain dawn over still water",
  },
  {
    src: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=2400&q=80",
    alt: "Kite in open wind",
  },
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=2400&q=80",
    alt: "Horses on the steppe",
  },
];

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
            filter: "brightness(0.78)",
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <div
        className={`relative z-10 flex h-full items-center justify-center px-6 transition-all duration-[1400ms] ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center text-paper">
          <h1 className="whitespace-pre-line font-serif text-4xl leading-[1.15] sm:text-5xl md:text-6xl">
            We have only one rule:{"\n"}
            No one walks out the same way
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-[1.6] text-paper/80 sm:mt-10 sm:text-lg">
            We built Trovr around keeping that promise
          </p>
        </div>
      </div>
    </section>
  );
}

function WhyExists() {
  const paragraphs = [
    "You'll never regret living one of these. It's the only promise we make — and everything about Trovr is built to keep it.",
    "Trovr is a curation of journeys that leave a mark. Trips for people who travel to feel awake, to test their edges, to come home someone slightly new. Some have chased this feeling for years. Some are only just starting to sense the pull. Both belong here.",
    "These are the journeys that stay with you — the kind that expand what a life can hold, that you don't quite recover from, that you end up building a life around. What you find out there is the reason to go.",
  ];
  return (
    <section
      className="relative px-6 py-10 sm:py-14 md:py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(250,250,250,0.88), rgba(250,250,250,0.94)), url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-[720px] space-y-8">
        {paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-lg leading-[1.6] text-ink sm:text-xl md:text-[22px]">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="border-t border-stone/15 px-6 py-10 sm:py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 sm:gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-2">
          <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-stone/20 md:max-w-none">
            {/* TODO: replace with founder photo */}
            <img
              src="/images/founder-kite.jpg"
              alt="Founder portrait"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="font-serif text-xl italic leading-[1.4] text-ink sm:text-2xl md:text-3xl">
            "I left finance after seven years and started kiting full-time."
          </p>
          <p className="mt-3 text-xs tracking-wide text-stone sm:text-sm">— Pamela Sarti</p>

          {/* TODO: replace placeholder text with Pamela's final version */}
          <div className="mt-8 space-y-6 text-base leading-[1.75] text-ink sm:mt-10 sm:text-[17px]">
            <p>
              In six years of chasing wind across Brazil, the Red Sea, the Mediterranean,
              and Saudi Arabia, one thing became obvious: the trips that changed me
              weren't on any platform I could find. They came from word of mouth. From
              someone who'd done it. From operators who didn't need a marketing budget
              because their guests came back the next year, and the year after.
            </p>
            <p>
              Trovr is the platform I wished existed when I started traveling seriously.
              A place where the operators are vetted, the trips are real, and the
              editorial does the work that brochures don't.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowWeCurate() {
  const principles = [
    {
      title: "It has to change you.",
      body:
        "Not just show you a place — leave a mark on you. The trips we choose are the ones you come back from a little different: braver, quieter, more awake to what you're capable of. If a journey can't do that, it's just logistics.",
    },
    {
      title: "It can't be the obvious one.",
      body:
        "No resorts everyone's already seen. No route that shows up first when you search. We look for the trips most people don't know exist — or wouldn't quite dare to take. The further off the well-worn track, the more we pay attention.",
    },
    {
      title: "It has to be real, not a photo op.",
      body:
        "Some trips exist to look good online and leave nothing behind. We pass on every one of them. What we keep are the journeys that are lived, not performed — the ones that stay with you long after the last picture stops mattering.",
    },
  ];

  return (
    <section
      className="relative border-t border-stone/15 px-6 py-10 sm:py-14 md:py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(250,250,250,0.9), rgba(250,250,250,0.95)), url(https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2400&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          How we curate.
        </h2>
        <p className="mt-8 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
          It all&nbsp; starts with instinct. Every trip on Trovr is chosen by hand — mine — against a question I've been refining for years: would I go? If I wouldn't drop everything to live it myself, it doesn't make the cut. That's the first filter, and the hardest one to fake.
        </p>
        <p className="mt-4 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
          But instinct has a shape. Look closely at what survives it, and the same three things are always there:
        </p>
        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
          {principles.map((p) => (
            <div key={p.title}>
              <p className="font-serif text-xl italic leading-[1.35] text-ink sm:text-2xl md:text-[26px]">
                {p.title}
              </p>
              <p className="mt-4 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-base leading-[1.75] text-ink/90 sm:mt-16 sm:text-[17px]">
          That's the whole method. No committee, no checklist dressed up as science. Just a high bar, a personal one, applied to every single trip — so that by the time something reaches you, it's already earned the only approval that counts.
        </p>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    const el = document.getElementById("about-newsletter");
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
    // "/", which the SSR function owns and would swallow). Submits as the same
    // registered "newsletter" form as the homepage. Only show the thank-you
    // state on a genuinely OK response.
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
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="about-newsletter"
      className="relative isolate overflow-hidden text-white"
      style={{ minHeight: "100svh" }}
    >
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        className={`relative mx-auto flex min-h-[100svh] max-w-[520px] flex-col items-center justify-center px-6 py-24 text-center transition-all duration-[1400ms] ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
          Leave your email.
        </h2>
        <p className="mt-5 text-base leading-[1.6] text-white/75 sm:text-lg">
          We'll write when the first trips open.
        </p>
        {done ? (
          <p className="mt-10 font-serif text-xl italic text-white">
            Thank you. We'll be in touch.
          </p>
        ) : (
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="mt-10 flex w-full flex-col gap-3 sm:flex-row"
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
              className="flex-1 border border-white/40 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/60 backdrop-blur focus:border-white focus:outline-none"
              style={{ borderRadius: 2 }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="border border-white bg-white/10 px-6 py-3 text-sm font-medium tracking-wide text-white backdrop-blur transition-colors hover:bg-white hover:text-ink disabled:opacity-60"
              style={{ borderRadius: 2 }}
            >
              {submitting ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {error && !done && (
          <p className="mt-4 text-sm text-white/80">{error}</p>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone/20 px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Link to="/" className="font-serif text-5xl lowercase text-ink sm:text-6xl">
          trovr
        </Link>
        <p className="font-serif text-base italic text-stone sm:text-lg">
          Travel to find, not to escape.
        </p>
        <p className="text-xs tracking-wide text-stone">© 2026 · hello@trovr.agency</p>
      </div>
    </footer>
  );
}