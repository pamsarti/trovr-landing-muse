import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader, getCookie } from "@tanstack/react-start/server";
import { resolveLocale, LOCALE_COOKIE, DEFAULT_LOCALE, isLocale, type Locale } from "./index";

/**
 * Resolve the locale once per request, with separate server/client bodies so
 * the server-only header helpers never reach the client bundle
 * (createIsomorphicFn is how TanStack Start splits them safely).
 *
 * Server priority: manual cookie -> geo country -> Accept-Language -> English.
 * The geo country arrives as `x-trovr-country`, injected by the Netlify edge
 * function (netlify/edge-functions/geo.ts); the Nitro SSR function can't read
 * Netlify geo reliably on its own. `x-country` / `x-nf-geo` are tried as a
 * best-effort secondary.
 *
 * Client: read the cookie only (used after the EN/PT toggle calls
 * router.invalidate, so switching is instant and flash-free).
 */
export const detectLocale = createIsomorphicFn()
  .server((): Locale => {
    const cookie = getCookie(LOCALE_COOKIE);

    let country: string | null = getRequestHeader("x-trovr-country") ?? null;
    if (!country) country = getRequestHeader("x-country") ?? null;
    if (!country) {
      const nfGeo = getRequestHeader("x-nf-geo");
      if (nfGeo) {
        try {
          const parsed = JSON.parse(nfGeo) as { country?: { code?: string } };
          country = parsed.country?.code ?? null;
        } catch {
          country = null;
        }
      }
    }

    const acceptLanguage = getRequestHeader("accept-language") ?? null;
    return resolveLocale({ cookie, country, acceptLanguage });
  })
  .client((): Locale => {
    const m = document.cookie.match(/(?:^|;\s*)trovr_locale=(pt|en)/);
    return isLocale(m?.[1]) ? (m[1] as Locale) : DEFAULT_LOCALE;
  });
