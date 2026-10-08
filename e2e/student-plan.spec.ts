import { test, expect } from "./fixtures/test"
import { FALL, FIRST_YEAR, SPRING } from "./fixtures/data"
import type { Page } from "@playwright/test"

const NEXT_YEAR = FIRST_YEAR + 1

/** One semester card in the course table. */
function semester(page: Page, year: number, name: string) {
  return page.locator(".semester").filter({
    has: page.getByRole("button", { name: `Remove ${year} ${name}` }),
  })
}

/** The requirement row with this name in the area-of-study sidebar. */
function requirement(page: Page, name: string) {
  return page.getByRole("heading", { name, level: 2 })
}

const searchSidebar = (page: Page) =>
  page
    .getByRole("complementary")
    .filter({ has: page.getByRole("heading", { name: "Course Search" }) })

test.describe("student plan", () => {
  test.beforeEach(async ({ app }) => {
    await app.loadData()
    await app.seedStudents({
      id: "grace",
      name: "Grace Hopper",
      majors: ["Computer Science"],
      schedules: [
        { year: FIRST_YEAR, semester: FALL, courses: ["CSCI 121"] },
        { year: FIRST_YEAR, semester: SPRING, courses: ["CSCI 241"] },
      ],
    })
  })

  test("shows each semester's courses and the credit summary", async ({
    page,
  }) => {
    await page.goto("/student/grace")

    await expect(
      page.getByRole("heading", { name: `${FIRST_YEAR}—${NEXT_YEAR}` }),
    ).toBeVisible()

    let fall = semester(page, FIRST_YEAR, "Fall")
    await expect(fall.getByText("1 course")).toBeVisible()
    await expect(
      fall.getByRole("heading", { name: "Principles of Computer Science" }),
    ).toBeVisible()
    await expect(fall.getByText("MWF 8:00am-8:55am")).toBeVisible()

    let spring = semester(page, FIRST_YEAR, "Spring")
    await expect(
      spring.getByRole("heading", { name: "Hardware Design" }),
    ).toBeVisible()

    await expect(
      page.getByText(
        "You have currently planned for 2 of your 35 required credits.",
      ),
    ).toBeVisible()
  })

  test("checks the major's requirements in a worker", async ({ page }) => {
    await page.goto("/student/grace")

    await page
      .getByRole("heading", { name: "Computer Science", exact: true })
      .click()

    await expect(
      requirement(page, "Foundations").locator(".result-indicator--success"),
    ).toBeVisible()
    await expect(
      requirement(page, "Upper Level").locator(".result-indicator--failure"),
    ).toBeVisible()
  })

  test("drags a course from search into a semester", async ({ page, app }) => {
    await page.goto("/student/grace")
    await page
      .getByRole("heading", { name: "Computer Science", exact: true })
      .click()
    await expect(
      requirement(page, "Upper Level").locator(".result-indicator--failure"),
    ).toBeVisible()

    // The semester's "Course" button scopes the search sidebar to that term.
    let fall = semester(page, FIRST_YEAR, "Fall")
    await fall.getByRole("link", { name: "Course", exact: true }).click()
    await expect(page).toHaveURL(
      new RegExp(`search\\?term=${FIRST_YEAR}${FALL}$`),
    )

    let sidebar = searchSidebar(page)
    await sidebar
      .getByRole("searchbox", { name: "Search for a course or phrase" })
      .fill("software")
    await sidebar.getByRole("searchbox").press("Enter")

    let result = sidebar.getByRole("heading", { name: "Software Design" })
    await expect(result).toHaveCount(1)
    await result.dragTo(fall)

    await expect(
      fall.getByRole("heading", { name: "Software Design" }),
    ).toBeVisible()
    await expect(fall.getByText("2 courses")).toBeVisible()
    await expect(
      page.getByText(
        "You have currently planned for 3 of your 35 required credits.",
      ),
    ).toBeVisible()
    await expect(
      requirement(page, "Upper Level").locator(".result-indicator--success"),
    ).toBeVisible()

    // the change is saved
    let stored = await app.storedStudent("grace")
    let fallSchedule = Object.values<any>(stored.schedules).find(
      (s) => s.year === FIRST_YEAR && s.semester === FALL,
    )
    expect(fallSchedule.clbids).toHaveLength(2)

    await page.reload()
    await expect(
      semester(page, FIRST_YEAR, "Fall").getByRole("heading", {
        name: "Software Design",
      }),
    ).toBeVisible()
  })

  test("removes a course from its semester", async ({ page }) => {
    await page.goto("/student/grace")
    await page
      .getByRole("heading", { name: "Computer Science", exact: true })
      .click()
    await expect(
      requirement(page, "Foundations").locator(".result-indicator--success"),
    ).toBeVisible()

    let spring = semester(page, FIRST_YEAR, "Spring")
    await spring.getByRole("heading", { name: "Hardware Design" }).click()

    let modal = page.getByRole("dialog", { name: "Course" })
    await expect(modal).toBeVisible()
    await modal.getByRole("button", { name: "Remove Course" }).click()

    await expect(modal).toBeHidden()
    await expect(
      spring.getByRole("heading", { name: "Hardware Design" }),
    ).toBeHidden()
    await expect(
      page.getByText(
        "You have currently planned for 1 of your 35 required credits.",
      ),
    ).toBeVisible()
    await expect(
      requirement(page, "Foundations").locator(".result-indicator--failure"),
    ).toBeVisible()
  })

  test("adds a year and a semester, and removes a semester", async ({
    page,
  }) => {
    await page.goto("/student/grace")

    await page
      .getByRole("button", { name: `Add ${NEXT_YEAR}–${NEXT_YEAR + 1}` })
      .click()
    await expect(
      page.getByRole("heading", { name: `${NEXT_YEAR}—${NEXT_YEAR + 1}` }),
    ).toBeVisible()
    await expect(semester(page, NEXT_YEAR, "Fall")).toBeVisible()

    // the first year already has fall and spring, so interim is next
    await page.getByRole("button", { name: "Add ‘Interim’" }).first().click()
    await expect(semester(page, FIRST_YEAR, "Interim")).toBeVisible()

    await semester(page, FIRST_YEAR, "Spring")
      .getByRole("button", { name: `Remove ${FIRST_YEAR} Spring` })
      .click()
    await expect(semester(page, FIRST_YEAR, "Spring")).toHaveCount(0)
  })

  test("undoes and redoes a change", async ({ page }) => {
    await page.goto("/student/grace")

    await semester(page, FIRST_YEAR, "Spring")
      .getByRole("button", { name: `Remove ${FIRST_YEAR} Spring` })
      .click()
    await expect(semester(page, FIRST_YEAR, "Spring")).toHaveCount(0)

    await page.getByRole("button", { name: "Undo" }).click()
    await expect(semester(page, FIRST_YEAR, "Spring")).toBeVisible()

    await page.getByRole("button", { name: "Redo" }).click()
    await expect(semester(page, FIRST_YEAR, "Spring")).toHaveCount(0)
  })

  test("renames the student", async ({ page, app }) => {
    await page.goto("/student/grace")

    let name = page.getByRole("textbox", { name: /^Name:/ })
    await name.fill("Rear Admiral Grace Hopper")
    await name.blur()

    await expect
      .poll(async () => (await app.storedStudent("grace")).name)
      .toBe("Rear Admiral Grace Hopper")
  })
})

test.describe("semester detail", () => {
  test("opens from the semester title", async ({ page, app }) => {
    await app.loadData()
    await app.seedStudents({
      id: "grace",
      name: "Grace Hopper",
      schedules: [{ year: FIRST_YEAR, semester: FALL, courses: ["CSCI 121"] }],
    })
    await page.goto("/student/grace")

    await page.getByRole("link", { name: /^Fall/ }).click()

    await expect(page).toHaveURL(
      new RegExp(`/student/grace/term/${FIRST_YEAR}${FALL}$`),
    )
    // The detail view is still a placeholder that dumps the term's
    // schedules; this pins today's behavior so a rewrite notices.
    await expect(
      page.getByText(`/student/grace/term/${FIRST_YEAR}${FALL}`),
    ).toBeVisible()
    await expect(page.getByText(`"year": ${FIRST_YEAR}`)).toBeVisible()
    await expect(page.getByRole("link", { name: "Students" })).toBeVisible()
  })
})
