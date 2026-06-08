import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Home,
  Plane,
  MapPin,
  BookOpen,
  Info,
  Image as ImageIcon,
  Inbox,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";

const NAV: ReadonlyArray<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/trips", label: "Trips", icon: Plane },
  { to: "/admin/spots", label: "Spots", icon: MapPin },
  { to: "/admin/journal", label: "Journal", icon: BookOpen },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen flex bg-[#fafafa] text-[#1a1a1a]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside className="w-60 shrink-0 border-r border-[#e5e5e5] bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-[#e5e5e5]">
          <div className="text-sm font-semibold tracking-tight">trovr admin</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-[#f1f1f1] text-[#1a1a1a] font-medium"
                    : "text-[#525252] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#e5e5e5] px-3 py-3">
          <div className="px-2 pb-2 text-xs text-[#737373] truncate">{email}</div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#525252] hover:bg-[#f5f5f5]"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-14 border-b border-[#e5e5e5] bg-white px-6 flex items-center">
          <h1 className="text-sm font-medium">{title}</h1>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <AdminShell title={title}>
      <div className="rounded-lg border border-dashed border-[#d4d4d4] bg-white p-12 text-center">
        <h2 className="text-base font-medium text-[#1a1a1a]">{title}</h2>
        <p className="mt-2 text-sm text-[#737373]">Coming in Phase 2.</p>
      </div>
    </AdminShell>
  );
}