import all from 'lodash/collection/all'
import any from 'lodash/collection/any'
import compact from 'lodash/array/compact'
import contains from 'lodash/collection/contains'
import has from 'lodash/object/has'
import indexOf from 'lodash/array/indexOf'
import isArray from 'lodash/lang/isArray'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import rest from 'lodash/array/rest'
import size from 'lodash/collection/size'
import takeWhile from 'lodash/array/takeWhile'

const checkCourseAgainstQueryBit = course => ([key, values]) => {
	if (!has(course, key)) {
		return false
	}

	let substring = false

	// values is either:
	// - a 1-long array
	// - an $AND, $OR, $NOT, or $XOR query
	// - one of the above, but substring

	let hasBool = indexOf(values[0], '$') === 0
	let OR  = values[0] === '$OR'
	let NOR = values[0] === '$NOR'
	let AND = values[0] === '$AND'
	let NOT = values[0] === '$NOT'
	let XOR = values[0] === '$XOR'

	if (hasBool) {
		// remove the first value from the array
		// by returning all but the first element
		values = rest(values)
	}

	if (contains(['title', 'name', 'description', 'notes', 'instructors', 'times', 'locations'], key)) {
		substring = true
	}

	let internalMatches = map(values, val => {
		// dept, gereqs, etc.
		if (isArray(course[key]) && !substring) {
			return contains(course[key], val)
		}
		else if (isArray(course[key]) && substring) {
			return any(map(course[key], item => contains(item.toLowerCase(), val.toLowerCase())))
		}
		else if (substring) {
			return contains(course[key].toLowerCase(), val.toLowerCase())
		}
		return course[key] === val
	})

	if (!hasBool) {
		return all(internalMatches)
	}

	let result = false

	if (OR)   result = any(internalMatches)
	if (NOR)  result = !any(internalMatches)
	if (AND)  result = all(internalMatches)
	if (NOT)  result = !all(internalMatches)
	if (XOR)  result = compact(internalMatches).length === 1

	return result
}

// Checks if a course passes a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits pass the check?
const checkCourseAgainstQuery = query => course => {
	let kvPairs = pairs(query)
	let matches = takeWhile(kvPairs, checkCourseAgainstQueryBit(course))

	return size(kvPairs) === size(matches) && all(matches)
}

export default checkCourseAgainstQuery
