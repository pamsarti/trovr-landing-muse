## Policy

From now on, every asset (images, fonts, video, audio, PDFs, etc.) lives **inside the repo**. No Lovable CDN (`/__l5e/...`), no external image hosts (Unsplash, Cloudinary, S3, etc.).

## Rules I will follow

1. **New images go to `public/images/<name>`** and are referenced as `/images/<name>` in JSX/CSS/JSON. No imports, no `.asset.json` pointers.
2. **Never run `lovable-assets create`.** No new `*.asset.json` files will be added.
3. **No external image URLs** in components, data files, or styles. That includes `images.unsplash.com`, `res.cloudinary.com`, etc.
4. When you upload a file in chat, I save the binary directly under `public/images/` and reference it by path.
5. Fonts: if we add a custom font, the `.woff2` file goes in `public/fonts/` and is loaded via a local `@font-face` in `src/styles.css`. (Google Fonts via `<link>` in `__root.tsx` is still allowed unless you want me to self-host those too — tell me.)

## One existing CDN reference to clean up

`src/lib/trips-data.ts` still builds Unsplash URLs as a fallback for trip images (`https://images.unsplash.com/...`). This is the only remaining external-CDN dependency in the codebase.

Two options:
- **A. Leave it for now.** The expedition links already point to `/coming-soon`, so these fallback images aren't visible on the live site. Clean up later if/when trips are reactivated.
- **B. Remove it now.** Replace the Unsplash fallback with either a single local placeholder at `public/images/trip-placeholder.jpg` or a neutral CSS background. I'd need you to either provide a placeholder image or approve a generated one.

## Out of scope

- Re-uploading or moving any of the 24 images already in `public/images/` — they're correctly placed.
- Deleting orphaned objects on the Lovable CDN (cosmetic; doesn't affect the site).

## What I need from you

1. Confirm the policy above.
2. Pick **A** or **B** for the Unsplash fallback in `trips-data.ts`.
