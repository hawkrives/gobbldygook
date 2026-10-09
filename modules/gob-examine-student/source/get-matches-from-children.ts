import asRequirement from "./as-requirement.ts"
import collectMatches from "./collect-matches.ts"
import isRequirementName from "@gob/hanson-format/is-requirement-name.ts"
import flatten from "lodash/flatten.js"
import keys from "lodash/keys.js"
import uniqBy from "lodash/uniqBy.js"
import stringify from "stabilize"
import type {
  ModifierChildrenExpression,
  ModifierChildrenWhereExpression,
  ReferenceExpression,
  Requirement,
  Course,
  DeepReadonly,
} from "./types.ts"
/**
 * Extract the matched courses from all children.
 * @private
 * @param {Object} expr - the current result expression
 * @param {Requirement} ctx - the host requirement
 * @returns {Course[]} - the list of matched courses
 */

export default function getMatchesFromChildren(
  expr: DeepReadonly<
    ModifierChildrenExpression | ModifierChildrenWhereExpression
  >,
  ctx: DeepReadonly<Requirement>,
): Course[] {
  // grab all the child requirement names from this requirement
  let childKeys = keys(ctx).filter(isRequirementName)

  // either use all of the child requirements in the computation,
  if (expr.$children === "$all") {
    // do nothing; the default case.
  } else if (Array.isArray(expr.$children)) {
    // or just use some of them (those listed in expr.$children)
    // Array.isArray narrows a readonly array to any[], so name the item type
    const requested = expr.$children.map(
      (c: DeepReadonly<ReferenceExpression>) => c.$requirement,
    )
    childKeys = childKeys.filter((key) => requested.includes(key))
  }

  // `uniq` had the same problem here that the dirty course stuff struggles
  // with. That is, uniq works on a per-object basis, so when you write down
  // the same course for several reqs, they'll be different objects.
  // Therefore, we turn each object into a sorted JSON representation of
  // itself, and uniq based on that.
  // (I opted for passing iteratee to uniq, rather than mapping, to let lodash optimize a bit.)
  // finally, collect the matching courses from the requested children
  const matches = childKeys.map((key) =>
    collectMatches(asRequirement(ctx[key], key)),
  )
  const flatMatches = flatten(matches)
  const uniquedMatches = uniqBy(flatMatches, stringify)
  return uniquedMatches
}
