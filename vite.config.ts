import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/til-blog/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["src/assets/til-favicon.svg"],
      manifest: {
        name: "TIL Blog",
        short_name: "TIL",
        start_url: "/til-blog/",
        scope: "/til-blog/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#121212",
        icons: [
          {
            src: "src/assets/til-favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
