import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plain TanStack Start config (ejected from @lovable.dev/vite-tanstack-config).
// Prerenders every reachable route to static HTML so the site can be served as
// a static site on Netlify (no server functions, no backend). The framework is
// retained, so server-rendering can be re-enabled later (e.g. when the CMS / map
// data needs it) without a rewrite.
//
// Deploy target: Nitro auto-detects Netlify on Netlify CI. To build the Netlify
// output locally, run:  NITRO_PRESET=netlify npm run build
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
});
