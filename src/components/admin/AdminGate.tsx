import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-only gate. Checks for an active session and verifies the
 * signed-in user has the 'admin' role in user_roles. If not, redirect
 * to /admin/login with a notice.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (!cancelled) navigate({ to: "/admin/login", replace: true });
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      if (!role) {
        await supabase.auth.signOut();
        navigate({
          to: "/admin/login",
          search: { reason: "restricted" },
          replace: true,
        });
        return;
      }
      setState("ok");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <p className="text-sm text-[#737373]">Loading…</p>
      </div>
    );
  }
  return <>{children}</>;
}