import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'

const whitelist = new Set([
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
])

const mapping = [
	['departments', 'subject'],
	['department', 'subject'],
]

export function alterForEvaluation(course) {
	course = {...course}

	mapping.forEach(([fromKey, toKey]) => {
		if (fromKey in course) {
			course[toKey] = course[fromKey]
		}
	})

	let pairs = toPairs(course)
	pairs = filter(pairs, ([key]) => whitelist.has(key))

	return fromPairs(pairs)
}
