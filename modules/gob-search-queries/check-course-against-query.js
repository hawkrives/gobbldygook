import takeWhile from 'lodash/takeWhile'
import toPairs from 'lodash/toPairs'

const isTrue = x => x === true
const isTruthy = x => Boolean(x)

const SUBSTRING_KEYS = new Set([
	'title',
	'name',
	'description',
	'notes',
	'instructors',
	'times',
	'locations',
])

function checkCourseAgainstQueryBit(course, [key, values]) {
	if (!course.hasOwnProperty(key)) {
		return false
	}

	let substring = SUBSTRING_KEYS.has(key)

	// values is either:
	// - a 1-long array
	// - an $AND, $OR, $NOT, $NOR, or $XOR query
	// - one of the above, but substring

	let hasBool = typeof values[0] === 'string' && values[0].startsWith('$')
	let OR = values[0] === '$OR'
	let NOR = values[0] === '$NOR'
	let AND = values[0] === '$AND'
	let NOT = values[0] === '$NOT'
	let XOR = values[0] === '$XOR'

	if (hasBool) {
		// remove the first value from the array by returning all but the first element
		values = values.slice(1)
	}

	let internalMatches = values.map(val => {
		// dept, gereqs, etc.
		if (Array.isArray(course[key]) && !substring) {
			return course[key].includes(val)
		}

		if (Array.isArray(course[key]) && substring) {
			val = val.toLowerCase()
			return course[key]
				.map(item => item.toLowerCase().includes(val))
				.some(isTrue)
		}

		if (substring) {
			val = val.toLowerCase()
			return course[key].toLowerCase().includes(val)
		}

		return course[key] === val
	})

	if (!hasBool) {
		return internalMatches.every(isTrue)
	}

	let result = false

	if (OR) result = internalMatches.some(isTrue)
	if (NOR) result = !internalMatches.some(isTrue)
	if (AND) result = internalMatches.every(isTrue)
	if (NOT) result = !internalMatches.every(isTrue)
	if (XOR) result = internalMatches.filter(isTrue).length === 1

	return result
}

// Checks if a course passes a query check.
// query: Object | the query object that comes out of buildQueryFromString
// course: Course | the course to check
// returns: Boolean | did all query bits pass the check?
export function checkCourseAgainstQuery(query, course) {
	let kvPairs = toPairs(query)
	let matches = takeWhile(kvPairs, pair =>
		checkCourseAgainstQueryBit(course, pair),
	)

	return kvPairs.length === matches.length && matches.every(isTruthy)
}
