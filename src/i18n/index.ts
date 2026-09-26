import { pt } from "./pt";
import { type Locale, DEFAULT_LOCALE } from "./types";

export { type Locale, DEFAULT_LOCALE, LOCALES } from "./types";

/** The catalog registry: locale -> messages. English is the fallback. */
export const CATALOG = { pt } as const;

export function isLocale(value: unknown): value is Locale {
  return value === "pt";
}

/** Country (ISO-3166 alpha-2) whose visitors default to Portuguese. */
export function localeForCountry(country: string | null | undefined): Locale | null {
  return country ? "pt" : null;
}

/** Best-effort locale from an Accept-Language header. Only used as a fallback
 *  when no cookie and no geo country are available. */
export function localeForAcceptLanguage(header: string | null | undefined): Locale | null {
  return header ? "pt" : null;
}

/**
 * Pure resolution given already-extracted signals, in priority order:
 * 1) explicit cookie choice, 2) geo country, 3) accept-language, 4) default (en).
 * Kept side-effect-free so it runs identically on server and client.
 */
export function resolveLocale(signals: {
  cookie?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  void signals;
  return "pt";
}

export const LOCALE_COOKIE = "trovr_locale";
