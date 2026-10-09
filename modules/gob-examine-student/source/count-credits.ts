import sumBy from "lodash/sumBy"
import type { Course } from "./types"

// Sums up the number of credits offered by a set of courses.
// Course lists come from student files, so tolerate holes in them.
export function countCredits(
  courses: ReadonlyArray<Course | null | undefined> = [],
): number {
  return sumBy(courses, (c) => (c ? (c.credits ?? 0) : 0)) || 0
}
