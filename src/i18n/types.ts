import type { ReactNode } from "react";

/**
 * Supported locales. English is the source of truth and the fallback for
 * everything; Portuguese (Brazil) is the second locale.
 */
export type Locale = "en" | "pt";

export const LOCALES: readonly Locale[] = ["en", "pt"] as const;
export const DEFAULT_LOCALE: Locale = "en";

/** A rich catalog entry: a function returning JSX, so inline <em>/<br/> markup
 *  is preserved and never stringified. */
export type Rich = () => ReactNode;

/**
 * Widen `as const` literal types to their base types, recursively, while
 * preserving object/array/function STRUCTURE. Without this, `en`'s `as const`
 * would force PT strings to equal the English literal (e.g. type `"About"`),
 * which is nonsense for a translation.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends (...args: infer A) => infer R
        ? (...args: A) => R
        : T extends readonly (infer E)[]
          ? Widen<E>[]
          : { -readonly [K in keyof T]: Widen<T[K]> };

/**
 * The message catalog shape, DERIVED from the English catalog (see en.tsx) but
 * with literals widened. `pt.tsx` is typed `satisfies Messages` so the build
 * fails if a key is missing or has the wrong shape — this is what protects the
 * English content from silent partial translation, while still allowing PT to
 * hold different strings.
 */
export type Messages = Widen<typeof import("./en").en>;
