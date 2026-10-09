import compact from "lodash/compact.js"
import getDepartments from "./get-departments.ts"
import type { Course } from "./types.ts"
/**
 * Counts the number of unique departments in a list of courses
 * @private
 * @param {Course[]} courses - the list of courses
 * @returns {number} - the number of unique departments
 */

export default function countDepartments(courses: ReadonlyArray<Course>) {
  // getDepartments does a uniq
  return compact(getDepartments(courses)).length
}
