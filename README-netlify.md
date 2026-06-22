# Trovr — Static site on Netlify

This branch (`static-netlify`) is the **clean static version**: no Lovable, no
Supabase, no admin/CMS, no backend. Every page is prerendered to static HTML and
served from Netlify's CDN. Form submissions go through **Netlify Forms** and are
emailed to the site owner.

> The full CMS/CRM + Supabase version lives on the **`main`** branch. When the
> admin/update feature is needed later, resume from there — nothing was lost.

## Local development

```bash
npm install
npm run dev      # http://localhost:8080
```

That's it — no database, no env files, no Docker. The public pages read their
content from `src/data/*.json`.

## Build (what Netlify runs)

```bash
npm run build    # prerenders all routes -> dist/client
```

Output: `dist/client/` — static HTML for every route (~870 pages: home, trips,
spots, journal, about), plus `assets/` and `__forms.html`.

## Deploy to Netlify

1. Push this branch to GitHub.
2. Netlify → **Add new site → Import from GitHub** → pick the repo + this branch.
3. Build settings are read from [`netlify.toml`](netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist/client`
   - Node version: 22
4. Deploy. No environment variables needed.

## Forms (lead inquiry + newsletter)

Handled by **Netlify Forms** — no backend.

- The React forms (trip inquiry on `/trips/:id`, newsletter on the homepage)
  submit a form-encoded POST to `/` with a `form-name`.
- [`public/__forms.html`](public/__forms.html) declares the two forms
  (`inquiry`, `newsletter`) so Netlify registers them at deploy time.
- **To receive submissions by email:** in Netlify → **Forms → Form notifications
  → Add notification → Email**, and enter the owner's address. (Free tier covers
  100 submissions/month.)
- Spam is filtered via a honeypot field (`bot-field`).

## What changed vs. `main`

Removed: `/admin/*`, `src/lib/admin`, `src/components/admin`, Supabase + Lovable
integrations, the `/api/public/leads` route, `supabase/`, seed scripts, the
Cloudflare worker entry (`src/server.ts`) and `wrangler.jsonc`, and the Lovable
Vite preset. `vite.config.ts` is now a plain TanStack Start config with
prerendering enabled.

## Future-proofing

The **TanStack Start framework is retained**, so:
- A **map UI** (client-side, `react-simple-maps` is already a dependency) can be
  added with no infrastructure change.
- **SSR + a CMS** can be re-enabled later (re-introduce Supabase and flip content
  routes to dynamic) without a rewrite — or simply merge from `main`.
