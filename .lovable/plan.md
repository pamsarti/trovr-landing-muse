
# TROVR Admin CMS — Phase 1

## Decisions

- **Reuse existing admin system** (`user_roles` + `is_admin()`). You're already seeded as admin. No new `admin_users` table.
- **Fold existing `/admin/leads` into the new `/admin` shell** as one sidebar item. Old `/login` route becomes `/admin/login`.
- **Add email+password sign-in** alongside the existing Google sign-in (per spec).
- **JSON files stay in repo** as backup but are no longer imported.

## Database (one migration)

Create 4 tables. All public-readable (so the public site can render without auth), admin-only writable.

- **trips** — mirrors `trips.json` + `editorial_paragraph`, `hero_image_url`, `photo_urls text[]`
- **spots** — mirrors `spots.json` + `hero_image_url`
- **journal_articles** — mirrors `journal-articles.json`
- **site_config** — `key text PK`, `value jsonb`, `updated_at`. Seeded with: homepage hero (headline/subline), 3 manifesto paragraphs, stats array, about page body, footer text, newsletter heading/subline.
- **activity_log** — `id, actor_email, action, entity_type, entity_id, created_at` (for the dashboard "recent activity" feed)

RLS pattern per table:
- `SELECT` → `true` (public read, since the public site reads these)
- `INSERT/UPDATE/DELETE` → `is_admin()` only
- GRANTs: `SELECT` to `anon`+`authenticated`; full CRUD to `authenticated` (gated by RLS); ALL to `service_role`

Storage bucket **`trovr-media`** (public read, admin write via storage.objects RLS).

## Data migration (one-time seed script via supabase--insert)

Read all three JSON files, transform into SQL INSERTs, and seed in one batch. Editorial paragraphs from `src/data/trip-editorials.ts` get folded into the `editorial_paragraph` column. Hero image URLs come from the `tripImage()` helper, computed at seed time. Same for spots.

## Public site switch

Replace `import rawTrips from "@/data/trips.json"` (and equivalents for spots/journal/site_config) with server functions that read from Supabase, fetched via TanStack Query in route loaders. Pages affected:

- `/` (homepage — reads site_config + featured trips)
- `/trips`, `/trips/$id`, `/trips/theme/$slug`
- `/spots`, `/spots/$continent`, `/spots/$continent/$region`, `/spots/$continent/$region/$spot`
- `/journal`, `/journal/$slug`
- `/about`

The `lib/trips-data.ts`, `lib/spots-data.ts`, `lib/journal-data.ts` helpers stay (for filtering/derivation logic), but their data source flips from JSON imports to server-fn-fed React Query data. Public Inquire form stays unchanged.

## Routes — new admin shell

```text
/admin/login                  email+password + "Sign in with Google" + forgot password
/admin/reset-password         password reset target
/admin                        layout (sidebar + outlet), gated by is_admin()
  ├── /admin                  Dashboard (counts + activity feed)
  ├── /admin/homepage         Placeholder — "Coming in Phase 2"
  ├── /admin/trips            Placeholder
  ├── /admin/spots            Placeholder
  ├── /admin/journal          Placeholder
  ├── /admin/about            Placeholder
  ├── /admin/media            Placeholder
  ├── /admin/leads            Existing leads viewer, restyled into new shell
  └── /admin/settings         Placeholder
```

Auth gate: client-side `beforeLoad` checks `supabase.auth.getUser()` + verifies `is_admin()` via a server fn. Non-admin → redirect to `/admin/login` with "Access restricted" message. Old `/login` and `/admin/leads` top-level routes get deleted (their content moves into the new shell).

## Admin UI design

Utility, not editorial. **Inter only** (no Fraunces serif). Gray/white palette using new tokens (`--admin-bg`, `--admin-surface`, `--admin-border`, `--admin-text`, `--admin-muted`) scoped to `/admin/*` only — won't touch public site tokens. Fixed left sidebar (240px), top bar with logout, main content area. Reference: Linear / Vercel dashboard.

## Dashboard counts

Server fn returns `{ trips, spots, articles, media, leads }` counts + last 10 activity_log entries. Rendered as a row of stat cards + a simple table.

---

## Technical notes

- All DB reads from public routes use `createServerFn` with `supabaseAdmin` (scoped via `WHERE` + safe-column projection) so SSR works without a session.
- All admin writes use `createServerFn` + `requireSupabaseAuth` + an `is_admin()` check inside the handler.
- Email+password sign-in calls `supabase.auth.signInWithPassword`. Sign-up is NOT exposed (only seeded admins exist).
- Password reset uses `supabase.auth.resetPasswordForEmail` → `/admin/reset-password` page that calls `supabase.auth.updateUser({password})`.
- Storage bucket created via `supabase--storage_create_bucket`; RLS on `storage.objects` restricts writes to `is_admin()`.

## What I'll deliver

1. Migration creating 5 tables + RLS + GRANTs + storage bucket policies
2. Data seed (run via `supabase--insert` after migration approval) — reports row counts back
3. Server fns for all content reads (`*.functions.ts`)
4. Updated lib helpers + route loaders consuming server fns
5. New `/admin` shell with sidebar, dashboard, placeholders, leads page
6. `/admin/login` + `/admin/reset-password`
7. Deletion of old `/login` and `/admin/leads` top-level routes
8. Verification report: row counts per table + confirmation public site renders

## What stays untouched

- Public Inquire form & `leads` table
- Public site visual design
- JSON files (kept as backup)
- `pamela.ssarti@gmail.com` admin status (already seeded)
