// Shared types for the admin publishing dashboard.
// This file is safe to import from both client and server code — it contains
// no secrets and no server-only imports.

/** GitHub repository permission levels, ordered from least to most privileged. */
export type GithubPermission =
  | "none"
  | "read"
  | "triage"
  | "write"
  | "maintain"
  | "admin";

/** Permission levels that are allowed to publish (write or higher). */
export const PUBLISH_PERMISSIONS: GithubPermission[] = [
  "write",
  "maintain",
  "admin",
];

export function canPublish(permission: GithubPermission): boolean {
  return PUBLISH_PERMISSIONS.includes(permission);
}

/** The authenticated GitHub user, as surfaced to the dashboard UI. */
export interface AdminUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  permission: GithubPermission;
}

export type DeployStatus =
  | "idle" // never deployed in this session
  | "building" // a deploy is currently running (mock)
  | "success"
  | "failed";

/** Last known deployment, shown on the dashboard. */
export interface DeploymentState {
  status: DeployStatus;
  /** ISO timestamp of the last deploy attempt, or null if none yet. */
  timestamp: string | null;
  message: string | null;
}

/**
 * The full payload the dashboard route loads on the server.
 * Exactly one of `configError` / `user` is meaningful at a time.
 */
export interface DashboardData {
  /** Missing required environment variables, if any. Empty when configured. */
  configError: string[];
  /** null when the visitor is not signed in. */
  user: AdminUser | null;
  repo: { owner: string; name: string } | null;
  deployment: DeploymentState;
}
