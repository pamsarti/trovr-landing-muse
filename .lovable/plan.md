Unpublishing is a settings action, not a code change — there are no files to edit. Follow these steps in the Lovable UI:

## Steps

1. Open **Project Settings** (gear icon, top-right of the editor).
2. Go to the **Project** section → **Publishing** / Domains area.
3. Click **Unpublish**.

That takes `trovr-landing-muse.lovable.app` (and the `id-preview--…` URL) offline.

## Why this is safe for your setup

- **Netlify is independent.** Your live site is built from GitHub by Netlify; Lovable's publish toggle doesn't touch that pipeline.
- **Custom domain stays put.** `trovr.com.br` points to Netlify via your registrar's DNS, not via Lovable.
- **Old Netlify subdomain still redirects.** `public/_redirects` 301s `trovragency.netlify.app` → `trovr.com.br`, so no stale Lovable URL is referenced.
- **GitHub → Netlify deploy hook keeps working.** `.github/workflows/netlify-deploy.yml` fires on every push regardless of Lovable's publish state.
- **Editor/preview keep working.** Unpublish only affects the public `.lovable.app` URL. You can re-publish anytime with one click.
- **No `/admin` dependency** (you confirmed you don't use the Lovable-hosted admin).

## After unpublishing — quick verification

- Visit `https://trovr-landing-muse.lovable.app` → should 404.
- Visit `https://trovr.com.br` → should load normally (served by Netlify).
- Push a trivial commit to `main` → confirm Netlify still rebuilds via the GitHub Action.

No code changes required — approve this plan if you'd like me to stand by while you flip the toggle, or ask if you'd prefer I also remove any remaining Lovable-specific references from the repo.