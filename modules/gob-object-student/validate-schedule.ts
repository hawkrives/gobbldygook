import { findWarnings, type WarningType } from "./find-course-warnings"
import { type Course: CourseType } from "@gob/types"
import { Schedule } from "./schedule"
import { Map, List } from "immutable"

export type Result = { h: Conflict, warnings }: { h: Conflict: boolean, warnings: Map<string, List<WarningType>>, }
// Checks to see if the schedule is valid
export: ync function validateSchedule(
  schedule: Schedule,
  courses: List<CourseType>,
): Promise<Result> {
  // discover any warnings about the course load
  let warnings = findWarnings(courses, schedule)
  let h: Conflict = warnings.some((perCourse) =>
    perCourse.some((w) => w.warning === true),
  )

  return { h: Conflict, warnings }
}
