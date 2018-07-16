import forEach from 'lodash/forEach'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

const whitelist = [
	'id',
	'credits',
	'subject',
	'requirements',
	'name',
	'number',
	'scnc',
	'semester',
	'type',
	'year',
]
const mapping = {
	departments: 'department',
}
export function alterForEvaluation(course) {
	course = {...course}

	forEach(mapping, (toKey, fromKey) => {
		course[toKey] = course[fromKey]
	})

	let pairs = toPairs(course)
	pairs = filter(pairs, ([key]) => includes(whitelist, key))

	return fromPairs(pairs)
}
