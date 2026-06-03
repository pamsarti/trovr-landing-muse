import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Trovr" },
      {
        name: "description",
        content:
          "The story behind Trovr — a curated marketplace of immersive trips for people who travel to feel.",
      },
      { property: "og:title", content: "About — Trovr" },
      {
        property: "og:description",
        content: "The story behind Trovr.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader />
      <Hero />
      <WhyExists />
      <FounderNote />
      <HowWeCurate />
      <Newsletter />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-4xl leading-[1.15] text-ink sm:text-5xl md:text-6xl">
          We started with a single question.
          <br />
          <br />
          What does it actually mean to travel?
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-[1.6] text-stone sm:mt-10 sm:text-lg">
          This page is the answer we've been working on.
        </p>
      </div>
    </section>
  );
}

function WhyExists() {
  const paragraphs = [
    "There are a thousand ways to book a trip. Aggregators that show you the same hotels everyone else sees. Operators you only find if you already know their name. Agencies that translate experience into a checklist.",
    "Somewhere between mass tourism and DIY chaos, a kind of trip got lost: the one curated by someone who actually knows the terrain. The kind that doesn't show up on the first page of search results, but stays with you longer than any of the ones that do.",
    "Trovr is that middle ground. We find the operators we'd travel with ourselves — and put them in one place, with the context that helps you choose.",
  ];
  return (
    <section className="border-t border-stone/15 px-6 py-24 sm:py-32 md:py-40">
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
    <section className="border-t border-stone/15 px-6 py-24 sm:py-32 md:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 sm:gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-2">
          <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-stone/20 md:max-w-none">
            {/* TODO: replace with founder photo */}
            <img
              src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80"
              alt="Founder portrait"
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.55) brightness(0.95)" }}
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
      title: "Operators, not aggregators.",
      body:
        "We work directly with the people running the trips. Every operator on Trovr is someone we've talked to, vetted, and would travel with ourselves.",
    },
    {
      title: "Compliance, in practice.",
      body:
        "MLC certification, valid insurance, safety equipment within date, captains with verifiable hours. The boring parts that turn out to be the important ones.",
    },
    {
      title: "Track record over branding.",
      body:
        "We choose operations that have been running long enough to know what goes wrong, and small enough to still care when it does.",
    },
    {
      title: "Trips that earn the word 'immersive.'",
      body:
        "No mass logistics. No printed itineraries that don't bend. Small groups, real terrain, local context.",
    },
  ];

  return (
    <section className="border-t border-stone/15 px-6 py-24 sm:py-32 md:py-40">
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          How we curate.
        </h2>
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
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to Resend or Formspree endpoint (same as homepage)
    setDone(true);
  };

  return (
    <section className="border-t border-stone/20 px-6 py-24 sm:py-32 md:py-40">
      <div className="mx-auto max-w-[480px] text-center">
        <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">Leave your email.</h2>
        <p className="mt-5 text-base leading-[1.6] text-stone sm:text-lg">
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