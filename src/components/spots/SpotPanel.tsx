import { useEffect, useRef, useState } from "react";
import { SpotCard } from "@/components/spots/SpotCard";
import type {
  Activity,
  Continent,
  RegionGroup,
  Spot,
} from "@/lib/spots-data";

/**
 * Reusable off-canvas drawer that shows a single spot. Fully decoupled from
 * routing — the parent decides when to open it and how to close (URL back,
 * local state on a map pin, etc). Pass `spot={null}` to render nothing.
 */
export function SpotPanel({
  spot,
  continent,
  region,
  activity,
  onClose,
}: {
  spot: Spot | null;
  continent?: Continent;
  region?: RegionGroup;
  activity?: Activity;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Enter animation + focus + body scroll lock + Escape key.
  useEffect(() => {
    if (!spot) return;
    const raf = requestAnimationFrame(() => setMounted(true));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the close button for keyboard users.
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      setMounted(false);
    };
  }, [spot, onClose]);

  if (!spot) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Spot: ${spot.name}`}
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-ink/50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:max-w-[560px] ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone/15 bg-paper/95 px-4 py-3 backdrop-blur">
          <span className="text-[10px] uppercase tracking-[0.25em] text-stone">
            Spot detail
          </span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-stone/30 text-ink transition-colors hover:border-ink hover:bg-ink/5"
            style={{ borderRadius: 2 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SpotCard
            spot={spot}
            continent={continent as Continent}
            region={region as RegionGroup}
            activity={activity}
          />
        </div>
      </aside>
    </div>
  );
}