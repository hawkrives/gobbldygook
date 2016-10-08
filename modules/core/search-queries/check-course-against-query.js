import {compact} from 'lodash'
import {every} from 'lodash'
import {has} from 'lodash'
import {includes} from 'lodash'
import {indexOf} from 'lodash'
import {isArray} from 'lodash'
import {map} from 'lodash'
import {size} from 'lodash'
import {some} from 'lodash'
import {tail} from 'lodash'
import {takeWhile} from 'lodash'
import {toPairs} from 'lodash'

function checkCourseAgainstQueryBit(course, [key, values]) {
	if (!has(course, key)) {
		return false
	}

	let substring = false

	// values is either:
	// - a 1-long array
	// - an $AND, $OR, $NOT, $NOR, or $XOR query
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
export function checkCourseAgainstQuery(query, course) {
	let kvPairs = toPairs(query)
	let matches = takeWhile(kvPairs, pair => checkCourseAgainstQueryBit(course, pair))

	return size(kvPairs) === size(matches) && every(matches)
}
