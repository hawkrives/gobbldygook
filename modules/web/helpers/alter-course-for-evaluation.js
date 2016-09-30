import forEach from 'lodash/forEach'
import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

const whitelist = [
	'clbid',
	'credits',
	'crsid',
	'department',
	'gereqs',
	'groupid',
	'level',
	'name',
	'number',
	'pf',
	'semester',
	'type',
	'year',
]
const mapping = {
	depts: 'department',
	num: 'number',
}
export function alterCourse(course) {
	course = {...course}

	forEach(mapping, (toKey, fromKey) => {
		course[toKey] = course[fromKey]
	})

	let pairs = toPairs(course)
	pairs = filter(pairs, ([key]) => includes(whitelist, key))
	return fromPairs(pairs)
}
