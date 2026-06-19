# Trovr — Local Development (off Lovable)

This sets up the **entire site locally** — frontend, database, auth, storage, and
the admin CMS/CRM — using a local Supabase stack instead of Lovable Cloud. The
content tables are seeded with the repo's demo data (`src/data/*.json`); that data
keeps the exact structure so it can be swapped for the real Lovable export later.

## What runs where

| Concern | Local service | Notes |
|---|---|---|
| Frontend + SSR | `vite dev` → **http://localhost:8080** | TanStack Start app |
| Database / Auth / Storage | local Supabase (Docker) | started by the Supabase CLI |
| Supabase Studio (DB GUI) | **http://127.0.0.1:54323** | browse tables, run SQL |
| Email catcher (Inbucket) | **http://127.0.0.1:54324** | password-reset emails land here |
| Public marketing site | reads `src/data/*.json` | works even with no DB |
| Lead form + `/admin` CMS/CRM | needs local Supabase | |

> Note: the public pages currently read the JSON files, not the database. So CMS
> edits won't appear on the public site until those pages are flipped to read from
> Supabase (a later, deliberate step). The CMS, leads, and storage all use the DB.

## Prerequisites

- **Docker Desktop** running
- **Node 20+** (tested on 24) and **npm**
- Supabase CLI + tsx are installed as dev dependencies (no global install needed)

## First-time setup

```bash
npm install                 # installs deps (uses .npmrc legacy-peer-deps)
npm run seed:gen            # generate supabase/seed.sql from src/data/*.json
npx supabase start          # boot Postgres+Auth+Storage (first run pulls images)
```

Then write the env files from the keys the CLI prints:

```bash
npx supabase status -o env  # shows ANON_KEY and SERVICE_ROLE_KEY
```

Create **`.env.local`** (client) and **`.dev.vars`** (server) from the
`*.example` files in the repo root, pasting the keys from that output:

- `.env.local`  → `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (= anon key)
- `.dev.vars`   → `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (= anon key), `SUPABASE_SERVICE_ROLE_KEY`

Both files are gitignored. The split is required: Vite only injects `VITE_`-prefixed
vars into the browser; the SSR/worker runtime reads non-prefixed vars from `.dev.vars`.

> **How env reaches the server in dev:** in `vite dev`, TanStack Start runs server
> code in Node, which does not read `.dev.vars` on its own (that's a Cloudflare
> runtime convention). A small dev-only plugin in `vite.config.ts` (`local-dev-vars`)
> loads `.dev.vars` into `process.env` so SSR/server functions work locally. It
> **overrides** the committed `.env` (which still points at the remote Lovable
> project), so `.dev.vars` is the local source of truth. In production these vars
> come from the host environment, not from `.dev.vars`.

Apply the seed and create the admin user:

```bash
npx supabase db reset       # re-applies migrations + supabase/seed.sql
npm run seed:admin          # creates the admin auth user + grants 'admin' role
```

Start the app:

```bash
npm run dev                 # http://localhost:8080
```

### One-shot

After `.env.local` / `.dev.vars` exist, the whole DB side is:

```bash
npm run db:setup            # seed:gen + supabase start + db reset + seed:admin
```

## Admin login

- URL: **http://localhost:8080/admin/login**
- Email: `admin@trovr.local`
- Password: `trovr-admin-123`

Override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars before `npm run seed:admin`.
Google sign-in (Lovable-hosted) is disabled locally; email+password only. To
re-enable Google later, restore the button in `src/routes/admin.login.tsx` and
configure `[auth.external.google]` in `supabase/config.toml`.

## Handy commands

| Command | Does |
|---|---|
| `npm run dev` | run the app at :8080 |
| `npm run db:start` / `db:stop` | start / stop the Supabase containers |
| `npm run db:reset` | wipe DB, re-apply migrations + seed (re-run `seed:admin` after) |
| `npm run seed:gen` | regenerate `supabase/seed.sql` from `src/data/*.json` |
| `npm run seed:admin` | (re)create the admin user + role |

## Replacing demo data with the real Lovable export

The demo data lives in `src/data/{trips,spots,journal-articles}.json` and
`src/data/trip-editorials.ts`. Replace those with the real export (same shape),
then `npm run seed:gen && npm run db:reset && npm run seed:admin`. Site copy in
`site_config` is demo content in `scripts/generate-seed.ts` — swap it there.

## Not done in this pass (local-only scope)

- Cloudflare → Netlify deploy adapter swap (the build still targets Cloudflare
  Workers via `@cloudflare/vite-plugin` + `wrangler.jsonc`).
- Flipping public pages to read content from Supabase instead of the JSON files.
