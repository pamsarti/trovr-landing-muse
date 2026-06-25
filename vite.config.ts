import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Pin the dev server to port 5173 so it matches the GitHub OAuth app's
// registered Homepage / callback URL (http://localhost:5173/...). strictPort
// makes startup fail loudly if 5173 is taken, rather than silently moving to a
// port the OAuth callback wouldn't match.
export default defineConfig({
  vite: {
    server: { port: 5173, strictPort: true },
  },
});
