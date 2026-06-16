// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  output: "server",
  site: "https://asociacionsimisumaq.org",
  server: {
    host: true,
    port: 4324,
    allowedHosts: true,
  },
  security: {
    checkOrigin: false,
  },
  adapter: node({
    mode: "standalone",
  }),
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["better-sqlite3"],
    },
  },
});
