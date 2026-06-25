// Server functions for the admin dashboard.
//
// Every handler runs server-side only. Server-only modules (which read secrets)
// are imported dynamically *inside* the handlers so they are never included in
// the client bundle — matching the convention used by the Supabase integration
// in this project.
import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { canPublish, type DashboardData, type DeploymentState } from "@/lib/admin/types";

const STATE_COOKIE = "gh_oauth_state";

/**
 * Step 1 of login: generate a CSRF `state`, remember it in a short-lived
 * cookie, and redirect the browser to GitHub's authorize screen.
 */
export const startGithubLoginFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAdminConfig } = await import("@/lib/admin/config.server");
    const { buildAuthorizeUrl } = await import("@/lib/admin/github.server");
    const { setCookie } = await import("@tanstack/react-start/server");

    const { config, missing } = getAdminConfig();
    if (missing.length > 0) {
      // Can't start OAuth without credentials — send the user back to the
      // login page, which renders a clear "missing configuration" message.
      throw redirect({ to: "/admin/login", search: { error: "config" } });
    }

    const state = crypto.randomUUID();
    setCookie(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.appUrl.startsWith("https://"),
      maxAge: 60 * 10, // 10 minutes to complete the round-trip
      path: "/",
    });

    throw redirect({ href: buildAuthorizeUrl(config, state) });
  },
);

/**
 * Step 2 of login: GitHub redirects back here with `code` + `state`. We verify
 * the state, exchange the code for a token, resolve the user's repo
 * permission, persist the session, and land them on the dashboard.
 */
export const handleGithubCallbackFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAdminConfig } = await import("@/lib/admin/config.server");
    const { exchangeCodeForToken, resolveGithubIdentity } = await import(
      "@/lib/admin/github.server"
    );
    const { getAdminSession } = await import("@/lib/admin/session.server");
    const { getRequestUrl, getCookie, deleteCookie } = await import(
      "@tanstack/react-start/server"
    );

    const { config, missing } = getAdminConfig();
    if (missing.length > 0) {
      throw redirect({ to: "/admin/login", search: { error: "config" } });
    }

    const url = getRequestUrl();
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const expectedState = getCookie(STATE_COOKIE);
    deleteCookie(STATE_COOKIE, { path: "/" });

    // GitHub can also redirect here with `?error=access_denied` if the user
    // declines the authorization prompt.
    if (url.searchParams.get("error")) {
      throw redirect({ to: "/admin/login", search: { error: "denied" } });
    }
    if (!code || !state || !expectedState || state !== expectedState) {
      throw redirect({ to: "/admin/login", search: { error: "state" } });
    }

    try {
      const token = await exchangeCodeForToken(config, code);
      const { user, permission } = await resolveGithubIdentity(token);

      const session = await getAdminSession();
      await session.update({
        login: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        permission,
        accessToken: token,
        authorizedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[admin] GitHub callback failed:", err);
      throw redirect({ to: "/admin/login", search: { error: "oauth" } });
    }

    throw redirect({ to: "/admin" });
  },
);

/** Clear the session and return to the login page. */
export const logoutFn = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSession } = await import("@/lib/admin/session.server");
  const session = await getAdminSession();
  await session.clear();
  throw redirect({ to: "/admin/login" });
});

/** Everything the dashboard route needs for its initial server render. */
export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardData> => {
    const { getAdminConfig } = await import("@/lib/admin/config.server");
    const { getLastDeployment } = await import("@/lib/admin/deploy.server");

    const { config, missing } = getAdminConfig();
    if (missing.length > 0) {
      return { configError: missing, user: null, repo: null, deployment: getLastDeployment() };
    }

    const { getAdminSession } = await import("@/lib/admin/session.server");
    const session = await getAdminSession();
    const data = session.data;

    const user = data.login
      ? {
          login: data.login,
          name: data.name ?? null,
          avatarUrl: data.avatarUrl ?? "",
          permission: data.permission ?? "none",
        }
      : null;

    return {
      configError: [],
      user,
      repo: { owner: config.githubOwner, name: config.githubRepo },
      deployment: getLastDeployment(),
    };
  },
);

/**
 * Publish action. Re-checks the session permission server-side (never trusting
 * the client) before calling the isolated deployment service.
 */
export const publishFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<DeploymentState> => {
    const { getAdminSession } = await import("@/lib/admin/session.server");
    const { triggerDeploy, recordDeployment } = await import(
      "@/lib/admin/deploy.server"
    );

    const session = await getAdminSession();
    const permission = session.data.permission;

    if (!permission || !canPublish(permission)) {
      throw new Error(
        "Unauthorized: your GitHub permission does not allow publishing.",
      );
    }

    const result = await triggerDeploy();
    return recordDeployment(result);
  },
);
