// @flow
import pathToOverride from './path-to-override'
import type { FulfillmentsPath, FulfillmentsObject } from './types'

export default function getFulfillment(path: FulfillmentsPath, fulfillments: FulfillmentsObject) {
	return fulfillments[pathToOverride(path)] || null
}
