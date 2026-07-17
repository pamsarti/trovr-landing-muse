import { getRouteApi } from "@tanstack/react-router";
import { CATALOG, DEFAULT_LOCALE, type Locale } from "./index";
import type { Messages } from "./types";

const rootApi = getRouteApi("__root__");

/** The current locale, resolved once per request in the root beforeLoad and
 *  carried through router context (so server and client agree — no flash). */
export function useLocale(): Locale {
  const ctx = rootApi.useRouteContext() as { locale?: Locale };
  return ctx.locale ?? DEFAULT_LOCALE;
}

/** The message catalog for the current locale. Usage: `const t = useT();`
 *  then `t.nav.spots` (plain) or `t.home.heroHeadline()` (rich JSX). */
export function useT(): Messages {
  return CATALOG[useLocale()] as Messages;
}
