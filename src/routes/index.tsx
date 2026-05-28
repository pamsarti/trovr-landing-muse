import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  findTrip,
  durationLabel,
  ACTIVITY_LABEL,
  tripImage,
  type Trip,
} from "@/lib/trips-data";

export const Route = createFileRoute("/")({
  component: Index,
});

type HomeTrip = {
  trip: Trip;
  line: string;
};

const HOME_TRIPS: HomeTrip[] = [
  {
    trip: findTrip("egypt-kite-dragonfly")!,
    line: "Wind that lasts longer than your fear of it.",
  },
  {
    trip: findTrip("maldives-surf-surftribe")!,
    line: "An ocean that pays in a currency the office doesn't accept.",
  },
  {
    trip: findTrip("kyrgyzstan-horse-tatosh")!,
    line: "Where the steppe still belongs to the people who cross it.",
  },
  {
    trip: findTrip("alaska-wildlife-geographic")!,
    line: "Quiet is its own kind of cathedral.",
  },
].filter((t): t is HomeTrip => !!t.trip);

function Index() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <Header />
      <Hero />
      <Manifesto />
      <Trips />
      <Atlas />
      <Newsletter />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="font-serif text-2xl lowercase text-paper sm:text-3xl">
          trovr
        </Link>
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link
            to="/spots"
            className="text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
          >
            Spots
          </Link>
          <Link
            to="/trips"
            className="text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
          >
            Trips
          </Link>
          <Link
            to="/about"
            className="text-[11px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-paper"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
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
          {HOME_TRIPS.map(({ trip, line }) => (
            <Link
              key={trip.id}
              to="/trips/$id"
              params={{ id: trip.id }}
              className="group block"
            >
              <div className="aspect-[16/9] overflow-hidden bg-stone/20">
                <img
                  src={tripImage(trip, 1600, 900)}
                  alt={trip.destination}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]"
                  style={{ filter: "saturate(0.7)" }}
                />
              </div>
              <div className="mt-5">
                <p className="font-sans text-sm tracking-wide text-ink">
                  {trip.country} · {durationLabel(trip)} · {ACTIVITY_LABEL[trip.activity]}
                </p>
                <p className="mt-2 font-serif text-lg italic text-stone sm:text-xl">
                  {line}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Atlas() {
  return (
    <section className="border-t border-stone/20 px-6 py-32 sm:py-40">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
          A growing atlas.
        </h2>
        <p className="mt-5 max-w-xl text-base text-stone sm:text-lg">
          Six hundred kite spots mapped. More every week.
        </p>
        <div className="mt-8">
          <Link
            to="/spots"
            className="text-[11px] uppercase tracking-[0.2em] text-ink underline-offset-4 hover:underline"
          >
            Explore the map →
          </Link>
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