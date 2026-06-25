// Server-only configuration for the admin dashboard.
// Reads everything from environment variables — nothing here is ever bundled
// into the client (the file is only ever imported from server functions).

let envLoaded = false;

/**
 * Ensure `.env` values are present on `process.env`.
 *
 * In production (Nitro) the `.env` file is loaded automatically, but the Vite
 * dev server only injects `VITE_`-prefixed variables. We load the rest here so
 * server functions can read secrets like GITHUB_CLIENT_SECRET during local dev.
 * Node >= 20.12 ships `process.loadEnvFile`; we call it defensively and ignore
 * any failure (e.g. the file genuinely doesn't exist in a deployed env).
 */
function ensureEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;
  if (process.env.GITHUB_CLIENT_ID) return; // already populated
  try {
    process.loadEnvFile();
  } catch {
    // No .env file present — rely on the host's environment variables.
  }
}

export interface AdminConfig {
  githubClientId: string;
  githubClientSecret: string;
  githubOwner: string;
  githubRepo: string;
  sessionSecret: string;
  /** Optional while running the mocked deploy flow locally. */
  netlifyDeployHook: string | undefined;
  /** Base URL used to build the OAuth callback (must match the GitHub app). */
  appUrl: string;
}

/** Variables that must be set for the dashboard to function. */
const REQUIRED_VARS = [
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "SESSION_SECRET",
] as const;

/**
 * Read and validate configuration.
 *
 * Never throws on missing config — instead returns the list of missing
 * variables so the UI can show a friendly message instead of crashing.
 */
export function getAdminConfig(): {
  config: AdminConfig;
  missing: string[];
} {
  ensureEnvLoaded();

  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

  const config: AdminConfig = {
    githubClientId: process.env.GITHUB_CLIENT_ID ?? "",
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    githubOwner: process.env.GITHUB_OWNER ?? "",
    githubRepo: process.env.GITHUB_REPO ?? "",
    sessionSecret: process.env.SESSION_SECRET ?? "",
    netlifyDeployHook: process.env.NETLIFY_DEPLOY_HOOK?.trim() || undefined,
    appUrl: (process.env.APP_URL ?? "http://localhost:5173").replace(/\/$/, ""),
  };

  return { config, missing };
}

/** The exact callback URL registered with the GitHub OAuth app. */
export function getCallbackUrl(config: AdminConfig): string {
  return `${config.appUrl}/api/auth/callback/github`;
}
