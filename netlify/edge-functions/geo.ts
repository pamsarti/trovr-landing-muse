import type { Context } from "@netlify/edge-functions";

/**
 * Geo → locale hint. Netlify Edge Functions expose the visitor's country via
 * `context.geo` (regular Netlify Functions — where the Nitro SSR handler runs —
 * do NOT reliably get it). We read the country here and forward it to the SSR
 * origin as a normalized `x-trovr-country` request header, which
 * src/i18n/detect.server.ts reads to choose the locale.
 *
 * This does NOT decide or force a language and sets no cookie — the user's
 * manual EN/PT cookie choice, handled in the app, always wins over this hint.
 */
export default async (request: Request, context: Context) => {
  const country = context.geo?.country?.code ?? "";
  const headers = new Headers(request.headers);
  if (country) {
    headers.set("x-trovr-country", country);
  }
  return context.next(new Request(request, { headers }));
};

export const config = {
  path: "/*",
  // Skip static assets and the Netlify Forms endpoint — they never need a locale.
  excludedPath: [
    "/assets/*",
    "/images/*",
    "/data/*",
    "/*.xml",
    "/*.txt",
    "/*.ico",
    "/__forms.html",
  ],
};
