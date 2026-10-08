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

  if (!result) {
    return {
      $type: "requirement",
      error: "`details` missing in result!",
      computed: false,
      _result: false,
      _checked: false,
      progress: {
        at: 0,
        of: 1,
      },
    }
  }

  let resultDetails = result.result
  let bits: Expression[] = []

  switch (resultDetails?.$type) {
    case "of":
      bits = resultDetails.$of
      break

    case "boolean": {
      if (resultDetails.$booleanType === "and") {
        bits = resultDetails.$and
      } else if (resultDetails.$booleanType === "or") {
        bits = resultDetails.$or
      }

      break
    }

    default:
      break
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
