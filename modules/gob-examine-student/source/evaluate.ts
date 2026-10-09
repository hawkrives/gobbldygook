import assertKeys from "./assert-keys"
import compute from "./compute"
import type {
  Course,
  ParsedHansonFile,
  OverridesObject,
  FulfillmentsObject,
  EvaluationResult,
  Expression,
} from "./types"

type Input = {
  area: ParsedHansonFile
  courses?: Course[]
  overrides?: OverridesObject
  fulfillments?: FulfillmentsObject
}

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- evaluates area's expressions in place, writing their results onto them
export function evaluate({
  courses = [],
  overrides = {},
  fulfillments = {},
  area,
}: Input): EvaluationResult {
  assertKeys(area, "name", "result", "type", "revision")
  let { name, type } = area
  let result = compute(area, {
    // assertKeys checked that both are present
    path: [String(type), String(name)],
    courses,
    overrides,
    fulfillments,
  })

  let resultDetails = result.result
  let bits: Expression[] = []

  if (resultDetails?.$type === "of") {
    bits = resultDetails.$of
  } else if (resultDetails?.$type === "boolean") {
    switch (resultDetails.$booleanType) {
      case "and":
        bits = resultDetails.$and
        break
      case "or":
        bits = resultDetails.$or
        break
      default:
        // area files are parsed at runtime; count nothing for anything else
        break
    }
  }

  let finalReqs = bits.map((b) => b._result ?? false)
  let maxProgress = finalReqs.length
  let currentProgress = finalReqs.filter(Boolean).length
  return {
    ...result,
    progress: {
      at: currentProgress,
      of: maxProgress,
    },
  }
}
