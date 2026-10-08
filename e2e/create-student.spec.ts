import { test, expect, studentRecord } from "./fixtures/test"
import { FALL, FIRST_YEAR, SPRING, course } from "./fixtures/data"

test.describe("creating a student", () => {
  test("the welcome page offers each way to create a student", async ({
    page,
  }) => {
    await page.goto("/create")

    await expect(page.getByRole("heading", { name: "Hi there!" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Import from the SIS" }),
    ).toHaveAttribute("href", "/create/sis")
    await expect(
      page.getByRole("link", { name: "Upload a File" }),
    ).toHaveAttribute("href", "/create/upload")
    await expect(
      page.getByRole("link", { name: "Create Manually" }),
    ).toHaveAttribute("href", "/create/manual")
  })

  test("manually, with a major from the area data", async ({ page, app }) => {
    await app.loadData()
    await page.goto("/create")
    await page.getByRole("link", { name: "Create Manually" }).click()

    await expect(
      page.getByRole("heading", { name: "Manually Create" }),
    ).toBeVisible()
    await page.getByRole("textbox", { name: "Name:" }).fill("Grace Hopper")
    await page
      .getByRole("spinbutton", { name: "Matriculation:" })
      .fill(String(FIRST_YEAR))
    await page
      .getByRole("spinbutton", { name: "Graduation:" })
      .fill(String(FIRST_YEAR + 4))
    await expect(page.getByText("Hi! My name is Grace Hopper.")).toBeVisible()

    // react-select: open the Majors picker and choose an area
    await page.locator(".react-select").nth(1).click()
    await page.getByRole("option", { name: "Computer Science" }).click()

    await page.getByRole("button", { name: "Let's go!" }).click()

    await expect(page).toHaveURL(/\/student\/[0-9a-f-]+\/?$/)
    await expect(page.getByRole("textbox", { name: /^Name:/ })).toHaveValue(
      "Grace Hopper",
    )
    await expect(
      page.getByRole("heading", { name: "Computer Science", exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText(
        "You are planning on no degrees and a major in Computer Science.",
      ),
    ).toBeVisible()

    // the new student shows up in the picker
    await page.getByRole("link", { name: "Students" }).click()
    await expect(
      page.getByRole("link", { name: /Grace Hopper.*Computer Science/ }),
    ).toBeVisible()
  })

  test("manually, flags an invalid matriculation year", async ({ page }) => {
    await page.goto("/create/manual")

    await page.getByRole("spinbutton", { name: "Matriculation:" }).fill("20")

    await expect(page.getByText("Matriculation is invalid.")).toBeVisible()
    await expect(page.getByRole("button", { name: "Hmm…" })).toBeDisabled()
  })

  test("by uploading a saved student file", async ({ page, app }) => {
    await app.loadData()
    await page.goto("/create/upload")

    let record = studentRecord({
      id: "uploaded",
      name: "Barbara Liskov",
      majors: ["Computer Science"],
      schedules: [{ year: FIRST_YEAR, semester: FALL, courses: ["CSCI 121"] }],
    })

    await page.locator("input[type=file]").setInputFiles({
      name: "liskov.gbstudent",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(record)),
    })
    // once parsed, the file is listed by a summary of the student inside it
    await expect(
      page.getByText(
        "You are planning on no degrees and a major in Computer Science.",
      ),
    ).toBeVisible()

    await page.getByRole("button", { name: "Import Students" }).click()

    await expect(page).toHaveURL(/\/$/)
    await expect(
      page.getByRole("link", { name: /Barbara Liskov/ }),
    ).toBeVisible()
    expect(await app.storedStudent("uploaded")).toMatchObject({
      name: "Barbara Liskov",
    })
  })

  test("by pasting data from the SIS", async ({ page, app }) => {
    await app.loadData()
    await page.goto("/create/sis")

    let cs121 = course("CSCI 121", FIRST_YEAR)
    let cs241 = course("CSCI 241", FIRST_YEAR)
    let sisCourse = (c: typeof cs121) => ({
      clbid: c.clbid,
      department: c.department,
      number: c.number,
      section: c.section,
      name: c.name,
      credits: c.credits,
      year: c.year,
      semester: c.semester,
      term: c.term,
      lab: false,
      graded: "Graded",
    })
    let sisData = {
      name: "Edsger Dijkstra",
      advisor: "Lovelace, Ada",
      matriculation: FIRST_YEAR,
      graduation: FIRST_YEAR + 4,
      degrees: [],
      majors: ["Computer Science"],
      concentrations: [],
      emphases: [],
      schedules: [
        {
          year: FIRST_YEAR,
          semester: FALL,
          courses: [sisCourse(cs121)],
        },
        {
          year: FIRST_YEAR,
          semester: SPRING,
          courses: [sisCourse(cs241)],
        },
      ],
    }

    await page
      .getByPlaceholder("Paste the gibberish here")
      .fill(JSON.stringify(sisData))

    let summary = page
      .getByRole("listitem")
      .filter({ hasText: `${FIRST_YEAR}:` })
    await expect(
      summary.getByText("CSCI 121A – Principles of Computer Science"),
    ).toBeVisible()
    await expect(summary.getByText("CSCI 241A – Hardware Design")).toBeVisible()

    await page.getByRole("button", { name: "Import Student" }).click()

    await expect(page).toHaveURL(/\/student\/[0-9a-f-]+\/?$/)
    await expect(page.getByRole("textbox", { name: /^Name:/ })).toHaveValue(
      "Edsger Dijkstra",
    )
    await expect(
      page.getByRole("heading", { name: "Principles of Computer Science" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Hardware Design" }),
    ).toBeVisible()
  })
})
