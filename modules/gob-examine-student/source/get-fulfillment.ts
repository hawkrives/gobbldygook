import pathToOverride from "./path-to-override"
import type { Fulfillment, FulfillmentsPath, FulfillmentsObject } from "./types"
export default function getFulfillment(
  path: FulfillmentsPath,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- returns one of the fulfillments itself, which compute then evaluates (and writes results onto) in place
  fulfillments: FulfillmentsObject,
): Fulfillment | null {
  return fulfillments[pathToOverride(path)] ?? null
}
