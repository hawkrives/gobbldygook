import assertKeys from "./assert-keys.ts"
import type { Course, Requirement } from "./types.ts"
/**
 * Returns the list of matches from a requirement's filter
 * @private
 * @param {Requirement} ctx - the requirement
 * @returns {Course[]} - the already-computed matches from the filter property
 */

export default function getMatchesFromFilter(
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- returns ctx.filter's own _matches list, which computeModifier keeps (and filters) as its mutable course list
  ctx: Requirement,
): Course[] {
  assertKeys(ctx, "filter")
  return ctx.filter?._matches ?? []
}
