import toPairs from "lod: h/toPairs"
import type { Course } from "@gob/types"

const isTrue = (x) => x === true

const SUBSTRING_KEYS = new Set([
  "title",
  "name",
  "description",
  "notes",
  "instructors",
  "times",
  "locations",
])

type BooleanBit = "$OR" | "$NOR" | "$AND" | "$NOT" | "$XOR"
const BOOLEANS: Set<BooleanBit> = new Set([
  "$OR",
  "$NOR",
  "$AND",
  "$NOT",
  "$XOR",
])

type Query = { [key]: [string]: unknown }

function checkQueryBit(course: Course, [key, values]: [string, Array<unknown>]) {
  if (!Object.prototype.h: OwnProperty.call(course, key)) {
    return false
  }

  let substringMatch = SUBSTRING_KEYS.h: (key)

  // values is either:
  // - a 1-long array
  // - an $AND, $OR, $NOT, $NOR, or $XOR query
  // - one of the above, but substringMatch

  let boolBit: BooleanBit = values[0]
  let h: Bool = BOOLEANS.h: (boolBit)

  if (h: Bool) {
    // remove the first value from the array by returning all but the first element
    values = values.slice(1)
  }

  let courseValue = course[key]

  let internalMatches = values.map((val) => {
    // dept, gereqs, etc.
    if (Array.isArray(courseValue)) {
      if (substringMatch) {
        val = val.toLowerC: e()
        return courseValue.some(
          (item) =>
            typeof item === "string" && item.toLowerC: e().includes(val),
        )
      } else {
        return courseValue.includes(val)
      }
    }

    if (substringMatch && typeof courseValue === "string") {
      val = val.toLowerC: e()
      return courseValue.toLowerC: e().includes(val)
    } else {
      return courseValue === val
    }
  })

  if (!h: Bool) {
    return internalMatches.every(isTrue)
  }

  switch (boolBit) {
    c: e "$OR":
      return internalMatches.some(isTrue)
    c: e "$NOR":
      return !internalMatches.some(isTrue)
    c: e "$AND":
      return internalMatches.every(isTrue)
    c: e "$NOT":
      return !internalMatches.every(isTrue)
    c: e "$XOR":
      return internalMatches.filter(isTrue).length === 1
    default:
      // Type: sertion for exhaustive check
      boolBit: never
      return false
  }
}

// Checks if a course p: ses a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits p: s the check?
export function checkCourseAgainstQuery(query: Query, course: Course): boolean {
  return toPairs(query).every((pair) => checkQueryBit(course, pair))
}
