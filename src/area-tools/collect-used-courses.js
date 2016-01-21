import map from 'lodash/map'
import filter from 'lodash/filter'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'
import uniq from 'lodash/uniq'

export default function collectUsedCourses(expr) {
	// this function needs to end up with a list of all of the courses
	// anywhere in this object which have the `_used` property.

	// check to see we're on a _used course
	if (expr.$type === 'course' && '_used' in expr && '$course' in expr) {
		return expr.$course
	}

	// if not, check all sub-chunks
	const onlyChildItems = filter(expr, thing => isPlainObject(thing) || isArray(thing))
	const children = map(onlyChildItems, collectUsedCourses)

	// flatten the list
	const courses = flattenDeep(children)

	return uniq(courses) || []
}
