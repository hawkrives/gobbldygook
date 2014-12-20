import * as _ from 'lodash'

import hasDepartment from 'helpers/hasDepartment'
import {partialNameOrTitle} from 'helpers/partialTitle'
import {coursesAboveNumber} from 'helpers/courseLevels'
import {checkCoursesFor} from 'helpers/courses'

import {isRequiredCourse} from './commonMajorUtilities.es6'

const japaneseStudiesRequiredCourses = [
	{deptnum: 'ASIAN 275'}, {deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

let isRequiredJapaneseStudiesCourse = isRequiredCourse(japaneseStudiesRequiredCourses)

function lowerLevelLanguageCourses(course) {
	return _.all([
		hasDepartment(['CHINA', 'JAPAN'], course),
		(course.level < 300),
	])
}

function language(courses) {
	// Four Japanese language courses above Japanese 112;
	let japaneseLanguage = _.chain(courses)
		.filter(hasDepartment('JAPAN'))
		.filter(coursesAboveNumber(112))
		.value()

	let numberNeeded = 4
	let numberFulfilled = _.size(japaneseLanguage)
	let hasEnoughJapanese = numberFulfilled >= numberNeeded

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Japanese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: japaneseLanguage,
		}
	}
}

function electives(courses) {
	// Two other courses on China;
	// no level I or II language courses may count in this category

	let asianCon = _.chain(courses)
		.filter(c => _.all([
			hasDepartment('ASIAN', c),
			_.contains([210, 215, 216, 220], c.num)
		]))
		.value()

	let japaneseElectives = _.chain(courses)
		// Only things in the Asian Studies or Japanese departments...
		.filter(hasDepartment(['ASIAN', 'JAPAN']))
		// that have the stems Japanese or China in their names...
		.filter(partialNameOrTitle(['Japanese', 'Japan']))
		// ignoring the language courses under 300 level...
		.reject(lowerLevelLanguageCourses)
		// and rejecting the required japanese studies courses,
		.reject(isRequiredJapaneseStudiesCourse)
		// then adding in AsianCon.
		.concat(asianCon)
		.value()

	let matching = _.size(japaneseElectives)
	let needs = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Two other courses on China; no level I or II language courses may count in this category',
		result: matching >= needs,
		details: {
			has: matching,
			needs: needs,
			matches: japaneseElectives
		}
	}
}

function checkJapaneseStudiesConcentration(student) {
	return Promise.all([
		student.courses
	]).then((studentPieces) => {
		let [courses] = studentPieces

		let japaneseStudiesConcentrationRequirements = [
			language(courses),
			electives(courses),
		]

		return {
			result: _.all(japaneseStudiesConcentrationRequirements, 'result'),
			details: japaneseStudiesConcentrationRequirements
		}
	})
}

export default checkJapaneseStudiesConcentration
