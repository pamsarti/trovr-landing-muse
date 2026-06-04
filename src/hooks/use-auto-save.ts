import { useEffect, useRef, useState } from "react";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Debounced auto-save. Skips the first render so we don't immediately
 * re-save the value we just loaded from the server.
 *
 * Returns the current save state plus the last error message.
 * The save fn should throw on failure.
 */
export function useAutoSave<T>(
  value: T,
  save: (v: T) => Promise<void>,
  delayMs = 1000,
) {
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const firstRun = useRef(true);
  const latest = useRef(value);
  latest.current = value;

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setState("saving");
    const t = setTimeout(async () => {
      try {
        await save(latest.current);
        setState("saved");
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Save failed");
        setState("error");
      }
    }, delayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  return { state, error };
}