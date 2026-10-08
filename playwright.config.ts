import { defineConfig, devices } from "@playwright/test"

// The suite runs against the production build in modules/gob-web/build, so
// run `mise run build` first (`mise run e2e` does both).

const port = Number(process.env.E2E_PORT || 4173)
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node e2e/serve.mjs",
    url: `http://localhost:${port}`,
    env: { PORT: String(port) },
    reuseExistingServer: !isCI,
  },
})
