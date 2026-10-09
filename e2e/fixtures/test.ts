// The `test` and `expect` every spec imports. It mocks the app's course and
// area data for each test and adds an `app` helper for common setup.

import { test as base, expect, type Page } from "@playwright/test"
import { mockCourseAndAreaData } from "./mock-data"
import {
  AREA_COUNT,
  COURSE_COUNT,
  FIRST_YEAR,
  course,
  revisionFor,
} from "./data"

export type SeedSchedule = {
  readonly year: number
  readonly semester: number
  /** Courses by department and number, like "CSCI 121", from `year`. */
  readonly courses?: ReadonlyArray<string>
  readonly title?: string
}

export type SeedStudent = {
  readonly id: string
  readonly name: string
  readonly matriculation?: number
  readonly graduation?: number
  readonly majors?: ReadonlyArray<string>
  readonly schedules?: ReadonlyArray<SeedSchedule>
}

/** Builds the JSON the app keeps in localStorage for one student. */
export function studentRecord(seed: SeedStudent) {
  let matriculation = seed.matriculation ?? FIRST_YEAR
  let graduation = seed.graduation ?? matriculation + 4

  let schedules = Object.fromEntries(
    (seed.schedules ?? []).map((s, i) => {
      let id = `${seed.id}-schedule-${i}`
      let clbids = (s.courses ?? []).map((c) => course(c, s.year).clbid)
      return [
        id,
        {
          id,
          active: true,
          index: 1,
          title: s.title ?? "Plan A",
          clbids,
          year: s.year,
          semester: s.semester,
        },
      ]
    }),
  )

  return {
    id: seed.id,
    name: seed.name,
    matriculation,
    graduation,
    studies: (seed.majors ?? []).map((name) => ({
      name,
      type: "major",
      revision: revisionFor(matriculation),
    })),
    schedules,
  }
}

export type StoredStudent = ReturnType<typeof studentRecord>

async function countStoredRecords(page: Page) {
  return page.evaluate(async () => {
    // Opening a database that doesn't exist yet would create an empty one at
    // version 1 and break the app's own schema upgrade, so wait for the app
    // to create it first.
    let existing = await indexedDB.databases()
    if (!existing.some((info) => info.name === "gobbldygook")) {
      return { areas: 0, courses: 0 }
    }

    let db = await new Promise<IDBDatabase>((resolve, reject) => {
      let req = indexedDB.open("gobbldygook")
      req.onsuccess = () => {
        resolve(req.result)
      }
      req.onerror = () => {
        // oxlint-disable-next-line typescript/prefer-promise-reject-errors -- `error` is always set when `onerror` fires
        reject(req.error)
      }
    })
    try {
      if (!db.objectStoreNames.contains("courses")) {
        return { areas: 0, courses: 0 }
      }
      let count = (store: string) =>
        new Promise<number>((resolve, reject) => {
          let req = db.transaction(store).objectStore(store).count()
          req.onsuccess = () => {
            resolve(req.result)
          }
          req.onerror = () => {
            // oxlint-disable-next-line typescript/prefer-promise-reject-errors -- `error` is always set when `onerror` fires
            reject(req.error)
          }
        })
      return { areas: await count("areas"), courses: await count("courses") }
    } finally {
      db.close()
    }
  })
}

class App {
  constructor(private page: Page) {}

  /**
   * Opens the app and waits for the load-data worker to put every fixture
   * course and area into IndexedDB. Screens that read areas only do so when
   * they mount, so most tests should start here.
   */
  async loadData() {
    await this.page.goto("/")
    await expect
      .poll(() => countStoredRecords(this.page), { timeout: 20_000 })
      .toEqual({ areas: AREA_COUNT, courses: COURSE_COUNT })
  }

  /** Writes students into localStorage the way the app saves them. */
  async seedStudents(...students: ReadonlyArray<SeedStudent>) {
    let records = students.map(studentRecord)
    await this.page.evaluate((records) => {
      let ids = new Set(
        JSON.parse(localStorage.getItem("studentIds") ?? "[]") as string[],
      )
      for (let record of records) {
        localStorage.setItem(record.id, JSON.stringify(record))
        ids.add(record.id)
      }
      localStorage.setItem("studentIds", JSON.stringify([...ids]))
    }, records)
  }

  /** Reads a student back out of localStorage. */
  async storedStudent(id: string): Promise<StoredStudent | null> {
    return this.page.evaluate(
      (id) =>
        JSON.parse(localStorage.getItem(id) ?? "null") as StoredStudent | null,
      id,
    )
  }
}

export const test = base.extend<{ app: App }>({
  context: async ({ context }, use) => {
    await mockCourseAndAreaData(context)
    await use(context)
  },
  app: async ({ page }, use) => {
    await use(new App(page))
  },
})

export { expect }
