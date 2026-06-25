import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// NOTE on Netlify deploys: the Nitro preset is NOT set here on purpose. The
// Lovable bot manages/overwrites this file, so the Netlify build target is
// pinned via the `NITRO_PRESET=netlify` environment variable in the Netlify UI
// instead (which Lovable can't touch). Don't add `nitro: { preset }` here
// expecting it to control Netlify — it would just get reverted.
//
// `server.port` only affects `vite dev`; it's pinned to 5173 so local dev
// matches the GitHub OAuth callback URL. If Lovable reverts this, run
// `npm run dev -- --port 5173` instead.
export default defineConfig({
  vite: {
    server: { port: 5173, strictPort: true },
  },
});
