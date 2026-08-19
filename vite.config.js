/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  test: {
    environment: "jsdom",
    /*
     * Well above what these tests need — they render in under a second when they have
     * a core to themselves. Sixteen jsdom environments in parallel on a two-core runner
     * do not, and the 5s default failed roughly one full-suite run in three while every
     * one of them passed when run serially. High enough to absorb that, low enough to
     * still catch a test that has genuinely hung.
     */
    testTimeout: 20000,
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"]
  }
});