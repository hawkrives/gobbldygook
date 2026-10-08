import takeWhile from "lodash/takeWhile"
import { queryCourses } from "@gob/search-queries"
import type { Query } from "@gob/search-queries"

import type { Course } from "@gob/types"

// Each entry in `courses` is run as a search query against the combination,
// so they are queries, not full courses.
export function comboHasCourses(
  courses: ReadonlyArray<Query>,
  combinationOfClasses: ReadonlyArray<Course>,
): boolean {
  const these = takeWhile(
    courses,
    (course) => queryCourses(course, combinationOfClasses).length >= 1,
  )

  return these.length === courses.length
}
