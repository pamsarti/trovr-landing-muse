import { createFileRoute, redirect } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDashboardDataFn } from "@/lib/admin/functions";
import { canPublish, type GithubPermission } from "@/lib/admin/types";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Publisher — Trovr" }] }),
  loader: async () => {
    const data = await getDashboardDataFn();
    // Not configured yet: render the config screen instead of redirecting.
    if (data.configError.length > 0) return data;
    // Not signed in: send to the login screen.
    if (!data.user) throw redirect({ to: "/admin/login" });
    return data;
  },
  component: DashboardRoute,
});

const PERMISSION_LABEL: Record<GithubPermission, string> = {
  none: "No access",
  read: "Read",
  triage: "Triage",
  write: "Write",
  maintain: "Maintain",
  admin: "Admin",
};

function DashboardRoute() {
  const data = Route.useLoaderData();

  if (data.configError.length > 0) {
    return <ConfigError missing={data.configError} />;
  }

  // Loader guarantees a user past this point.
  const user = data.user!;
  const allowed = canPublish(user.permission);

  return (
    <AdminShell>
      <Card className="border-line bg-paper-card">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <Avatar className="h-11 w-11">
            <AvatarImage src={user.avatarUrl} alt={user.login} />
            <AvatarFallback>
              {user.login.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {user.name ?? user.login}
            </p>
            <p className="truncate text-xs text-mid">@{user.login}</p>
          </div>
          <a href="/api/auth/logout">
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </a>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-mid">
                Repository
              </p>
              <p className="mt-1 truncate text-ink">
                {data.repo?.owner}/{data.repo?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-mid">
                Permission
              </p>
              <Badge
                variant={allowed ? "secondary" : "destructive"}
                className="mt-1"
              >
                {PERMISSION_LABEL[user.permission]}
              </Badge>
            </div>
          </div>

          {allowed ? (
            <PublishPanel initial={data.deployment} />
          ) : (
            <AccessDenied permission={user.permission} />
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}

function AccessDenied({ permission }: { permission: GithubPermission }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-5 text-center">
      <ShieldAlert className="mx-auto mb-2 h-6 w-6 text-destructive" />
      <p className="text-sm font-medium text-ink">Publishing not allowed</p>
      <p className="mt-1 text-xs text-mid">
        Your <span className="font-medium">{PERMISSION_LABEL[permission]}</span>{" "}
        permission is read-only. You need Write, Maintain, or Admin access to
        this repository to publish.
      </p>
    </div>
  );
}

function ConfigError({ missing }: { missing: string[] }) {
  return (
    <AdminShell>
      <Card className="border-destructive/30 bg-paper-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <p className="text-sm font-medium text-ink">
              Configuration incomplete
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-mid">
            The following environment variable
            {missing.length > 1 ? "s are" : " is"} missing. Add{" "}
            {missing.length > 1 ? "them" : "it"} to your <code>.env</code> file
            (see <code>.env.example</code>) and restart the dev server:
          </p>
          <ul className="mt-3 space-y-1">
            {missing.map((name) => (
              <li
                key={name}
                className="rounded bg-paper px-2 py-1 font-mono text-xs text-ink"
              >
                {name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
