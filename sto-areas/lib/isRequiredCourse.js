import {find, contains, all} from 'lodash'

let isRequiredCourse = curry(function(requiredCourses, checkAgainst) {
	// Takes in a list of required course info, as objects that only have the
	// info needed to match.

	// Find if the current course exists in requiredCourses
	let matchedCourse = find(requiredCourses, {deptnum: checkAgainst.deptnum})

	// Begin the array of results!
	let results = [matchedCourse ? true : false]

	if (!matchedCourse) {
		return false
	}

	if (matchedCourse.name) {
		results.push(contains(checkAgainst.name, matchedCourse.name))
	}

	if (matchedCourse.title) {
		results.push(contains(checkAgainst.title, matchedCourse.title))
	}

	/*console.log('isRequiredCourse',
		'requiredCourses', requiredCourses,
		'checkAgainst', checkAgainst,
		'match', matchedCourse,
		'results', results,
		'result', all(results))*/

	// Only return true if *all* of the checks returned true.
	return all(results)
})

export default isRequiredCourse
