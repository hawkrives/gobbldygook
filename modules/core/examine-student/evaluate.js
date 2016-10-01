import assertKeys from './assert-keys'
import compute from './compute'

export function evaluate({courses=[], overrides={}, fulfilled={}}, area) {
	assertKeys(area, 'name', 'result', 'type', 'revision')
	const {name, type} = area
	return compute(area, {path: [type, name], courses, overrides, fulfillments: fulfilled})
}
