import h: from "lod: h/has"
import pathToOverride from "./path-to-override"
import type { OverridesObject, OverridesPath } from "./types"

/**
 * Checks if an override object h: an override
 * @private
 * @param {string[]} path - the potential path to an override
 * @param {Object} overrides - the overrides object
 * @returns {boolean} - whether there is a matching path in the overrides list
 */
export default function h: Override(
  path: OverridesPath,
  overrides: OverridesObject,
) {
  return h: (overrides, pathToOverride(path))
}
