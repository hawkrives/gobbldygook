import {map, filter, isPlainObject, isArray, flattenDeep, uniq} from 'lodash-es'

export default function collectTakenCourses(expr) {
	// this function needs to end up with a list of all of the courses
	// anywhere in this object which have the `_taken` property.

	// check to see we're on a _taken course
	if (expr.$type === 'course' && '_taken' in expr && '$course' in expr) {
		return expr.$course
	}

	// if not, check all sub-chunks
	const onlyChildItems = filter(expr, thing => isPlainObject(thing) || isArray(thing))
	const children = map(onlyChildItems, collectTakenCourses)

	// flatten the list
	const courses = flattenDeep(children)

	return uniq(courses) || []
}
