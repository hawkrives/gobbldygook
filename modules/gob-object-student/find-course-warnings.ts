import { List, Map } from "immutable"
import ordinal from "ord"
import oxford from "listify"
import { findTimeConflicts } from "@gob/schedule-conflicts"
import { expandYear, semesterName } from "@gob/school-st-olaf-college"
import type { Course as CourseType } from "@gob/types"
import type { Schedule } from "./schedule"
export type WarningTypeEnum =
  | "invalid-semester"
  | "invalid-year"
  | "time-conflict"
export type WarningType = {
  warning: true
  type: WarningTypeEnum
  msg: string
}
export function checkForInvalidYear(
  course: CourseType,
  scheduleYear: number,
  thisYear: number = new Date().getFullYear(),
): WarningType | null | undefined {
  // course data comes from storage, and may be missing its semester
  let semester = course.semester as number | undefined
  if (semester === 9 || semester === undefined) {
    return null
  }

  if (course.year !== scheduleYear && scheduleYear <= thisYear) {
    const yearString = expandYear(course.year, true, "–")
    return {
      warning: true,
      type: "invalid-year",
      msg: `Wrong Year (originally from ${yearString})`,
    }
  }

  return null
}
export function checkForInvalidSemester(
  course: CourseType,
  scheduleSemester: number,
): WarningType | null | undefined {
  if (course.semester === scheduleSemester) {
    return null
  }

  const semString = semesterName(course.semester)
  return {
    warning: true,
    type: "invalid-semester",
    msg: `Wrong Semester (originally from ${semString})`,
  }
}
export function checkForInvalidity(
  courses: List<CourseType>,
  { year, semester }: { year: number; semester: number },
): Map<string, List<WarningType | null | undefined>> {
  let results = courses.map(
    (course): [string, List<WarningType | null | undefined>] => {
      let invalidYear = checkForInvalidYear(course, year)
      let invalidSemester = checkForInvalidSemester(course, semester)
      return [course.clbid, List.of(invalidYear, invalidSemester)]
    },
  )
  return Map(results)
}

export function checkForTimeConflicts(
  courses: List<CourseType>,
): Map<string, List<WarningType | null | undefined>> {
  let conflictSets = findTimeConflicts(courses.toArray())
  let results = courses.map(
    (course, index): [string, List<WarningType | null | undefined>] => {
      let conflictSet = conflictSets[index] ?? []
      if (!conflictSet.some(Boolean)) {
        return [course.clbid, List()]
      }

      // +1 to the indices because humans don't 0-index lists
      let conflicts = conflictSet.flatMap((isConflict, i) =>
        isConflict ? [i + 1] : [],
      )
      let conflicted = conflicts.map((i) => `${String(i)}${ordinal(i)}`)
      let conflictsStr = oxford(conflicted)
      let word = conflicts.length === 1 ? "course" : "courses"
      let warning: WarningType = {
        warning: true,
        type: "time-conflict",
        msg: `Time conflict with the ${conflictsStr} ${word}`,
      }
      return [course.clbid, List.of(warning)]
    },
  )
  return Map(results)
}

function isWarning(
  warning: WarningType | null | undefined,
): warning is WarningType {
  return Boolean(warning)
}

export function findWarnings(
  courses: List<CourseType>,
  schedule: Schedule,
  thisYear: number = new Date().getFullYear(),
): Map<string, List<WarningType>> {
  let { year, semester } = schedule

  if (schedule.year > thisYear) {
    return Map()
  }

  let warningsOfInvalidity = checkForInvalidity(courses, { year, semester })
  let timeConflicts = checkForTimeConflicts(courses)
  return warningsOfInvalidity
    .mergeDeep(timeConflicts)
    .map((warnings) => warnings.filter(isWarning))
}
