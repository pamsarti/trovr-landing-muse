import { createFileRoute } from "@tanstack/react-router";
import { AdminGate } from "@/components/admin/AdminGate";
import { PlaceholderPage } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/media")({
  component: () => (
    <AdminGate>
      <PlaceholderPage title="Media" />
    </AdminGate>
  ),
});