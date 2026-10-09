import { test, expect } from "./fixtures/test"
import type { Page } from "@playwright/test"
import LZString from "lz-string"

// The editor screen has three panes: the YAML source, the compiled JSON
// from @gob/hanson-format, and a rendered area of study.
const source = (page: Page) => page.locator(".cm-content").nth(0)
const compiled = (page: Page) => page.locator(".cm-content").nth(1)

// The editor saves its source into the URL hash, compressed with lz-string.
function sourceInUrl(page: Page): string {
  const hash = new URL(page.url()).hash.slice(1)
  const state = LZString.decompressFromEncodedURIComponent(hash)
  if (!state) return ""
  const { content } = JSON.parse(state) as { content?: unknown }
  // oxlint-disable-next-line typescript/no-base-to-string -- content is the YAML string the editor saved; String() only coerces unexpected JSON
  return String(content ?? "")
}

async function typeSource(page: Page, yaml: string) {
  await source(page).click()
  // Insert the whole document as one edit: CodeMirror would auto-indent
  // typed newlines, and the controlled editor can drop fast keystrokes.
  await page.keyboard.insertText(yaml.trim() + "\n")
}

test.describe("area editor", () => {
  test("starts empty", async ({ page }) => {
    await page.goto("/areas")

    await expect(page.getByText("Area of Study Editor")).toBeVisible()
    await expect(page.getByText("No data entered")).toBeVisible()
  })

  test("parses a Hanson-format area as you type", async ({ page }) => {
    await page.goto("/areas")

    await typeSource(
      page,
      `
name: Test Studies
type: Major
revision: '2020-21'
result: CSCI 121
`,
    )

    await expect(compiled(page)).toContainText('"$type": "requirement"')
    await expect(compiled(page)).toContainText('"slug": "test-studies"')
    await expect(
      page.getByRole("heading", { name: "Test Studies", level: 1 }),
    ).toBeVisible()
    await expect(compiled(page)).toContainText('"department": "CSCI"')
  })

  test("keeps the source in the URL so it survives a reload", async ({
    page,
  }) => {
    await page.goto("/areas")
    await typeSource(page, "name: Shareable\ntype: Major\nresult: CSCI 121")
    // The empty editor writes a hash on load too, so wait for the typed
    // source itself to reach the URL before reloading.
    await expect.poll(() => sourceInUrl(page)).toContain("name: Shareable")

    await page.reload()

    await expect(source(page)).toContainText("name: Shareable")
    await expect(
      page.getByRole("heading", { name: "Shareable", level: 1 }),
    ).toBeVisible()
  })

  test("shows the parser's error for an invalid area", async ({ page }) => {
    await page.goto("/areas")

    await typeSource(page, "name: Missing a Result\ntype: Major")

    await expect(compiled(page)).toContainText('"result" is a required key')
    await expect(
      page
        .getByRole("paragraph")
        .filter({ hasText: '"result" is a required key' }),
    ).toBeVisible()
  })
})
