import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useT } from "@/i18n/useT";

const NAV = [
  { href: "/trips", key: "sports", match: "/trips" },
  { href: "/about", key: "about", match: "/about" },
] as const;

function useActivePath() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname;
}

function isActive(pathname: string, match: string) {
  return pathname === match || pathname.startsWith(match + "/");
}

export function SiteHeader({ transparent = false }: { transparent?: boolean } = {}) {
  const pathname = useActivePath();
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuDialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuDialogRef.current) return;

      const focusable = Array.from(
        menuDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused === menuButton) menuButton?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200 motion-reduce:transition-none",
          scrolled ? "border-b border-[var(--line)]" : "border-b border-transparent",
        ].join(" ")}
        style={{
          background: transparent && !scrolled ? "transparent" : "rgb(247 244 238 / 0.92)",
          backdropFilter: transparent && !scrolled ? "none" : "blur(20px)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between h-16 px-6 sm:h-[72px]">
          <Link
            to="/"
            className={[
              "font-serif text-2xl uppercase tracking-[0.04em] sm:text-[28px] transition-colors",
              transparent && !scrolled ? "text-paper" : "text-ink",
            ].join(" ")}
          >
            TROVR
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => {
              const active = item.match ? isActive(pathname, item.match) : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "inline-flex min-h-11 items-center text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:underline aria-[current=page]:underline-offset-4",
                    transparent && !scrolled
                      ? active
                        ? "text-paper"
                        : "text-paper/90 hover:text-paper"
                      : active
                        ? "text-ink"
                        : "text-mid hover:text-ink",
                  ].join(" ")}
                >
                  {t.nav[item.key]}
                </a>
              );
            })}
            <Link
              to="/viagem"
              search={{}}
              data-analytics-event="open_viagem_offer"
              data-analytics-name="header_desktop"
              className="inline-flex min-h-11 items-center rounded-full bg-sage px-5 text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink"
            >
              {t.nav.itinerary}
            </Link>
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
            className={[
              "md:hidden inline-flex size-11 items-center justify-center -mr-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2",
              transparent && !scrolled ? "text-paper" : "text-ink",
            ].join(" ")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      {/* Spacer to offset fixed header (skipped when transparent overlay is used) */}
      {!transparent && <div aria-hidden className="h-[64px] sm:h-[72px]" />}

      {open && (
        <div
          ref={menuDialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className="fixed inset-0 z-[3000] overflow-y-auto bg-paper md:hidden"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="font-serif text-2xl uppercase tracking-[0.04em] text-ink"
            >
              TROVR
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={t.nav.closeMenu}
              onClick={() => setOpen(false)}
              className="inline-flex size-11 items-center justify-center -mr-2 rounded-full text-ink hover:bg-sand/40 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-6 px-6 py-12">
            {NAV.map((item) => {
              const active = item.match ? isActive(pathname, item.match) : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={[
                    "inline-flex min-h-11 items-center font-serif text-3xl lowercase tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 aria-[current=page]:underline aria-[current=page]:underline-offset-8",
                    active ? "text-ink" : "text-mid",
                  ].join(" ")}
                >
                  {t.nav[item.key]}
                </a>
              );
            })}
            <Link
              to="/viagem"
              search={{}}
              onClick={() => setOpen(false)}
              data-analytics-event="open_viagem_offer"
              data-analytics-name="header_mobile"
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-sage px-6 py-3 text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              {t.nav.itinerary}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

export default SiteHeader;
