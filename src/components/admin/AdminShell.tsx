import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

/**
 * Minimal centered layout for the admin dashboard, reusing the site's paper/ink
 * palette and serif branding. Keeps every admin screen visually consistent.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-10 text-ink antialiased">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="font-serif text-3xl lowercase tracking-tight text-ink">
            trovr
          </span>
          <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-mid">
            Publisher
          </p>
        </div>
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
}
