import { List } from "immutable"
import { validateSchedule } from "../validate-schedule"
import { Schedule } from "../schedule"
import { course } from "./course.support"

const thisYear = new Date().getFullYear()
const mondayMorning = [{ day: "Mo", start: "9:05", end: "10:00" }]
const mondayAfternoon = [{ day: "Mo", start: "13:00", end: "14:00" }]

describe("validateSchedule", () => {
  it("has no conflicts when no courses overlap", async () => {
    let schedule = new Schedule({ year: thisYear, semester: 1 })
    let courses = List.of(
      course({
        clbid: "a",
        year: thisYear,
        semester: 1,
        offerings: mondayMorning,
      }),
      course({
        clbid: "b",
        year: thisYear,
        semester: 1,
        offerings: mondayAfternoon,
      }),
    )

    let { hasConflict, warnings } = await validateSchedule(schedule, courses)

    expect(hasConflict).toBe(false)
    expect(warnings.toJS()).toEqual({ a: [], b: [] })
  })

  it("reports a conflict when two courses overlap", async () => {
    let schedule = new Schedule({ year: thisYear, semester: 1 })
    let courses = List.of(
      course({
        clbid: "a",
        year: thisYear,
        semester: 1,
        offerings: mondayMorning,
      }),
      course({
        clbid: "b",
        year: thisYear,
        semester: 1,
        offerings: mondayMorning,
      }),
    )

    let { hasConflict, warnings } = await validateSchedule(schedule, courses)

    expect(hasConflict).toBe(true)
    expect(
      warnings
        .get("a")
        ?.map((w) => w.type)
        .toJS(),
    ).toEqual(["time-conflict"])
  })

  it("reports a conflict when a course is in the wrong semester", async () => {
    let schedule = new Schedule({ year: thisYear, semester: 1 })
    let courses = List.of(course({ clbid: "a", year: thisYear, semester: 3 }))

    let { hasConflict, warnings } = await validateSchedule(schedule, courses)

    expect(hasConflict).toBe(true)
    expect(
      warnings
        .get("a")
        ?.map((w) => w.type)
        .toJS(),
    ).toEqual(["invalid-semester"])
  })
})
