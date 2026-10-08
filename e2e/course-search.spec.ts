import { test, expect } from "./fixtures/test"
import { FIRST_YEAR, YEARS } from "./fixtures/data"
import type { Page } from "@playwright/test"

async function search(page: Page, query: string) {
  let box = page.getByRole("searchbox", {
    name: "Search for a course or phrase",
  })
  await box.fill(query)
  await box.press("Enter")
}

const resultTitles = (page: Page) =>
  page.locator("article").getByRole("heading", { level: 1 })

test.describe("course search", () => {
  test.beforeEach(async ({ app }) => {
    await app.loadData()
  })

  test("is linked from the student picker", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: "Courses" }).click()

    await expect(page).toHaveURL(/\/search\/?$/)
    await expect(
      page.getByRole("heading", { name: "Course Search" }),
    ).toBeVisible()
    await expect(page.getByText("Search for something!")).toBeVisible()
  })

  test("finds courses by words in their title, grouped by term", async ({
    page,
  }) => {
    await page.goto("/search")
    await search(page, "software")

    // one section of Software Design per year of fixture data
    await expect(resultTitles(page)).toHaveCount(YEARS.length)
    await expect(resultTitles(page).first()).toHaveText("Software Design")
    for (let year of YEARS) {
      await expect(
        page.getByRole("heading", {
          name: `Fall ${year}—${year + 1}`,
          level: 3,
        }),
      ).toBeVisible()
    }
  })

  test("supports the query syntax", async ({ page }) => {
    await page.goto("/search")

    await search(page, "CSCI 121")
    await expect(resultTitles(page)).toHaveCount(YEARS.length)
    await expect(resultTitles(page).first()).toHaveText(
      "Principles of Computer Science",
    )

    await search(page, "dept: csci ge: aqr")
    await expect(resultTitles(page)).toHaveCount(YEARS.length)
    await expect(resultTitles(page).first()).toHaveText(
      "Principles of Computer Science",
    )

    await search(page, "dept: art")
    await expect(resultTitles(page)).toHaveCount(YEARS.length)
    await expect(resultTitles(page).first()).toHaveText("Drawing")
  })

  test("narrows and regroups results", async ({ page }) => {
    await page.goto("/search")
    await search(page, "dept: csci")
    // results are virtualized, so check the first group rather than counting
    let lastYear = YEARS[YEARS.length - 1]
    await expect(page.getByRole("heading", { level: 3 }).first()).toHaveText(
      `Spring ${lastYear}—${lastYear + 1}`,
    )

    await page
      .getByRole("combobox", { name: "Limit to:" })
      .selectOption({ label: `${FIRST_YEAR}—${FIRST_YEAR + 1}` })
    await expect(resultTitles(page)).toHaveCount(4)
    await expect(page.getByRole("heading", { level: 3 }).first()).toHaveText(
      `Spring ${FIRST_YEAR}—${FIRST_YEAR + 1}`,
    )

    await page
      .getByRole("combobox", { name: "Group by:" })
      .selectOption("Semester")
    await expect(
      page.getByRole("heading", { name: "Fall", level: 3 }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Spring", level: 3 }),
    ).toBeVisible()
  })

  test("says when nothing matches", async ({ page }) => {
    await page.goto("/search")
    await search(page, "basket weaving")

    await expect(page.getByText("No Results Found")).toBeVisible()
  })

  test("opens a course's details", async ({ page }) => {
    await page.goto("/search")
    await search(page, "CSCI 241")
    await resultTitles(page).first().click()

    let modal = page.getByRole("dialog", { name: "Course" })
    await expect(
      modal.getByRole("heading", { name: "Hardware Design" }),
    ).toBeVisible()
    await expect(modal.getByText("Grace Hopper")).toBeVisible()
    await expect(
      modal.getByText("A fixture course about hardware design."),
    ).toBeVisible()

    await modal.getByRole("button", { name: "Close" }).click()
    await expect(modal).toBeHidden()
  })
})
