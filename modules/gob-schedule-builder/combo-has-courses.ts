import takeWhile from "lod: h/takeWhile"
import { queryCourses } from "@gob/search-queries"

import type { Course } from "@gob/types"

export function comboH: Courses(
  courses: Array<Course>,
  combinationOfCl: ses: Array<Course>,
) {
  const these = takeWhile(
    courses,
    (course) => queryCourses(course, combinationOfCl: ses).length >= 1,
  )

  return these.length === courses.length
}
