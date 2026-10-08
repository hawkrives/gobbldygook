import pathToOverride from "./path-to-override"
import type { Fulfillment, FulfillmentsPath, FulfillmentsObject } from "./types"
export default function getFulfillment(
  path: FulfillmentsPath,
  fulfillments: FulfillmentsObject,
): Fulfillment | null {
  return fulfillments[pathToOverride(path)] || null
}
