// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

// Dev-only: load `.dev.vars` into process.env so local SSR / server functions
// can read non-VITE server secrets (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// SUPABASE_PUBLISHABLE_KEY). In dev, TanStack Start runs server code in Node,
// which does NOT read `.dev.vars` (that's a Cloudflare/wrangler convention used
// only at runtime in production). This bridges the gap locally; in production
// these come from the host (Cloudflare/Netlify) environment, not this file.
function loadDevVars(): Plugin {
  return {
    name: "local-dev-vars",
    apply: "serve",
    config() {
      const file = resolve(process.cwd(), ".dev.vars");
      if (!existsSync(file)) return;
      for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let val = line.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        // Override: .dev.vars is the explicit local source of truth and must beat
        // the committed .env (which points at the remote Lovable project).
        process.env[key] = val;
      }
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [loadDevVars()],
});
