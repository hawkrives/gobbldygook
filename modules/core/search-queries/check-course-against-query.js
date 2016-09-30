import compact from 'lodash/compact'
import every from 'lodash/every'
import has from 'lodash/has'
import includes from 'lodash/includes'
import indexOf from 'lodash/indexOf'
import isArray from 'lodash/isArray'
import map from 'lodash/map'
import size from 'lodash/size'
import some from 'lodash/some'
import tail from 'lodash/tail'
import takeWhile from 'lodash/takeWhile'
import toPairs from 'lodash/toPairs'

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
		values = tail(values)
	}

	if (includes(['title', 'name', 'description', 'notes', 'instructors', 'times', 'locations'], key)) {
		substring = true
	}

	let internalMatches = map(values, val => {
		// dept, gereqs, etc.
		if (isArray(course[key]) && !substring) {
			return includes(course[key], val)
		}
		else if (isArray(course[key]) && substring) {
			return some(map(course[key], item => includes(item.toLowerCase(), val.toLowerCase())))
		}
		else if (substring) {
			return includes(course[key].toLowerCase(), val.toLowerCase())
		}
		return course[key] === val
	})

	if (!hasBool) {
		return every(internalMatches)
	}

	let result = false

	if (OR)   result = some(internalMatches)
	if (NOR)  result = !some(internalMatches)
	if (AND)  result = every(internalMatches)
	if (NOT)  result = !every(internalMatches)
	if (XOR)  result = compact(internalMatches).length === 1

	return result
}

// Checks if a course passes a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits pass the check?
export const checkCourseAgainstQuery = query => course => {
	let kvPairs = toPairs(query)
	let matches = takeWhile(kvPairs, checkCourseAgainstQueryBit(course))

	return size(kvPairs) === size(matches) && every(matches)
}
