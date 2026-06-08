import { createFileRoute, redirect } from "@tanstack/react-router";

// Renamed in Phase 3: /admin/leads -> /admin/inquiries. Kept as a redirect
// so old bookmarks and the routeTree.gen.ts entry stay valid.
export const Route = createFileRoute("/admin/leads")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/inquiries" });
  },
  component: () => null,
});