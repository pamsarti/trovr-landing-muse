## Goal

Eliminate the Lovable CDN (`/__l5e/...`) for images. Every image referenced by the site will be a real file committed at `public/images/<name>`, served by Netlify under `/images/<name>`.

## Why

The site is deployed on Netlify (not Lovable hosting), so `/__l5e/...` URLs return 404 in production. The AlUla hero image is the visible symptom; ~23 other assets are at the same risk.

## Scope

23 `*.asset.json` pointers under `src/assets/` plus the existing `src/assets/alaska-whale.jpg` (already a real file — leave it alone). Two files reference these assets:
- `src/data/journal-articles.json` — `/__l5e/...` URLs inline in article bodies and `heroImage` fields.
- `src/routes/about.tsx` — imports `founder-kite.jpg.asset.json`.

## Steps

1. **Download** each of the 23 binaries from their CDN URLs (read from the `.asset.json` files) into `public/images/<original_filename>`. Names are already unique (`alula-hero.png`, `providencia-shark-solo.jpg`, etc.) so no collisions.
2. **Rewrite `src/data/journal-articles.json`**: replace every `/__l5e/assets-v1/<id>/<file>` occurrence with `/images/<file>`.
3. **Rewrite `src/routes/about.tsx`**: replace the `.asset.json` import with a direct string `"/images/founder-kite.jpg"` (or an import of the real file from `src/assets/` — see Technical note).
4. **Delete the 23 `*.asset.json` pointer files** from `src/assets/`. (The CDN objects themselves stay; we just stop referencing them. Optional cleanup via `lovable-assets delete` can come later.)
5. **Verify**: run `bun run build`, then spot-check the AlUla, Providencia, and Thailand journal pages plus the About page in the preview.

## Technical note

`public/images/foo.jpg` is served at the URL `/images/foo.jpg` by both Vite dev and Netlify — no import needed, just use the string. This is the simplest and most portable approach and matches what you asked for ("reference link in the image tag").

## Out of scope

- Existing real images in `src/assets/` (e.g. `alaska-whale.jpg`) — left as-is.
- Deleting the binaries from Lovable's CDN — optional follow-up.
- Changing the upload workflow going forward — if you want, I can add a short note to the repo telling future contributors (and me) to drop new images into `public/images/` instead of using the CDN. Say the word.

## Result

Zero `/__l5e/` references in the repo. Every image renders identically on the Lovable preview, on Netlify, and on any future host.
