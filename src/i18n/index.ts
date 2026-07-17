import { en } from "./en";
import { pt } from "./pt";
import { type Locale, DEFAULT_LOCALE } from "./types";

export { type Locale, DEFAULT_LOCALE, LOCALES } from "./types";

/** The catalog registry: locale -> messages. English is the fallback. */
export const CATALOG = { en, pt } as const;

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "pt";
}

/** Country (ISO-3166 alpha-2) whose visitors default to Portuguese. */
const PT_COUNTRIES = new Set(["BR"]);

export function localeForCountry(country: string | null | undefined): Locale | null {
  if (!country) return null;
  return PT_COUNTRIES.has(country.toUpperCase()) ? "pt" : "en";
}

/** Best-effort locale from an Accept-Language header. Only used as a fallback
 *  when no cookie and no geo country are available. */
export function localeForAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  // Portuguese in any form (pt, pt-BR, pt-PT) -> Portuguese; else no opinion.
  return /(^|[,\s])pt\b/i.test(header) ? "pt" : null;
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
  if (isLocale(signals.cookie)) return signals.cookie;
  const geo = localeForCountry(signals.country);
  if (geo) return geo;
  const al = localeForAcceptLanguage(signals.acceptLanguage);
  if (al) return al;
  return DEFAULT_LOCALE;
}

export const LOCALE_COOKIE = "trovr_locale";
