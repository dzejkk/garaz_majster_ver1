import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter(), // Tento plugin sa postará o auto-generovanie typov pre cesty
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
    port: 3000,
    proxy: {
      // Presmeruje všetky požiadavky z /api na náš backend, aby sme nemuseli riešiť CORS
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
