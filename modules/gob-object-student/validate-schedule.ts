import type { WarningType } from "./find-course-warnings.ts"
import { findWarnings } from "./find-course-warnings.ts"
import type { Course as CourseType } from "@gob/types"
import type { Schedule } from "./schedule.ts"
import type { Map, List } from "immutable"
export type Result = {
  hasConflict: boolean
  warnings: Map<string, List<WarningType>>
}
// Checks to see if the schedule is valid
// oxlint-disable-next-line typescript/require-await -- callers await the Promise this returns, and a throw from findWarnings should become a rejection
export async function validateSchedule(
  schedule: Schedule,
  courses: List<CourseType>,
): Promise<Result> {
  // discover any warnings about the course load
  let warnings = findWarnings(courses, schedule)
  let hasConflict = warnings.some((perCourse) =>
    perCourse.some((w) => w.warning),
  )
  return {
    hasConflict,
    warnings,
  }
}
