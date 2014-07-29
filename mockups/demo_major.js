var _ = require('lodash')
var Promise = require('bluebird')

var helpers = '../client/helpers'
var hasDepartment = require('../client/helpers/hasDepartment')
var partialTitle = require('../client/helpers/partialTitle')
var coursesAtLevel = require('../client/helpers/courseLevels').coursesAtLevel
var coursesAtOrAboveLevel = require('../client/helpers/courseLevels').coursesAtOrAboveLevel
var checkCoursesForDeptNum = require('../client/helpers/getCourses').checkCoursesForDeptNum

function interdisciplinaryApproachesToAsia(courses) {
	// Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
	return Promise.resolve(checkCoursesForDeptNum('ASIAN 275', courses))
}

function lowerLevelLanguageCourses(course) {
	// If all of these match, it is a lower-level language course, and will be
	// rejected by the `reject` method.
	return (
		(
			hasDepartment('ASIAN', course) ||
			hasDepartment('CHINA', course) ||
			hasDepartment('JAPAN', course)
		) &&
		(partialTitle('Beginner', course) || partialTitle('Intermediate', course)) &&
		(course.level < 300)
	)
}

function electives(courses) {
	// Six electives, with stipulations:
	// 1. At least two at level II or level III, taken on campus;
	// 2. No more than two at level I;
	// 3. No more than four elective courses about any one country;
	// 4. No level I or level II language courses may count.

	var asianStudiesCourses = _.chain(courses)
		.filter(hasDepartment('ASIAN'))
		.reject(lowerLevelLanguageCourses)
		.value()

	var levelsTwoOrThree = _.chain(asianStudiesCourses)
		.filter(coursesAtOrAboveLevel(200)).size().value() >= 2

	var onlyTwoAtLevelOne = _.chain(asianStudiesCourses)
		.filter(coursesAtLevel(100)).size().value() <= 2

	var notTooSpecialized = _.any([
		_.chain(asianStudiesCourses).filter(partialTitle('China')).size().value() <= 4,
		_.chain(asianStudiesCourses).filter(partialTitle('Japan')).size().value() <= 4,
	])

	// Req. #4 was embedded at the beginning, when we reject any lower-level
	// languages. That way, we can't count them.
	return Promise.resolve(_.all([levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized]))
}

function seniorSeminar(courses) {
	// Senior Seminar: One of:
	// - Asian Studies 397: Human Rights/Asian Context, or
	// - Asian Studies 399: Asian Studies Seminar
	var humanRights = checkCoursesForDeptNum('ASIAN 397', courses)
	var otherSeminar = checkCoursesForDeptNum('ASIAN 399', courses)
	return Promise.all([humanRights, otherSeminar]).then(function(seminars) {
		var hasTakenSeminar = _.any(seminars)
		console.log('hasTakenSeminar', hasTakenSeminar, seminars)
		return hasTakenSeminar
	})
}

function language(courses) {
	// Two courses in Chinese or Japanese above 112 or its equivalent
	// "'JAPAN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Japanese') IN title"
	// "'CHIN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Chinese') IN title"
	var subsetOfCourses = _.chain(courses)
		.filter(coursesAtOrAboveLevel(200))
		.filter(function(course) {
			return partialTitle('Intermediate', course) || partialTitle('Advanced', course)
		})
		.value()

	var japaneseLanguage = _.chain(subsetOfCourses)
		.filter(hasDepartment('JAPAN'))
		.filter(partialTitle('Japanese'))
		.size().value() >= 2

	var chineseLanguage = _.chain(subsetOfCourses)
		.filter(hasDepartment('CHIN'))
		.filter(partialTitle('Chinese'))
		.size().value() >= 2

	return Promise.resolve(japaneseLanguage || chineseLanguage)
}

function checkAsianStudiesMajor(student) {
	// shuck off cortex for a while
	console.log('checkAsianStudiesMajor', student)

	var asianStudiesMajorRequirements = Promise.props({
		interdisciplinaryApproachesToAsia: interdisciplinaryApproachesToAsia(student.courses),
		electives: electives(student.courses),
		seniorSeminar: seniorSeminar(student.courses),
		language: language(student.courses)
	})

	return Promise.props({
		result: asianStudiesMajorRequirements.then(_.all),
		details: asianStudiesMajorRequirements
	})
}

module.exports = checkAsianStudiesMajor
