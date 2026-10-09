import has from "lodash/has.js"
import pathToOverride from "./path-to-override.ts"
import type { OverridesObject, OverridesPath } from "./types.ts"
/**
 * Checks if an override object has an override
 * @private
 * @param {string[]} path - the potential path to an override
 * @param {Object} overrides - the overrides object
 * @returns {boolean} - whether there is a matching path in the overrides list
 */

export default function hasOverride(
  path: OverridesPath,
  overrides: OverridesObject,
) {
  return has(overrides, pathToOverride(path))
}
