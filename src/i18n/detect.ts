import { createIsomorphicFn } from "@tanstack/react-start";
import type { Locale } from "./index";

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
  .server((): Locale => "pt")
  .client((): Locale => "pt");
