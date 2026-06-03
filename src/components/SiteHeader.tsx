import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/spots", label: "Spots", match: "/spots" },
  { to: "/trips", label: "Trips", match: "/trips" },
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

export function SiteHeader() {
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
          "sticky top-0 z-40 transition-colors duration-200",
          scrolled
            ? "bg-paper/95 backdrop-blur border-b border-stone/20"
            : "bg-paper border-b border-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:py-6">
          <Link
            to="/"
            className="font-serif text-2xl lowercase text-ink sm:text-3xl"
          >
            trovr
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => {
              const active = isActive(pathname, item.match);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "text-[11px] uppercase tracking-[0.2em] transition-colors",
                    active
                      ? "text-ink underline underline-offset-[6px] decoration-stone/60"
                      : "text-stone hover:text-ink",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center justify-center p-2 -mr-2 text-ink"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

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
                    "font-serif text-3xl lowercase",
                    active ? "text-ink underline underline-offset-[8px] decoration-stone/60" : "text-stone",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

export default SiteHeader;