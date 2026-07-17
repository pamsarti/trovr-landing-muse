import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ACTIVITIES, colorForActivity, type Activity } from "@/lib/spots-data";
import { SiteHeader } from "@/components/SiteHeader";
import { useT } from "@/i18n/useT";

export { SiteHeader as SpotsHeader };

export function SpotsFooter() {
  const t = useT();
  return (
    <footer className="border-t border-stone/20 px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-4xl lowercase text-ink">trovr</p>
        <p className="font-serif text-sm italic text-stone">{t.spotsChrome.footerTagline}</p>
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

export function ActivitySelector({ current }: { current?: Activity }) {
  const navigate = useNavigate();
  const t = useT();
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10">
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((a) => {
          const isCurrent = a.id === current;
          const base = "px-4 py-2 text-[11px] uppercase tracking-[0.2em] border transition-colors";
          if (!a.active) {
            return (
              <span
                key={a.id}
                className={`${base} cursor-not-allowed border-stone/25 text-stone/50`}
                style={{ borderRadius: 2 }}
                title={t.spotsChrome.comingSoon}
              >
                {a.label}{" "}
                <span className="ml-1 normal-case tracking-normal">{t.spotsChrome.soon}</span>
              </span>
            );
          }
          const activeColor = colorForActivity(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() =>
                navigate({
                  to: "/spots",
                  // Clicking the current filter clears it; otherwise applies it.
                  search: isCurrent ? {} : { activity: a.id },
                })
              }
              className={`${base} ${
                isCurrent ? "text-paper" : "border-stone/40 text-ink hover:border-ink"
              }`}
              style={
                isCurrent
                  ? {
                      borderRadius: 2,
                      backgroundColor: activeColor,
                      borderColor: activeColor,
                    }
                  : { borderRadius: 2 }
              }
              aria-pressed={isCurrent}
            >
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
