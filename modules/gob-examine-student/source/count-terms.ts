import type { Course } from "./types.ts"

/**
 * Counts the number of unique terms from a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique courses
 */
export function countTerms(courses: ReadonlyArray<Course>) {
  return new Set(courses.map((c) => `${c.year}${c.semester}`)).size
}
