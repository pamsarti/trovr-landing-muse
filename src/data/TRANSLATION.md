# Portuguese content (Phase 2)

The site chrome (nav, buttons, Home, About, forms, SEO) is already bilingual via
`src/i18n/en.tsx` + `src/i18n/pt.tsx`. The **long content that lives in data** is
translated here, later, without touching any mechanism.

Contract for every data type: **English file = source of truth and fallback;
the `*.pt` file = a partial overlay keyed by the same ID; the accessor merges
with English fallback.** You can translate one item at a time — anything not yet
translated simply shows in English.

| Content | English (do not edit for translation) | Portuguese overlay (fill this) | Accessor |
|---|---|---|---|
| Trip editorials | `trip-editorials.ts` (`TRIP_EDITORIALS`) | `trip-editorials.pt.ts` (`TRIP_EDITORIALS_PT`) | `editorialFor(id, locale)` |
| Trips (summary) | `trips.json` | `trips.pt.json` → `trips[id].summary` | (wire when Phase 2 starts) |
| Journal articles | `journal-articles.json` | `journal-articles.pt.json` → `articles[slug]` | (wire when Phase 2 starts) |
| Spots (description) | `spots.json` | `spots.pt.json` → `spots[id].description` | (wire when Phase 2 starts) |

**Never** translate `trip.season` in `trips.json` — the in-season logic parses
English month names. Put any translated season text in `trips.pt.json` as a
separate `seasonDisplay` field, not over the raw value.
