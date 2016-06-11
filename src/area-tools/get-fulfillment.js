import pathToOverride from './path-to-override'

export default function getFulfillment(path, fulfillments) {
	return fulfillments[pathToOverride(path)] || null
}
