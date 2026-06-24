## Deploying this site to Netlify from GitHub

Yes — you can connect the repo in Netlify and use the standard "Import from GitHub" flow. The repo already includes a `netlify.toml` that tells Netlify exactly how to build, so you don't need to type any build settings manually and **no environment variables are required**.

### Steps

1. Push the branch you want to deploy to GitHub (per `README-netlify.md`, the intended branch is `static-netlify`).
2. In Netlify: **Add new site → Import an existing project → GitHub** → authorize → pick this repo.
3. Choose the branch (e.g. `static-netlify`).
4. Leave the build settings as suggested — Netlify reads them from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist/client`
   - Node version: `22` (set via `[build.environment]`)
5. Click **Deploy site**.

### Environment variables

None required for the build to succeed. The site is fully static (prerendered) and has no backend calls at runtime. The `.env` file in the repo only contains the Supabase **publishable** (anon) keys, which are safe but also unused on this static branch.

Only add env vars in Netlify if you later re-enable Supabase/CMS features — then set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in Site settings → Environment variables.

### Forms (optional but recommended)

Contact and newsletter forms use **Netlify Forms** (declared in `public/__forms.html`). After the first deploy:
- Netlify → **Forms → Form notifications → Add notification → Email** → enter your address to receive submissions.

### Things to double-check before importing

- You're on the `static-netlify` branch (not `main`, which has the Supabase/Cloudflare setup and won't build the same way).
- Node 22 is fine; don't override it in Netlify UI or it can conflict with `netlify.toml`.

### Answer to your specific questions

- **Select repo and use Netlify defaults?** Yes — just import the repo. `netlify.toml` overrides Netlify's auto-detected defaults with the correct command/publish dir, so you can accept what Netlify shows.
- **Any env var configuration needed?** No, not for this static branch.
