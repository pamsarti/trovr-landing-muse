import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    reason: (s.reason as string) ?? null,
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { reason } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in AND admin, jump to dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (role) navigate({ to: "/admin", replace: true });
    })();
  }, [navigate]);

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  async function signInWithGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) setError(result.error.message ?? "Sign-in failed");
  }

  async function forgot() {
    if (!email) {
      setError("Enter your email above first, then click 'Forgot password'.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin/reset-password",
    });
    setError(error ? error.message : "Reset link sent. Check your inbox.");
  }

  return (
    <main
      className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="w-full max-w-sm bg-white border border-[#e5e5e5] rounded-lg p-8">
        <h1 className="text-base font-semibold text-[#1a1a1a]">trovr admin</h1>
        <p className="mt-1 text-sm text-[#737373]">Sign in to manage content.</p>

        {reason === "restricted" && (
          <div className="mt-4 rounded-md bg-[#fef2f2] border border-[#fecaca] px-3 py-2 text-xs text-[#b91c1c]">
            Access restricted. This account is not authorized.
          </div>
        )}

        <form onSubmit={signInWithPassword} className="mt-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#d4d4d4] rounded-md text-sm focus:outline-none focus:border-[#1a1a1a]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#525252] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#d4d4d4] rounded-md text-sm focus:outline-none focus:border-[#1a1a1a]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white text-sm font-medium py-2 rounded-md hover:bg-black disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e5e5e5]" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-[#737373]">or</span></div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full border border-[#d4d4d4] text-sm py-2 rounded-md hover:bg-[#fafafa]"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={forgot}
          className="mt-4 w-full text-xs text-[#737373] hover:text-[#1a1a1a] underline"
        >
          Forgot password
        </button>

        {error && <p className="mt-4 text-xs text-[#b91c1c]">{error}</p>}

        <Link
          to="/"
          className="mt-6 block text-center text-xs text-[#737373] hover:text-[#1a1a1a]"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
}