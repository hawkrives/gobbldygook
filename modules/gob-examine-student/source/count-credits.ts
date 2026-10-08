import sumBy from "lodash/sumBy"
import type { Course } from "./types"

// Sums up the number of credits offered by a set of courses
export function countCredits(courses: ReadonlyArray<Course> = []): number {
  return sumBy(courses, (c) => (c ? (c.credits ?? 0) : 0)) || 0
}
