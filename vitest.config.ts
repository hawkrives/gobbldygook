import { defineConfig } from "vitest/config"

export default defineConfig({
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
