// @flow
import pathToOverride from './path-to-override'
import type { OverridesPath, OverridesObject } from './types'

/**
 * Gets an override from an override object
 * @private
 * @param {string[]} path - the path to an override
 * @param {Object} overrides - the overrides object
 * @returns {*} - the value of the override
 */
export default function getOverride(path: OverridesPath, overrides: OverridesObject): boolean {
  return overrides[pathToOverride(path)]
}
