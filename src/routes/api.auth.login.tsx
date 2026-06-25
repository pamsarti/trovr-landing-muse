import { createFileRoute } from "@tanstack/react-router";
import { startGithubLoginFn } from "@/lib/admin/functions";

// GET /api/auth/login — kicks off GitHub OAuth.
// `beforeLoad` runs on the server during this full-page navigation; the server
// function sets the CSRF state cookie and throws a redirect to GitHub, so the
// component below never actually renders.
export const Route = createFileRoute("/api/auth/login")({
  beforeLoad: async () => {
    await startGithubLoginFn();
  },
  component: () => null,
});
