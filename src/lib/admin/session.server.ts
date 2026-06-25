// Server-only session handling for the admin dashboard.
//
// Sessions are stored in an encrypted, signed, http-only cookie (handled by
// TanStack Start's `useSession`). The cookie persists for 30 days, so an
// authenticated collaborator stays signed in across visits — closing and
// reopening the browser keeps the session, just like GitHub or Gmail.
import { useSession } from "@tanstack/react-start/server";
import { getAdminConfig } from "./config.server";
import type { GithubPermission } from "./types";

const SESSION_NAME = "trovr_admin";
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

/** Data persisted in the encrypted session cookie. */
export interface AdminSessionData {
  login: string;
  name: string | null;
  avatarUrl: string;
  permission: GithubPermission;
  /** GitHub access token — kept server-side only, never sent to the client. */
  accessToken: string;
  authorizedAt: string;
}

export async function getAdminSession() {
  const { config } = getAdminConfig();
  return useSession<AdminSessionData>({
    name: SESSION_NAME,
    password: config.sessionSecret,
    maxAge: THIRTY_DAYS_SECONDS,
    cookie: {
      httpOnly: true,
      sameSite: "lax", // sent on the top-level redirect back from GitHub
      // Browsers accept Secure cookies on http://localhost, but plain http on a
      // LAN IP would reject them — so only require Secure over real https.
      secure: config.appUrl.startsWith("https://"),
      path: "/",
    },
  });
}
