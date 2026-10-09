import flatMap from "lodash/flatMap.js"
import { buildDeptNum } from "@gob/school-st-olaf-college"
import { splitParagraph } from "@gob/lib"
import type { RawCourse } from "./types.ts"

export default function prepareCourse(course: RawCourse): {
  deptnum: string
  words: Array<string>
  profWords: Array<string>
} {
  const profWords = new Set(flatMap(course.instructors, splitParagraph))
  const allWords = new Set([
    ...splitParagraph(course.name),
    ...splitParagraph((course.notes ?? []).join("\n")),
    ...splitParagraph(course.title ?? ""),
    ...splitParagraph((course.description ?? []).join("\n")),
  ])

  return {
    deptnum: buildDeptNum(course),
    words: [...allWords],
    profWords: [...profWords],
  }
}
