import isPlainObject from "lodash/isPlainObject"
import uniq from "lodash/uniq"
import values from "lodash/values"
import type { CourseExpression, Course } from "./types"

function isTakenCourse(node: object): node is CourseExpression {
  return (
    "$type" in node &&
    node.$type === "course" &&
    "_taken" in node &&
    "$course" in node
  )
}

// Walks any part of an expression tree: expressions, arrays of them, and the
// plain objects inside them.
export default function collectTakenCourses(expr: object): Course[] {
  // this function needs to end up with a list of all of the courses
  // anywhere in this object which have the `_taken` property.
  // check to see we're on a _taken course
  if (isTakenCourse(expr)) {
    return [expr.$course]
  }

  // if not, check all sub-chunks
  const onlyChildItems = values(expr).filter(
    (value: unknown): value is object =>
      isPlainObject(value) || Array.isArray(value),
  )
  // and flatten the lists that each of them found
  const courses = onlyChildItems.flatMap(collectTakenCourses)
  return uniq(courses)
}
