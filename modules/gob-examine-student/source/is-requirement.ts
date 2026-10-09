import isPlainObject from "lodash/isPlainObject.js"
import type { Requirement } from "./types.ts"

// Requirements are the plain objects tagged {$type: "requirement"}; their
// other keys are checked where they're used.
export default function isRequirement(value: unknown): value is Requirement {
  return (
    isPlainObject(value) &&
    typeof value === "object" &&
    value !== null &&
    "$type" in value &&
    value.$type === "requirement"
  )
}
