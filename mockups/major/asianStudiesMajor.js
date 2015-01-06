import * as _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import {coursesAtLevel, coursesAtOrAboveLevel} from 'app/helpers/courseLevels'
import {checkCoursesFor} from 'app/helpers/courses'

import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'

const ASIAN_REQUIRED_COURSES = [
	{deptnum: 'ASIAN 275'},

	{deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

let isRequiredAsianStudiesCourse = isRequiredCourse(ASIAN_REQUIRED_COURSES)

function interdisciplinaryApproachesToAsia(courses) {
	// Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
	return {
		title: 'Interdisciplinary Approaches to Asia',
		type: 'boolean',
		description: 'Asian Studies 275: Interdisciplinary Approaches to Asia',
		result: checkCoursesFor(courses, {deptnum:'ASIAN 275'}),
	}
}

function lowerLevelLanguageCourses(course) {
	// If all of these match, it is a lower-level language course, and will be
	// rejected by the `reject` method.
	return _.all([
		hasDepartment(['CHINA', 'JAPAN'], course),
		(course.level < 300),
	])
}

function electives(courses) {
	// Six electives, with stipulations:
	// 1. At least two at level II or level III, taken on campus;
	// 2. No more than two at level I;
	// 3. No more than four elective courses about any one country;
	// 4. No level I or level II language courses may count.

	let asianStudiesElectives = _(courses)
		.filter(hasDepartment('ASIAN'))
		.reject(lowerLevelLanguageCourses)
		.reject(isRequiredAsianStudiesCourse)
		.value()

	let levelsTwoOrThree = _(asianStudiesElectives)
		.filter(coursesAtOrAboveLevel(200))
		.size() >= 2

	let onlyTwoAtLevelOne = _(asianStudiesElectives)
		.filter(coursesAtLevel(100))
		.size() <= 2

	let notTooSpecialized = _.any([
		_(asianStudiesElectives).filter(partialNameOrTitle('China')).size() <= 4,
		_(asianStudiesElectives).filter(partialNameOrTitle('Japan')).size() <= 4,
	])

	let electivesAreGood = _.all([levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized])
	// console.log('asianStudiesElectives', asianStudiesElectives)

	let matching = _.size(asianStudiesElectives)
	let needs = 6

	// Req. #4 was embedded at the beginning, when we reject any lower-level
	// languages. That way, we can't count them.
	let details = [
		levelsTwoOrThree,
		onlyTwoAtLevelOne,
		notTooSpecialized,
	]
	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: asianStudiesElectives,
		},
	}
}

function seniorSeminar(courses) {
	// Senior Seminar: One of:
	// - Asian Studies 397: Human Rights/Asian Context, or
	// - Asian Studies 399: Asian Studies Seminar
	let humanRights = checkCoursesFor(courses, {deptnum:'ASIAN 397'})
	let asiaSeminar = checkCoursesFor(courses, {deptnum:'ASIAN 399'})

	let seminars = [
		humanRights,
		asiaSeminar,
	]

	let seminarCount = _(seminars).compact().size()
	let seminarsNeeded = 1

	return {
		title: 'Senior Seminar',
		type: 'boolean',
		description: 'Senior Seminar: One of Asian Studies 397: Human Rights/Asian Context, or Asian Studies 399: Asian Studies Seminar',
		result: seminarCount >= seminarsNeeded,
	}
}

function language(courses) {
	// Two courses in Chinese or Japanese above 112 or its equivalent
	// "'JAPAN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Japanese') IN title"
	// "'CHIN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Chinese') IN title"
	let subsetOfCourses = _(courses)
		.filter(coursesAtOrAboveLevel(200))
		.filter((course) => partialNameOrTitle(['Intermediate', 'Advanced'], course))
		.value()

	let japaneseLanguage = _(subsetOfCourses)
		.filter(hasDepartment('JAPAN'))
		.filter(partialNameOrTitle('Japanese'))
		.value()

	let chineseLanguage = _(subsetOfCourses)
		.filter(hasDepartment('CHIN'))
		.filter(partialNameOrTitle('Chinese'))
		.value()

	let fulfilledLanguages = _.filter([japaneseLanguage, chineseLanguage], (courses) => _.size(courses) >= 2)
	let fulfilledLanguageCourses = _.flatten(fulfilledLanguages)

	let numberFulfilled = _.size(fulfilledLanguages)
	let numberNeeded = 1

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Chinese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: fulfilledLanguageCourses,
		},
	}
}

function checkAsianStudiesMajor(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let asianStudiesMajorRequirements = [
			interdisciplinaryApproachesToAsia(courses),
			electives(courses),
			language(courses),
			seniorSeminar(courses),
		]

		return {
			result: _.all(asianStudiesMajorRequirements, 'result'),
			details: asianStudiesMajorRequirements,
		}
	})
}

export default checkAsianStudiesMajor
