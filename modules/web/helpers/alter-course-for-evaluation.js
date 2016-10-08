import {forEach} from 'lodash'
import {toPairs} from 'lodash'
import {fromPairs} from 'lodash'
import {filter} from 'lodash'
import {includes} from 'lodash'

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
	departments: 'department',
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
