import { createFileRoute } from "@tanstack/react-router";
import { logoutFn } from "@/lib/admin/functions";

// GET /api/auth/logout — clears the session and redirects to the login page.
export const Route = createFileRoute("/api/auth/logout")({
  beforeLoad: async () => {
    await logoutFn();
  },
  component: () => null,
});
