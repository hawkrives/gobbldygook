import { defineConfig, devices } from "@playwright/test"

// The suite runs against the production build in modules/gob-web/build, so
// run `mise run build` first (`mise run e2e` does both).

// An empty E2E_PORT falls back to the default port.
const portSetting = process.env.E2E_PORT
const port =
  portSetting !== undefined && portSetting !== "" ? Number(portSetting) : 4173
const isCI = Boolean(process.env.CI)
// An empty FLAKINESS_TITLE falls back to the default title too.
const flakinessTitle = process.env.FLAKINESS_TITLE

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [
    ...(isCI ? [["github"], ["html", { open: "never" }]] : [["list"]]),
    [
      "@flakiness/playwright",
      {
        flakinessProject: "gobbldygook/gobbldygook",
        title:
          flakinessTitle !== undefined && flakinessTitle !== ""
            ? flakinessTitle
            : "Playwright",
        outputFolder: "flakiness-report/playwright",
      },
    ],
  ],
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
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "node e2e/serve.mjs",
    url: `http://localhost:${port}`,
    env: { PORT: String(port) },
    reuseExistingServer: !isCI,
  },
})
