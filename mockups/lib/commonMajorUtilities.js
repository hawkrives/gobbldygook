import * as _ from 'lodash'

var isRequiredCourse = _.curry(function(requiredCourses, checkAgainst) {
	// Takes in a list of required course info, as objects that only have the
	// info needed to match.

	// Find if the current course exists in requiredCourses
	var matchedCourse = _.find(requiredCourses, {deptnum: checkAgainst.deptnum})

	// Begin the array of results!
	var results = [matchedCourse ? true : false]

	if (!matchedCourse) {
		return false
	}

	if (matchedCourse.name) {
		results.push(_.contains(checkAgainst.name, matchedCourse.name))
	}

	if (matchedCourse.title) {
		results.push(_.contains(checkAgainst.title, matchedCourse.title))
	}

	/*console.log('isRequiredCourse',
		'requiredCourses', requiredCourses,
		'checkAgainst', checkAgainst,
		'match', matchedCourse,
		'results', results,
		'result', _.all(results))*/

	// Only return true if *all* of the checks returned true.
	return _.all(results)
})

export {isRequiredCourse}
