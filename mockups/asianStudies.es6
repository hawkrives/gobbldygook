'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment'
import {partialNameOrTitle} from '../app/helpers/partialTitle'
import {coursesAtLevel, coursesAtOrAboveLevel} from '../app/helpers/courseLevels'
import {checkCoursesFor} from '../app/helpers/courses'

import {isRequiredCourse} from './commonMajorUtilities'

const asianDeptRequiredCourses = [
	{deptnum: 'ASIAN 275'},

	{deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

var isRequiredAsianStudiesCourse = _.curry(isRequiredCourse(asianDeptRequiredCourses))

function interdisciplinaryApproachesToAsia(courses) {
	// Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
	return {
		title: 'Interdisciplinary Approaches to Asia',
		type: 'boolean',
		description: 'Asian Studies 275: Interdisciplinary Approaches to Asia',
		result: checkCoursesFor(courses, {dept:'ASIAN', num:275})
	}
}

function lowerLevelLanguageCourses(course) {
	// If all of these match, it is a lower-level language course, and will be
	// rejected by the `reject` method.
	return (
		(
			hasDepartment('ASIAN', course) ||
			hasDepartment('CHINA', course) ||
			hasDepartment('JAPAN', course))
		&&
		(partialNameOrTitle('Beginner', course) || partialNameOrTitle('Intermediate', course))
		&&
		(course.level < 300)
	)
}

function electives(courses) {
	// Six electives, with stipulations:
	// 1. At least two at level II or level III, taken on campus;
	// 2. No more than two at level I;
	// 3. No more than four elective courses about any one country;
	// 4. No level I or level II language courses may count.

	var asianStudiesElectives = _.chain(courses)
		.filter(hasDepartment('ASIAN'))
		.reject(lowerLevelLanguageCourses)
		.reject(isRequiredAsianStudiesCourse)
		.value()

	var levelsTwoOrThree = _.chain(asianStudiesElectives)
		.filter(coursesAtOrAboveLevel(200)).size().value() >= 2

	var onlyTwoAtLevelOne = _.chain(asianStudiesElectives)
		.filter(coursesAtLevel(100)).size().value() <= 2

	var notTooSpecialized = _.any([
		_.chain(asianStudiesElectives).filter(partialNameOrTitle('China')).size().value() <= 4,
		_.chain(asianStudiesElectives).filter(partialNameOrTitle('Japan')).size().value() <= 4,
	])

	var electivesAreGood = _.all(levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized)
	// console.log('asianStudiesElectives', asianStudiesElectives)

	var matching = _.size(asianStudiesElectives)
	var needs = 6

	// Req. #4 was embedded at the beginning, when we reject any lower-level
	// languages. That way, we can't count them.
	let details = [
		levelsTwoOrThree,
		onlyTwoAtLevelOne,
		notTooSpecialized
	]
	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: asianStudiesElectives
		}
	}
}

function seniorSeminar(courses) {
	// Senior Seminar: One of:
	// - Asian Studies 397: Human Rights/Asian Context, or
	// - Asian Studies 399: Asian Studies Seminar
	var humanRights = checkCoursesFor(courses, {dept:'ASIAN', num:397})
	var asiaSeminar = checkCoursesFor(courses, {dept:'ASIAN', num:399})

	let seminars = [
		humanRights,
		asiaSeminar
	]

	var seminarCount = _.size(_.compact(seminars))
	var seminarsNeeded = 1

	return {
		title: 'Senior Seminar',
		type: 'boolean',
		description: 'Senior Seminar: One of Asian Studies 397: Human Rights/Asian Context, or Asian Studies 399: Asian Studies Seminar',
		result: seminarCount >= seminarsNeeded
	}
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
		.filter(partialNameOrTitle('Japanese'))
		.value()

	var chineseLanguage = _.chain(subsetOfCourses)
		.filter(hasDepartment('CHIN'))
		.filter(partialNameOrTitle('Chinese'))
		.value()

	var fulfilledLanguages = _.filter([japaneseLanguage, chineseLanguage], function(courses) {
		return _.size(courses) >= 2
	})
	var fulfilledLanguageCourses = _.flatten(fulfilledLanguages)

	var numberFulfilled = _.size(fulfilledLanguages)
	var numberNeeded = 1

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Chinese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: fulfilledLanguageCourses,
		}
	}
}

function checkAsianStudiesMajor(student) {
	var asianStudiesMajorRequirements = [
		interdisciplinaryApproachesToAsia(student.courses),
		electives(student.courses),
		seniorSeminar(student.courses),
		language(student.courses),
	]

	return {
		result: _.all(asianStudiesMajorRequirements, 'result'),
		details: asianStudiesMajorRequirements
	}
}

export default checkAsianStudiesMajor
