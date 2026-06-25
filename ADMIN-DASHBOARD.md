# Admin Publishing Dashboard

A minimal, self-contained dashboard that lets authorized GitHub collaborators
publish the website to Netlify — without ever opening GitHub or Netlify.

Lives at **`/admin`** inside this app for local development. It's designed to be
split out and hosted separately later (e.g. `publish.example.com`); nothing
about it is coupled to the marketing site routes.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

Open **http://localhost:5173/admin**.

> The dev server is pinned to port **5173** (see `vite.config.ts`) so it matches
> the GitHub OAuth app's registered callback URL.

## How it works

1. **Authentication** — GitHub OAuth. Visiting `/admin` while signed out
   redirects to `/admin/login`. "Continue with GitHub" → `/api/auth/login`
   (sets a CSRF `state` cookie, redirects to GitHub) → GitHub redirects to
   `/api/auth/callback/github`, which exchanges the code for a token and stores
   an **encrypted, http-only session cookie** that persists for 30 days. No
   passwords, OTP, or magic links.
2. **Authorization** — after login the app calls the GitHub API to read the
   user's permission on `GITHUB_OWNER/GITHUB_REPO`. Only **Write / Maintain /
   Admin** can publish. Read / Triage users see an "access denied" panel. The
   publish endpoint re-checks permission server-side on every call.
3. **Publish** — the button calls the `publishFn` server function. No deploy
   secret ever reaches the browser.

## Environment variables

Copy `.env.example` → `.env` and fill in. The app reports missing required
variables on screen instead of crashing.

| Variable | Purpose |
| --- | --- |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `GITHUB_OWNER` / `GITHUB_REPO` | Repo whose collaborators may publish |
| `SESSION_SECRET` | 32+ char key encrypting the session cookie |
| `APP_URL` | Base URL for the OAuth callback (default `http://localhost:5173`) |
| `NETLIFY_DEPLOY_HOOK` | Netlify build hook — used only in live mode |

## Connecting the real Netlify deploy (the one place to change)

The deploy service is isolated in **`src/lib/admin/deploy.server.ts`**. It runs
a **mock** that simulates a successful deploy after ~1.5s. To go live, edit
`triggerDeploy()`:

```ts
export async function triggerDeploy(): Promise<DeployResult> {
  // return mockDeploy();      // ← remove this
  return netlifyDeploy();      // ← uncomment this
}
```

`netlifyDeploy()` is already written — it POSTs to `NETLIFY_DEPLOY_HOOK`. No UI
or other code changes are required.

## File map

| Area | Files |
| --- | --- |
| Config | `src/lib/admin/config.server.ts` |
| Authentication / session | `src/lib/admin/session.server.ts` |
| GitHub OAuth + authorization | `src/lib/admin/github.server.ts` |
| Deployment service (mock → real) | `src/lib/admin/deploy.server.ts` |
| Server functions (RPC) | `src/lib/admin/functions.ts` |
| Shared types | `src/lib/admin/types.ts` |
| UI | `src/components/admin/AdminShell.tsx`, `PublishPanel.tsx` |
| Routes | `src/routes/admin.index.tsx`, `admin.login.tsx`, `api.auth.login.tsx`, `api.auth.callback.github.tsx`, `api.auth.logout.tsx` |
