import includes from "lodash/includes"
import every from "lodash/every"
import some from "lodash/some"
import assertKeys from "./assert-keys"
import type {
  Course,
  Operator,
  Qualification,
  QualificationStaticValue,
} from "./types"

/**
 * Compares a course property against a MongoDB-style operator
 * @private
 * @param {Course} course - the course to check
 * @param {string} $key - the property to check
 * @param {string} $operator - the operator to check against
 * @param {string} $value - the value compare to
 * @returns {boolean} - whether the course matched or not
 */
export default function compareCourseToQualification(
  course: Course,
  { $key, $operator, $value, $type }: Qualification,
): boolean {
  if (Array.isArray($value)) {
    throw new TypeError(
      "compareCourseToQualification(): what would a comparison to a list even do? oh, wait; I suppose it could compare against one of several values… well, I'm not doing that right now. If you want it, edit the PEG and stick appropriate stuff in here (probably simplest to just call this function again with each possible value and return true if any are true.)",
    )
  } else if (typeof $value === "object") {
    return compareCourseToQualificationViaObject(course, {
      $key,
      $operator,
      $value,
      $type,
    })
  } else {
    return compareCourseToQualificationViaOperator(
      course,
      $key,
      $operator,
      $value,
    )
  }
}

function compareCourseToQualificationViaObject(
  course: Course,
  { $key, $operator, $value, $type }: Qualification,
): boolean {
  if (typeof $value !== "object") {
    throw new TypeError(
      `compareCourseToQualification(): $value must be an object; "${typeof $value}" is not an object.`,
    )
  }

  if ($value.$type === "function") {
    // we compute the value of the function-over-where-query style
    // operators earlier, in the filterByQualification function.
    assertKeys($value, "$computed-value")
    return compareCourseToQualificationViaOperator(
      course,
      $key,
      $operator,
      $value["$computed-value"],
    )
  } else if ($value.$type === "boolean") {
    if ($value.$booleanType === "or") {
      return some($value.$or, (val) =>
        compareCourseToQualification(course, {
          $key,
          $operator,
          $value: val,
          $type,
        }),
      )
    } else if ($value.$booleanType === "and") {
      return every($value.$and, (val) =>
        compareCourseToQualification(course, {
          $key,
          $operator,
          $value: val,
          $type,
        }),
      )
    } else {
      throw new TypeError(
        `compareCourseToQualification(): neither $or nor $and could be found in ${JSON.stringify($value)}`,
      )
    }
  } else {
    const unexpected: { $type?: unknown } = $value
    throw new TypeError(
      `compareCourseToQualification(): "${String(unexpected.$type)}" is not a valid type for a qualification's value.`,
    )
  }
}

// Orders two values the way JavaScript's < and > do for the numbers and
// strings in course data: strings compare as strings, and anything else as
// numbers. Returns undefined when they can't be ordered (NaN).
function order(a: unknown, b: unknown): -1 | 0 | 1 | undefined {
  if (typeof a === "string" && typeof b === "string") {
    return a < b ? -1 : a > b ? 1 : 0
  }

  const x = Number(a)
  const y = Number(b)
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return undefined
  }

  return x < y ? -1 : x > y ? 1 : 0
}

function compareCourseToQualificationViaOperator(
  course: Course,
  $key: string,
  $operator: Operator,
  // a function's computed value is undefined when nothing matched its where-clause
  $value: QualificationStaticValue | undefined,
): boolean {
  // get the actual course out of the object
  const inner = course["$course"]
  // a course expression keeps its course under $course
  const actual = inner && typeof inner === "object" ? (inner as Course) : course
  const courseValue = actual[$key]

  // it's a static value; a number or string
  if ($operator === "$eq") {
    if (Array.isArray(courseValue)) {
      return includes(courseValue, $value)
    }

    return courseValue === $value
  } else if ($operator === "$ne") {
    if (Array.isArray(courseValue)) {
      return !includes(courseValue, $value)
    }

    return courseValue !== $value
  } else if ($operator === "$lt") {
    return order(courseValue, $value) === -1
  } else if ($operator === "$lte") {
    const result = order(courseValue, $value)
    return result === -1 || result === 0
  } else if ($operator === "$gt") {
    return order(courseValue, $value) === 1
  } else if ($operator === "$gte") {
    const result = order(courseValue, $value)
    return result === 1 || result === 0
  } else {
    const unexpected: unknown = $operator
    throw new TypeError(
      `compareCourseToQualificationViaOperator: "${String(unexpected)} is not a valid operator"`,
    )
  }
}
