import applyFilter from "./apply-filter.ts"
import applyFulfillmentToExpression from "./apply-fulfillment-to-expression.ts"
import asRequirement from "./as-requirement.ts"
import computeChunk from "./compute-chunk.ts"
import getFulfillment from "./get-fulfillment.ts"
import getOverride from "./get-override.ts"
import hasOverride from "./has-override.ts"
import isRequirementName from "@gob/hanson-format/is-requirement-name.ts"
import mapValues from "lodash/mapValues.js"
import type {
  Requirement,
  Course,
  OverridesObject,
  FulfillmentsObject,
} from "./types.ts"

// The overall computation is done by compute, which is in charge of computing
// sub-requirements and such.
export default function compute(
  outerReq: { readonly [key: string]: unknown },
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- computeChunk adds to dirty and writes results onto the fulfillments it evaluates, and courses can come back as a where-expression's matches, which applyFulfillmentToResult pushes onto
  args: {
    path: string[]
    courses?: Course[]
    overrides?: OverridesObject
    fulfillments?: FulfillmentsObject
    dirty?: Set<string>
  },
): Requirement {
  let {
    path,
    courses = [],
    overrides = {},
    fulfillments = {},
    dirty = new Set(),
  } = args
  let childrenShareCourses = Boolean(outerReq["children share courses"])
  const computedChildren = mapValues(outerReq, (req: unknown, name: string) => {
    if (isRequirementName(name)) {
      // Primarily for the math major: if a requirement is set to 'children share courses',
      // then they share courses. The default is false (well, undefined).
      // If they don't share courses, then they share the dirty set;
      // if they do, however, they each receive their own dirty set, so that they don't know if a course has been used yet or not.
      // 'children share courses' is non-recursive.
      let localDirty: Set<string> = dirty

      if (childrenShareCourses) {
        localDirty = new Set()
      }

      return compute(asRequirement(req, name), {
        path: path.concat([name]),
        courses,
        overrides,
        dirty: localDirty,
        fulfillments,
      })
    }

    return req
  })
  // the parser and the tests both hand us plain objects; the checks below
  // look for the keys they need
  let requirement = asRequirement(computedChildren, path.join(" > "))
  let computed = false

  // Apply a filter to the set of courses
  if (requirement.filter !== undefined) {
    courses = applyFilter(requirement.filter, courses)
  }

  // Now check for results
  if (requirement.result !== undefined) {
    // an empty result is a mistake in the area file
    const result: unknown = requirement.result
    if (result === "") {
      throw new SyntaxError(
        `compute(): requirement.result must not be empty (in ${JSON.stringify(requirement)})`,
      )
    }

    let fulfillment = getFulfillment(path, fulfillments)

    if (fulfillment) {
      requirement.result = applyFulfillmentToExpression(
        requirement.result,
        fulfillment,
      )
    }

    computed = computeChunk({
      expr: requirement.result,
      ctx: requirement,
      courses,
      dirty,
      fulfillment,
    })
  } else if (requirement.message !== undefined) {
    // or ask for an override
    computed = false
  } else {
    // or throw an error
    throw new TypeError("compute(): either `message` or `result` is required")
  }

  requirement.computed = computed

  if (hasOverride(path, overrides)) {
    requirement.overridden = true
    // hasOverride just checked that the override exists
    requirement.computed = getOverride(path, overrides) ?? false
  }

  return requirement
}
