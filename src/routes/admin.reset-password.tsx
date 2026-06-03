import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Password updated. Redirecting…");
    setTimeout(() => navigate({ to: "/admin", replace: true }), 800);
  }

  return (
    <main
      className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-[#e5e5e5] rounded-lg p-8">
        <h1 className="text-base font-semibold">Set a new password</h1>
        <p className="mt-1 text-sm text-[#737373]">Choose a strong password.</p>
        <div className="mt-6">
          <label className="block text-xs font-medium text-[#525252] mb-1">New password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-[#d4d4d4] rounded-md text-sm focus:outline-none focus:border-[#1a1a1a]"
          />
        </div>
        <button
          disabled={loading}
          className="mt-4 w-full bg-[#1a1a1a] text-white text-sm font-medium py-2 rounded-md hover:bg-black disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
        {msg && <p className="mt-4 text-xs text-[#525252]">{msg}</p>}
      </form>
    </main>
  );
}