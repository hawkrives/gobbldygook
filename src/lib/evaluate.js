import assertKeys from './assert-keys'
import compute from './compute'

export default function evaluate({courses=[], overrides={}}, area) {
	assertKeys(area, 'name', 'result', 'type', 'revision')
	const {name, type} = area
	return compute(area, {path: [type, name], courses, overrides})
}
