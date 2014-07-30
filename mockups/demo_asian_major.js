var _ = require('lodash')
var Promise = require('bluebird')

var hasDepartment = require('../client/helpers/hasDepartment')
var partialNameOrTitle = require('../client/helpers/partialTitle').partialNameOrTitle
var coursesAtLevel = require('../client/helpers/courseLevels').coursesAtLevel
var coursesAtOrAboveLevel = require('../client/helpers/courseLevels').coursesAtOrAboveLevel
var checkCoursesForDeptNum = require('../client/helpers/getCourses').checkCoursesForDeptNum

var utilities = require('./demo_common_major_utilities')

var asianDeptRequiredCourses = [
	{deptnum: 'ASIAN 275'},

	{deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

var isRequiredAsianStudiesCourse = _.curry(utilities.isRequiredCourse)(asianDeptRequiredCourses)

function interdisciplinaryApproachesToAsia(courses) {
	// Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
	return Promise.props({
		title: 'Interdisciplinary Approaches to Asia',
		description: 'Asian Studies 275: Interdisciplinary Approaches to Asia',
		result: checkCoursesForDeptNum(courses, 'ASIAN 275')
	})
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
		(partialNameOrTitle('Beginner', course) || partialNameOrTitle('Intermediate', course)) &&
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
		.reject(isRequiredAsianStudiesCourse)
		.value()

	var levelsTwoOrThree = _.chain(asianStudiesCourses)
		.filter(coursesAtOrAboveLevel(200)).size().value() >= 2

	var onlyTwoAtLevelOne = _.chain(asianStudiesCourses)
		.filter(coursesAtLevel(100)).size().value() <= 2

	var notTooSpecialized = _.any([
		_.chain(asianStudiesCourses).filter(partialNameOrTitle('China')).size().value() <= 4,
		_.chain(asianStudiesCourses).filter(partialNameOrTitle('Japan')).size().value() <= 4,
	])

	var matchingElectives = _.union(levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized)

	var matching = _.size(matchingElectives)
	var needs = 6

	// Req. #4 was embedded at the beginning, when we reject any lower-level
	// languages. That way, we can't count them.
	return Promise.all([
		levelsTwoOrThree,
		onlyTwoAtLevelOne,
		notTooSpecialized
	]).then(function(details) {
		return {
			title: 'Electives',
			description: 'Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.',
			result: matching >= needs,
			details: {
				has: matching,
				needs: needs,
				matches: matchingElectives
			}
		}
	})
}

function seniorSeminar(courses) {
	// Senior Seminar: One of:
	// - Asian Studies 397: Human Rights/Asian Context, or
	// - Asian Studies 399: Asian Studies Seminar
	var humanRights = checkCoursesForDeptNum(courses, 'ASIAN 397')
	var asiaSeminar = checkCoursesForDeptNum(courses, 'ASIAN 399')
	return Promise.props({
		humanRights: humanRights,
		asiaSeminar: asiaSeminar
	}).then(function(seminars) {
		return {
			title: 'Senior Seminar',
			description: 'Senior Seminar: One of Asian Studies 397: Human Rights/Asian Context, or Asian Studies 399: Asian Studies Seminar',
			result: _.any(seminars),
			details: seminars
		}
	})
}

function language(courses) {
	// Two courses in Chinese or Japanese above 112 or its equivalent
	// "'JAPAN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Japanese') IN title"
	// "'CHIN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Chinese') IN title"
	var subsetOfCourses = _.chain(courses)
		.filter(coursesAtOrAboveLevel(200))
		.filter(function(course) {
			return partialNameOrTitle('Intermediate', course) || partialNameOrTitle('Advanced', course)
		}).value()

	var japaneseLanguage = _.chain(subsetOfCourses)
		.filter(hasDepartment('JAPAN'))

	console.log('japaneseLanguage', japaneseLanguage, subsetOfCourses)
		.filter(partialNameOrTitle('Japanese'))
		.value()

	var chineseLanguage = _.chain(subsetOfCourses)
		.filter(hasDepartment('CHIN'))
		.filter(partialNameOrTitle('Chinese'))
		.value()

	var fulfilledLanguages = _.filter([japaneseLanguage, chineseLanguage], function(courses) {
		return _.size(courses) > 2
	})

	var numberFulfilled = _.size(fulfilledLanguages)
	var numberNeeded = 1

	return Promise.resolve({
		title: 'Language',
		description: 'Two courses in Chinese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: fulfilledLanguages,
		}
	})
}

function checkAsianStudiesMajor(student) {
	// TODO: Turn off cortex.
	var asianStudiesMajorRequirements = Promise.all([
		interdisciplinaryApproachesToAsia(student.courses),
		electives(student.courses),
		seniorSeminar(student.courses),
		language(student.courses),
	]).then(function(results) {
		// console.log('checkAsianStudiesMajor results', results)
		return results
	})

	return Promise.props({
		result: asianStudiesMajorRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: asianStudiesMajorRequirements
	})
}

module.exports = checkAsianStudiesMajor
