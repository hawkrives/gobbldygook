import all from 'lodash/collection/all'
import contains from 'lodash/collection/contains'
import curry from 'lodash/function/curry'
import find from 'lodash/collection/find'

/**
 * Takes a list of required courses and checks if a course matches.
 *
 * @param {Array<Course>} requiredCourses - the required courses.
 * @param {Course} checkAgainst - the course to check.
 * @returns {Boolean} - is the course in the list.
 */
let isRequiredCourse = curry(function(requiredCourses, checkAgainst) {
	// Takes in a list of required course info, as objects that only have the
	// info needed to match.

	// Find if the current course exists in requiredCourses
	let matchedCourse = find(requiredCourses, {deptnum: checkAgainst.deptnum})

	if (!matchedCourse) {
		return false
	}

	// Begin the array of results!
	let results = [matchedCourse ? true : false]

	if (matchedCourse.name) {
		results.push(contains(checkAgainst.name, matchedCourse.name))
	}

	if (matchedCourse.title) {
		results.push(contains(checkAgainst.title, matchedCourse.title))
	}

	// Only return true if *all* of the checks returned true.
	return all(results)
})

export default isRequiredCourse
