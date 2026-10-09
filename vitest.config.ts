import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [
    {
      // gob-web imports its workers with Vite's `?worker` suffix. jsdom has no
      // Worker, so tests load the module itself, whose default export is a
      // stand-in (see modules/gob-web/workers/lib.ts).
      name: "worker-stand-in",
      enforce: "pre",
      resolveId(id, importer) {
        if (id.endsWith("?worker")) {
          return this.resolve(id.slice(0, -"?worker".length), importer)
        }
        return null
      },
    },
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "modules/**/__tests__/**/*.{ts,tsx}",
      "modules/**/*.test.{ts,tsx}",
    ],
    exclude: [
      "**/node_modules/**",
      "**/*.support.{ts,tsx}",
      "**/__support__/**",
    ],
    setupFiles: ["./config/test-harness.js"],
    reporters: [
      "default",
      [
        "@flakiness/vitest",
        {
          flakinessProject: "gobbldygook/gobbldygook",
          title: "Vitest",
          outputFolder: "flakiness-report/vitest",
        },
      ],
    ],
    coverage: {
      provider: "v8",
      include: ["modules/**/*.{ts,tsx}"],
      exclude: ["**/node_modules/**", "**/__tests__/**", "**/*.test.{ts,tsx}"],
      reporter: ["json", "lcov", "text-summary"],
    },
  },
})
