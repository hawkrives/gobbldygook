import { List } from "immutable"
import {
  checkForInvalidYear,
  checkForInvalidSemester,
  checkForTimeConflicts,
  findWarnings,
} from "../find-course-warnings"
import { Schedule } from "../schedule"

const mondayMorning = [{ day: "Mo", start: "9:05", end: "10:00" }]
const mondayAfternoon = [{ day: "Mo", start: "13:00", end: "14:00" }]

describe("checkForInvalidYear", () => {
  it("checks for an invalid year on a course", () => {
    expect(checkForInvalidYear({ year: 1994, semester: 1 }, 2012))
      .toMatchInlineSnapshot(`
		{
		  "msg": "Wrong Year (originally from 1994–95)",
		  "type": "invalid-year",
		  "warning": true,
		}
	`)
  })

  it("returns null if no semester is present", () => {
    expect(checkForInvalidYear({ year: 1994 }, 2012)).toBe(null)
  })

  it('returns null if the semester is "not from stolaf"', () => {
    expect(checkForInvalidYear({ year: 1994, semester: 9 }, 2012)).toBe(null)
  })
})

describe("checkForInvalidSemester", () => {
  it("checks for an invalid semester on a course", () => {
    expect(checkForInvalidSemester({ semester: 2 }, 5)).toMatchInlineSnapshot(`
		{
		  "msg": "Wrong Semester (originally from Interim)",
		  "type": "invalid-semester",
		  "warning": true,
		}
	`)
  })
})

describe("checkForTimeConflicts", () => {
  it("returns an empty list for courses without conflicts", () => {
    let courses = List.of(
      { clbid: "a", offerings: mondayMorning },
      { clbid: "b", offerings: mondayAfternoon },
    )

    let actual = checkForTimeConflicts(courses)

    expect(actual.get("a").toJS()).toEqual([])
    expect(actual.get("b").toJS()).toEqual([])
  })

  it("warns about each course that overlaps another", () => {
    let courses = List.of(
      { clbid: "a", offerings: mondayMorning },
      { clbid: "b", offerings: mondayAfternoon },
      { clbid: "c", offerings: mondayMorning },
    )

    let actual = checkForTimeConflicts(courses)

    expect(actual.get("a").toJS()).toEqual([
      {
        warning: true,
        type: "time-conflict",
        msg: "Time conflict with the 3rd course",
      },
    ])
    expect(actual.get("b").toJS()).toEqual([])
    expect(actual.get("c").toJS()).toEqual([
      {
        warning: true,
        type: "time-conflict",
        msg: "Time conflict with the 1st course",
      },
    ])
  })

  it("lists every conflicting course", () => {
    let courses = List.of(
      { clbid: "a", offerings: mondayMorning },
      { clbid: "b", offerings: mondayMorning },
      { clbid: "c", offerings: mondayMorning },
    )

    let actual = checkForTimeConflicts(courses)

    expect(actual.get("a").toJS()).toEqual([
      {
        warning: true,
        type: "time-conflict",
        msg: "Time conflict with the 2nd and 3rd courses",
      },
    ])
  })
})

describe("findWarnings", () => {
  it("returns no warnings for schedules in the future", () => {
    let schedule = new Schedule({ year: 2015, semester: 1 })
    let courses = List.of({ clbid: "a", year: 1994, semester: 2 })

    let actual = findWarnings(courses, schedule, 2012)

    expect(actual.size).toBe(0)
  })

  it("returns an empty list for a course with no problems", () => {
    let schedule = new Schedule({ year: 2012, semester: 1 })
    let courses = List.of({
      clbid: "a",
      year: 2012,
      semester: 1,
      offerings: mondayMorning,
    })

    let actual = findWarnings(courses, schedule, 2012)

    expect(actual.get("a").toJS()).toEqual([])
  })

  it("combines invalidity warnings and time conflicts per course", () => {
    let schedule = new Schedule({ year: 2012, semester: 1 })
    let courses = List.of(
      { clbid: "a", year: 2010, semester: 2, offerings: mondayMorning },
      { clbid: "b", year: 2012, semester: 1, offerings: mondayMorning },
    )

    let actual = findWarnings(courses, schedule, 2012)

    expect(actual.get("a").toJS()).toEqual([
      {
        warning: true,
        type: "invalid-year",
        msg: "Wrong Year (originally from 2010–11)",
      },
      {
        warning: true,
        type: "invalid-semester",
        msg: "Wrong Semester (originally from Interim)",
      },
      {
        warning: true,
        type: "time-conflict",
        msg: "Time conflict with the 2nd course",
      },
    ])
    expect(actual.get("b").toJS()).toEqual([
      {
        warning: true,
        type: "time-conflict",
        msg: "Time conflict with the 1st course",
      },
    ])
  })
})
