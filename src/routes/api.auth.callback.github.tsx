import { createFileRoute } from "@tanstack/react-router";
import { handleGithubCallbackFn } from "@/lib/admin/functions";

// GET /api/auth/callback/github — GitHub's OAuth redirect target.
// The server function reads `code` + `state` from the request, exchanges the
// code for a token, persists the session, and throws a redirect to /admin.
export const Route = createFileRoute("/api/auth/callback/github")({
  beforeLoad: async () => {
    await handleGithubCallbackFn();
  },
  component: () => null,
});
