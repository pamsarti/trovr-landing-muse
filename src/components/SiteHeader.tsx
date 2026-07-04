import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/trips", label: "Trips", match: "/trips" },
  { to: "/spots", label: "Spots", match: "/spots" },
  { to: "/journal", label: "Journal", match: "/journal" },
  { to: "/about", label: "About", match: "/about" },
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled ? "border-b border-[var(--line)]" : "border-b border-transparent",
        ].join(" ")}
        style={{
          background:
            transparent && !scrolled ? "transparent" : "rgba(244,241,236,0.9)",
          backdropFilter: transparent && !scrolled ? "none" : "blur(20px)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:py-5">
          <Link
            to="/"
            className={[
              "font-serif text-2xl lowercase tracking-tight sm:text-[28px] transition-colors",
              transparent && !scrolled ? "text-white" : "text-ink",
            ].join(" ")}
          >
            trovr
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.match);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "text-[10.5px] uppercase tracking-[0.22em] transition-colors",
                    transparent && !scrolled
                      ? active
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "text-ink"
                        : "text-mid hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="/#newsletter"
              className="ml-2 inline-flex items-center rounded-full bg-sage px-5 py-2.5 text-[10.5px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-ink"
            >
              Early access
            </a>
          </nav>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={[
              "md:hidden inline-flex items-center justify-center p-2 -mr-2",
              transparent && !scrolled ? "text-white" : "text-ink",
            ].join(" ")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      {/* Spacer to offset fixed header (skipped when transparent overlay is used) */}
      {!transparent && <div aria-hidden className="h-[64px] sm:h-[72px]" />}

      {open && (
        <div className="fixed inset-0 z-50 bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="font-serif text-2xl lowercase text-ink"
            >
              trovr
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center p-2 -mr-2 text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-10 px-6 py-20">
            {NAV.map((item) => {
              const active = isActive(pathname, item.match);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={[
                    "font-serif text-3xl lowercase tracking-tight",
                    active ? "text-ink" : "text-mid",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href="/#newsletter"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center rounded-full bg-sage px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-white"
            >
              Early access
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

export default SiteHeader;