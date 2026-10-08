import { test, expect } from "./fixtures/test"

test.describe("student picker", () => {
  test("offers to add a student when there are none", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: "GobbldygooK", level: 1 }),
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Add a Student" }),
    ).toBeVisible()

    await page.getByRole("link", { name: "Add a Student" }).click()
    await expect(page).toHaveURL(/\/create\/?$/)
  })

  test("lists saved students and opens one", async ({ page, app }) => {
    await page.goto("/")
    await app.seedStudents(
      { id: "ada", name: "Ada Lovelace", majors: ["Computer Science"] },
      { id: "emmy", name: "Emmy Noether", majors: ["Mathematics"] },
    )
    await page.reload()

    let students = page.getByRole("link", { name: /Lovelace|Noether/ })
    await expect(students).toHaveCount(2)
    await expect(
      page.getByRole("link", { name: /Ada Lovelace.*Computer Science/ }),
    ).toBeVisible()

    await page.getByRole("link", { name: /Emmy Noether/ }).click()
    await expect(page).toHaveURL(/\/student\/emmy\/?$/)
    await expect(page.getByRole("textbox", { name: /^Name:/ })).toHaveValue(
      "Emmy Noether",
    )
  })

  test("filters students by name", async ({ page, app }) => {
    await page.goto("/")
    await app.seedStudents(
      { id: "ada", name: "Ada Lovelace" },
      { id: "emmy", name: "Emmy Noether" },
    )
    await page.reload()

    await page.getByRole("searchbox", { name: "Filter students" }).fill("emmy")

    await expect(page.getByRole("link", { name: /Emmy Noether/ })).toBeVisible()
    await expect(page.getByRole("link", { name: /Ada Lovelace/ })).toBeHidden()
  })

  test("deletes a student in edit mode", async ({ page, app }) => {
    await page.goto("/")
    await app.seedStudents(
      { id: "ada", name: "Ada Lovelace" },
      { id: "emmy", name: "Emmy Noether" },
    )
    await page.reload()

    await page.getByRole("button", { name: "Edit" }).click()
    let ada = page.getByRole("listitem").filter({ hasText: "Ada Lovelace" })
    await ada.getByRole("button", { name: "Delete" }).click()

    await expect(page.getByRole("link", { name: /Ada Lovelace/ })).toBeHidden()
    await expect(page.getByRole("link", { name: /Emmy Noether/ })).toBeVisible()
    expect(await app.storedStudent("ada")).toBeNull()

    // and it stays gone after a reload
    await page.reload()
    await expect(page.getByRole("link", { name: /Emmy Noether/ })).toBeVisible()
    await expect(page.getByRole("link", { name: /Ada Lovelace/ })).toBeHidden()
  })
})
