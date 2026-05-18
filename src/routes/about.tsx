import { createFileRoute } from "@tanstack/react-router";

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
      <AboutHeader />
      <Hero />
      <WhyExists />
      <FounderNote />
      <HowWeCurate />
      <Footer />
    </main>
  );
}

function AboutHeader() {
  return (
    <header className="border-b border-stone/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <a href="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">
          trovr
        </a>
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone">
          About
        </span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-serif text-[2.25rem] leading-[1.15] text-ink sm:text-5xl md:text-6xl">
          We started with a single question.
          <br />
          <br />
          What does it actually mean to travel?
        </h1>
        <p className="mx-auto mt-10 max-w-xl text-base text-stone sm:text-lg">
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
    <section className="border-t border-stone/15 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-[720px] space-y-8">
        {paragraphs.map((p, i) => (
          <p key={i} className="font-serif text-xl leading-[1.6] text-ink sm:text-[22px]">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="border-t border-stone/15 px-6 py-32 sm:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
        <div className="md:col-span-2">
          <div className="aspect-[4/5] overflow-hidden bg-stone/20">
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
          <p className="font-serif text-2xl italic leading-[1.4] text-ink sm:text-3xl">
            "I left finance after seven years and started kiting full-time."
          </p>
          <p className="mt-3 text-sm tracking-wide text-stone">— Pamela Sarti</p>

          {/* TODO: replace placeholder text with Pamela's final version */}
          <div className="mt-10 space-y-6 text-base leading-[1.75] text-ink sm:text-[17px]">
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
  // TODO: replace these four principles with the final copy from the brief.
  const principles = [
    {
      title: "We travel before we list.",
      body:
        "No operator appears on Trovr unless someone on our team has done the trip themselves, on a normal date, in normal conditions.",
    },
    {
      title: "We choose operators, not destinations.",
      body:
        "The location matters less than the person running the trip. A great guide in an unremarkable place beats a flashy itinerary led by someone going through the motions.",
    },
    {
      title: "We write what we'd want to read.",
      body:
        "Every trip page is editorial, not promotional. We name the hard parts, the trade-offs, and who the trip isn't for.",
    },
    {
      title: "We keep the catalog small.",
      body:
        "Curation is a position, not a feature. If a trip stops meeting our bar, it comes off the site.",
    },
  ];

  return (
    <section className="border-t border-stone/15 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
          How we curate.
        </h2>
        <div className="mt-16 space-y-12">
          {principles.map((p) => (
            <div key={p.title}>
              <p className="font-serif text-2xl italic leading-[1.35] text-ink sm:text-[26px]">
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

function Footer() {
  return (
    <footer className="border-t border-stone/20 px-6 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <a href="/" className="font-serif text-5xl lowercase text-ink sm:text-6xl">
          trovr
        </a>
        <p className="font-serif text-base italic text-stone sm:text-lg">
          Travel to find, not to escape.
        </p>
        <p className="text-xs tracking-wide text-stone">© 2026 · hello@trovr.agency</p>
      </div>
    </footer>
  );
}