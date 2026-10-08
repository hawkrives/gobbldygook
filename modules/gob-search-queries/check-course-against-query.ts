import toPairs from "lodash/toPairs"
import type { Query, Queryable, QueryValue } from "./types"

const isTrue = (x: boolean): boolean => x === true

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
const BOOLEANS: ReadonlySet<unknown> = new Set<BooleanBit>([
  "$OR",
  "$NOR",
  "$AND",
  "$NOT",
  "$XOR",
])

function isBooleanBit(value: unknown): value is BooleanBit {
  return BOOLEANS.has(value)
}

function checkQueryBit(
  course: Queryable,
  [key, values]: [string, ReadonlyArray<QueryValue>],
): boolean {
  if (!Object.hasOwn(course, key)) {
    return false
  }

  const substringMatch = SUBSTRING_KEYS.has(key)
  // values is either:
  // - a 1-long array
  // - an $AND, $OR, $NOT, $NOR, or $XOR query
  // - one of the above, but substringMatch
  const boolBit = values[0]
  const hasBool = isBooleanBit(boolBit)

  // drop the boolean operator, if there is one
  const operands = hasBool ? values.slice(1) : values

  const courseValue = course[key]
  const internalMatches = operands.map((val) => {
    // dept, gereqs, etc.
    if (Array.isArray(courseValue)) {
      if (substringMatch) {
        const needle = String(val).toLowerCase()
        return courseValue.some(
          (item: unknown) =>
            typeof item === "string" && item.toLowerCase().includes(needle),
        )
      } else {
        return courseValue.includes(val)
      }
    }

    if (substringMatch && typeof courseValue === "string") {
      return courseValue.toLowerCase().includes(String(val).toLowerCase())
    } else {
      return courseValue === val
    }
  })

  if (!hasBool) {
    return internalMatches.every(isTrue)
  }

  switch (boolBit) {
    case "$OR":
      return internalMatches.some(isTrue)
    case "$NOR":
      return !internalMatches.some(isTrue)
    case "$AND":
      return internalMatches.every(isTrue)
    case "$NOT":
      return !internalMatches.every(isTrue)
    case "$XOR":
      return internalMatches.filter(isTrue).length === 1
    default: {
      const unreachable: never = boolBit
      return unreachable
    }
  }
}

// Checks if a course passes a query check.
// query: the query object that comes out of buildQueryFromString
// course: the course to check
// returns: did all query bits pass the check?
export function checkCourseAgainstQuery(
  query: Query,
  course: Queryable,
): boolean {
  return toPairs(query).every((pair) => checkQueryBit(course, pair))
}
