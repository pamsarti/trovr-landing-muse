import { CATALOG, DEFAULT_LOCALE, isLocale, type Locale } from "./index";
import type { Messages } from "./types";

/** Catalog accessor for use inside route `head()` functions, which run outside
 *  React and receive the locale via loaderData. Falls back to English. */
export function seoT(locale: Locale | string | null | undefined): Messages {
  const l: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  return CATALOG[l] as Messages;
}

/** The <html lang> / og:locale value for a locale. */
export function htmlLang(locale: Locale): string {
  return locale === "pt" ? "pt-BR" : "en";
}
export function ogLocale(locale: Locale): string {
  return locale === "pt" ? "pt_BR" : "en_US";
}
