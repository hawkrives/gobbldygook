// @flow
import pathToOverride from "./path-to-override.js"
import type { FulfillmentsPath, FulfillmentsObject } from "./types.js"

export default function getFulfillment(
  path: FulfillmentsPath,
  fulfillments: FulfillmentsObject,
) {
  return fulfillments[pathToOverride(path)] || null
}
