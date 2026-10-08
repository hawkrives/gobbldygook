import type { Requirement } from "./types"

/**
 * Reads a value as a requirement. Requirements are objects; the code that
 * uses one checks the keys it needs (see assertKeys), so this only rules out
 * non-objects.
 * @private
 * @param {unknown} value - the requirement
 * @param {string} name - what to call it in the error
 * @returns {Requirement} - the same value
 */
export default function asRequirement(
  value: unknown,
  name: string,
): Requirement {
  if (typeof value !== "object" || value === null) {
    throw new TypeError(`"${name}" is not a requirement: ${String(value)}`)
  }

  return value as Requirement
}
