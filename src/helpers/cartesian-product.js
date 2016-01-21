import map from 'lodash/map'
import reduce from 'lodash/reduce'
import flatten from 'lodash/flatten'

export default function cartesianProductOf(...args) {
	return reduce([...args], (a, b) => {
		return flatten(map(a, x => {
			return map(b, y => x.concat([y]))
		}))
	}, [ [] ])
}
