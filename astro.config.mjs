// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  server: {
    host: true,
    port: 4324,
    allowedHosts: ["simisumaq.controlstock.online"],
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
