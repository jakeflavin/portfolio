/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  test: {
    // ✅ default unit test environment
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],

    // ✅ unit tests (jsdom) + Storybook tests (browser) as separate projects
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
          environment: "jsdom",
          globals: true,
          setupFiles: ["./src/test/setup.ts"]
        }
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook")
          })
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }]
          },
          setupFiles: [".storybook/vitest.setup.ts"]
        }
      }
    ]
  }
});