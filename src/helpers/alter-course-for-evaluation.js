import {
	forEach,
	toPairs,
	fromPairs,
	filter,
	includes,
} from 'lodash-es'

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

export default function alterCourse(course) {
	course = {...course}

	forEach(mapping, (toKey, fromKey) => {
		course[toKey] = course[fromKey]
	})

	let pairs = toPairs(course)
	pairs = filter(pairs, ([key]) => includes(whitelist, key))
	return fromPairs(pairs)
}
