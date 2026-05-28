import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) navigate({ to: "/admin/leads", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/leads", replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  async function signIn() {
    setLoading(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin/leads",
    });
    if (result.error) {
      setError(result.error.message ?? "Sign-in failed");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink font-sans flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-3 text-sm text-stone">Sign in to view trip inquiries.</p>
        <button
          onClick={signIn}
          disabled={loading}
          className="mt-8 w-full border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in with Google"}
        </button>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}