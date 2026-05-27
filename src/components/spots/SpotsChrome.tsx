import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ACTIVITIES, type Activity } from "@/lib/spots-data";

export function SpotsHeader() {
  return (
    <header className="border-b border-stone/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:py-8">
        <Link to="/" className="font-serif text-2xl lowercase text-ink sm:text-3xl">
          trovr
        </Link>
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-stone">
          <Link to="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <Link to="/spots" className="text-ink">
            Spots
          </Link>
          <Link to="/trips" className="transition-colors hover:text-ink">
            Trips
          </Link>
          <Link to="/about" className="transition-colors hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SpotsFooter() {
  return (
    <footer className="border-t border-stone/20 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-4xl lowercase text-ink">trovr</p>
        <p className="font-serif text-sm italic text-stone">
          A guide to the places worth the journey.
        </p>
      </div>
    </footer>
  );
}

type Crumb = { label: string; to?: ReactNode };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-6xl px-6 pt-10 text-[11px] uppercase tracking-[0.2em] text-stone"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.to ?? <span className="text-ink">{c.label}</span>}
            {i < items.length - 1 && <span className="text-stone/60">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ActivitySelector({ current }: { current: Activity }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10">
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((a) => {
          const isCurrent = a.id === current;
          const base =
            "px-4 py-2 text-[11px] uppercase tracking-[0.2em] border transition-colors";
          if (!a.active) {
            return (
              <span
                key={a.id}
                className={`${base} cursor-not-allowed border-stone/25 text-stone/50`}
                style={{ borderRadius: 2 }}
                title="Coming soon"
              >
                {a.label} <span className="ml-1 normal-case tracking-normal">— soon</span>
              </span>
            );
          }
          return (
            <span
              key={a.id}
              className={`${base} ${
                isCurrent
                  ? "border-ink bg-ink text-paper"
                  : "border-stone/40 text-ink hover:border-ink"
              }`}
              style={{ borderRadius: 2 }}
            >
              {a.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}