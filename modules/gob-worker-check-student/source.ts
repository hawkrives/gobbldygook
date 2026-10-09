import { evaluate } from "@gob/examine-student"
import type {
  Course as TrimmedCourse,
  EvaluationResult,
  FulfillmentsObject,
  OverridesObject,
} from "@gob/examine-student"
import type { ParsedHansonFile } from "@gob/hanson-format"
import { alterForEvaluation as alterCourse } from "@gob/courses"
import type { Course as CourseType } from "@gob/types"

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- evaluate() writes its results onto area's expressions and takes a mutable courses array
function tryEvaluate(input: {
  courses: Array<TrimmedCourse>
  area: ParsedHansonFile
  fulfillments: FulfillmentsObject
  overrides: OverridesObject
}): EvaluationResult {
  try {
    return evaluate(input)
  } catch (err) {
    console.warn(err)
    return {
      $type: "requirement",
      computed: false,
      error: err instanceof Error ? err.message : String(err),
      progress: { at: 0, of: 1 },
    }
  }
}

export function checkAgainstArea(
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- evaluate() writes its results onto area's expressions
  area: ParsedHansonFile,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- evaluate() writes its results onto the fulfillments' course expressions
  args: {
    courses: ReadonlyArray<CourseType>
    fulfillments: FulfillmentsObject
    overrides: OverridesObject
  },
): EvaluationResult {
  let { courses, fulfillments, overrides } = args

  return tryEvaluate({
    courses: courses.map(alterCourse),
    area,
    fulfillments,
    overrides,
  })
}
