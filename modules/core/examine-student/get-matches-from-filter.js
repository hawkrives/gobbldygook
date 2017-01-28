// @flow
import assertKeys from './assert-keys'
import type { Requirement } from './types'

/**
 * Returns the list of matches from a requirement's filter
 * @private
 * @param {Requirement} ctx - the requirement
 * @returns {Course[]} - the already-computed matches from the filter property
 */
export default function getMatchesFromFilter(ctx: Requirement) {
  assertKeys(ctx, 'filter')
  return ctx.filter._matches || []
}
