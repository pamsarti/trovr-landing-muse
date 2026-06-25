import { createFileRoute } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LoginError = "config" | "denied" | "state" | "oauth";

const ERROR_MESSAGE: Record<LoginError, string> = {
  config:
    "The app isn't fully configured yet. Check the required environment variables in .env.",
  denied: "GitHub sign-in was cancelled.",
  state: "Sign-in session expired or was invalid. Please try again.",
  oauth: "Something went wrong talking to GitHub. Please try again.",
};

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Sign in — Trovr Publisher" }] }),
  validateSearch: (search): { error?: LoginError } => {
    const error = search.error;
    return typeof error === "string" && error in ERROR_MESSAGE
      ? { error: error as LoginError }
      : {};
  },
  component: LoginRoute,
});

function LoginRoute() {
  const { error } = Route.useSearch();

  return (
    <AdminShell>
      <Card className="border-line bg-paper-card">
        <CardContent className="space-y-5 pt-6 text-center">
          <div>
            <h1 className="font-serif text-2xl text-ink">Sign in to publish</h1>
            <p className="mt-2 text-sm text-mid">
              Authorized repository collaborators can publish the website here.
            </p>
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {ERROR_MESSAGE[error as LoginError]}
            </p>
          )}

          {/* Full-page navigation so the server can set the CSRF state cookie
              and 302 to GitHub. */}
          <a href="/api/auth/login" className="block">
            <Button size="lg" className="w-full">
              <Github />
              Continue with GitHub
            </Button>
          </a>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
