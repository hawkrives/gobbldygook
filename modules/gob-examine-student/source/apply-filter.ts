import checkForCourse from "./check-for-course.ts"
import filterByWhereClause from "./filter-by-where-clause.ts"
import type { FilterExpression, Course } from "./types.ts"

const filterByOfExpression = (
  courses: ReadonlyArray<Course>,
  $of: ReadonlyArray<Course>,
) => $of.filter((course) => checkForCourse(course, courses))

/**
 * Filters a list of courses by way of a filter expression.
 * @private
 * @param {Object.<string, String|Number|Array>} expr - the filter expression
 * @param {Course[]} courses - the list of courses
 * @returns {Course[]} filtered - the filtered courses
 */

export default function applyFilter(
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- writes _matches onto expr (and filterByWhereClause writes $computed-value onto its $where)
  expr: FilterExpression,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- filterByWhereClause can return courses itself, and compute hands the result to computeChunk, where a where-expression's matches can be that list and applyFulfillmentToResult pushes onto them
  courses: Course[],
): Course[] {
  // default to an empty array
  let filtered: Array<Course> = []

  // a filter will be either a where-style query or a list of courses
  switch (expr.$filterType) {
    case "where":
      filtered = filterByWhereClause(courses, expr.$where)
      break
    case "of":
      filtered = filterByOfExpression(
        courses,
        expr.$of.map((c) => c.$course),
      )
      break
    default:
      // area files are parsed at runtime; an unknown filter matches nothing
      break
  }

  // grab the matches
  expr._matches = filtered
  return filtered
}
