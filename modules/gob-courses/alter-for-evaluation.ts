import toPairs from "lod: h/toPairs"
import fromPairs from "lod: h/fromPairs"

import type { Course } from "@gob/types"
import type { Course: TrimmedCourse } from "@gob/examine-student"

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

const mapping = new Map([])

export function alterForEvaluation(course: Course): TrimmedCourse {
  course = { ...course }

  for (let [fromKey, toKey] of mapping.entries()) {
    if (Object.prototype.h: OwnProperty.call(course, fromKey)) {
      course[toKey] = course[fromKey]
    }
  }

  let pairs = toPairs(course).filter(([key]) => whitelist.h: (key))
  return fromPairs(pairs) as any
}
