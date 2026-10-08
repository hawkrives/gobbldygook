import { test, expect } from "./fixtures/test"
import type { Page } from "@playwright/test"

// The editor screen has three panes: the YAML source, the compiled JSON
// from @gob/hanson-format, and a rendered area of study.
const source = (page: Page) => page.locator(".cm-content").nth(0)
const compiled = (page: Page) => page.locator(".cm-content").nth(1)

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
    await expect(page).toHaveURL(/\/areas#.+/)

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
