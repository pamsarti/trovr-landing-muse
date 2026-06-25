// Server-only GitHub OAuth + authorization helpers.
//
// Responsibilities:
//   1. Build the GitHub authorize URL (login step).
//   2. Exchange an OAuth `code` for an access token.
//   3. Look up the authenticated user.
//   4. Resolve the user's permission on the configured repository.
//
// The OAuth client secret never leaves this module, and this module is only
// ever imported from server functions — so it is stripped from the client
// bundle entirely.
import { getAdminConfig, getCallbackUrl, type AdminConfig } from "./config.server";
import type { GithubPermission } from "./types";

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";
const GITHUB_API = "https://api.github.com";

// `repo` scope lets us read repository permissions even for private repos.
const OAUTH_SCOPE = "repo read:user";

/** Build the URL we redirect the browser to so the user can authorize. */
export function buildAuthorizeUrl(config: AdminConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: getCallbackUrl(config),
    scope: OAUTH_SCOPE,
    state,
    allow_signup: "false",
  });
  return `${GITHUB_AUTHORIZE}?${params.toString()}`;
}

/** Exchange the authorization `code` for a user access token. */
export async function exchangeCodeForToken(
  config: AdminConfig,
  code: string,
): Promise<string> {
  const res = await fetch(GITHUB_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: config.githubClientId,
      client_secret: config.githubClientSecret,
      code,
      redirect_uri: getCallbackUrl(config),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub token exchange failed (HTTP ${res.status})`);
  }

  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (data.error || !data.access_token) {
    throw new Error(
      `GitHub token exchange rejected: ${data.error_description ?? data.error ?? "unknown error"}`,
    );
  }

  return data.access_token;
}

export interface GithubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
}

/** Fetch the profile of the user the token belongs to. */
export async function fetchGithubUser(token: string): Promise<GithubUser> {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: githubHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Failed to load GitHub profile (HTTP ${res.status})`);
  }
  const data = (await res.json()) as {
    login: string;
    name: string | null;
    avatar_url: string;
  };
  return { login: data.login, name: data.name, avatarUrl: data.avatar_url };
}

/**
 * Resolve the authenticated user's permission on the configured repository.
 *
 * We read the `permissions` block returned by `GET /repos/{owner}/{repo}`,
 * which reflects *the requesting user's* access. If the repo is not visible to
 * the user (404), they have no access.
 */
export async function fetchRepoPermission(
  config: AdminConfig,
  token: string,
): Promise<GithubPermission> {
  const res = await fetch(
    `${GITHUB_API}/repos/${config.githubOwner}/${config.githubRepo}`,
    { headers: githubHeaders(token) },
  );

  if (res.status === 404) return "none";
  if (!res.ok) {
    throw new Error(`Failed to read repository permissions (HTTP ${res.status})`);
  }

  const data = (await res.json()) as {
    permissions?: {
      admin?: boolean;
      maintain?: boolean;
      push?: boolean;
      triage?: boolean;
      pull?: boolean;
    };
  };

  return mapPermission(data.permissions);
}

function mapPermission(
  p: {
    admin?: boolean;
    maintain?: boolean;
    push?: boolean;
    triage?: boolean;
    pull?: boolean;
  } = {},
): GithubPermission {
  if (p.admin) return "admin";
  if (p.maintain) return "maintain";
  if (p.push) return "write";
  if (p.triage) return "triage";
  if (p.pull) return "read";
  return "none";
}

function githubHeaders(token: string): HeadersInit {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "x-github-api-version": "2022-11-28",
    "user-agent": "trovr-publisher",
  };
}

/** Convenience wrapper used by the callback handler. */
export async function resolveGithubIdentity(token: string) {
  const { config } = getAdminConfig();
  const [user, permission] = await Promise.all([
    fetchGithubUser(token),
    fetchRepoPermission(config, token),
  ]);
  return { user, permission };
}
