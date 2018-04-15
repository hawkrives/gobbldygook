// @flow
import isPlainObject from 'lodash/isPlainObject'
import flattenDeep from 'lodash/flattenDeep'
import uniq from 'lodash/uniq'
import values from 'lodash/values'
import type {Expression, Course} from './types'

export default function collectTakenCourses(expr: Expression): Course[] {
	// this function needs to end up with a list of all of the courses
	// anywhere in this object which have the `_taken` property.

	// check to see we're on a _taken course
	if (expr.$type === 'course' && '_taken' in expr && '$course' in expr) {
		return [expr.$course]
	}

	// if not, check all sub-chunks
	const tuples = values(expr)
	const onlyChildItems = tuples.filter(
		value => isPlainObject(value) || Array.isArray(value),
	)
	const children = onlyChildItems.map(collectTakenCourses)

	// flatten the list
	const courses = flattenDeep(children)

	return uniq(courses) || []
}
