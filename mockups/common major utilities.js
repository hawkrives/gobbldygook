var _ = require('lodash')
var Promise = require('bluebird')

function isRequiredCourse(requiredCourses, lookingFor) {
	var matchedCourse = _.find(requiredCourses, {deptnum: lookingFor.deptnum})
	var results = [matchedCourse ? true : false]

	if (!matchedCourse) {
		return false
	}

	if (lookingFor.name) {
		results.push(_.contains(lookingFor.name, matchedCourse.name))
	}

	if (lookingFor.title) {
		results.push(_.contains(lookingFor.title, matchedCourse.title))
	}

	return _.all(results)
}

module.exports.isRequiredCourse = isRequiredCourse
