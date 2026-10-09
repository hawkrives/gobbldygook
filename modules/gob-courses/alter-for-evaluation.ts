import toPairs from "lodash/toPairs"
import fromPairs from "lodash/fromPairs"

import type { Course } from "@gob/types"
import type { Course as TrimmedCourse } from "@gob/examine-student"

const whitelist = new Set([
  "clbid",
  "credits",
  "crsid",
  "department",
  "gereqs",
  "groupid",
  "level",
  "name",
  "number",
  "pf",
  "semester",
  "type",
  "year",
])

const mapping = new Map<string, string>([])

export function alterForEvaluation(course: Course): TrimmedCourse {
  const altered: Record<string, unknown> = { ...course }

  for (let [fromKey, toKey] of mapping.entries()) {
    if (Object.hasOwn(altered, fromKey)) {
      altered[toKey] = altered[fromKey]
    }
  }

  // every whitelisted key is a Course field, so what's left is a smaller Course
  let pairs = toPairs(altered).filter(([key]) => whitelist.has(key))
  return fromPairs(pairs)
}
