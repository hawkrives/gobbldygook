import map from 'lodash/collection/map'
import reduce from 'lodash/collection/reduce'
import flatten from 'lodash/array/flatten'

function cartesianProductOf(...args) {
	return reduce([...args], (a, b) => {
		return flatten(map(a, x => {
			return map(b, y => x.concat([y]))
		}))
	}, [ [] ])
}

export default cartesianProductOf
