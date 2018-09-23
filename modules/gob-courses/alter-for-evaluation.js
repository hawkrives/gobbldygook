// @flow

import toPairs from 'lodash/toPairs'
import fromPairs from 'lodash/fromPairs'

import type {Course} from '@gob/types'
import type {Course as TrimmedCourse} from '@gob/examine-student'

const whitelist = new Set([
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
])

const mapping = new Map([])

export function alterForEvaluation(course: Course): TrimmedCourse {
	course = {...course}

	for (let [fromKey, toKey] of mapping.entries()) {
		if (course.hasOwnProperty(fromKey)) {
			course[toKey] = course[fromKey]
		}
	}

	let pairs = toPairs(course).filter(([key]) => whitelist.has(key))
	return (fromPairs(pairs): any)
}
