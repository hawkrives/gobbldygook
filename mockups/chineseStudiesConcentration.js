import * as _ from 'lodash'

import hasDepartment from 'helpers/hasDepartment'
import {partialNameOrTitle} from 'helpers/partialTitle'
import {coursesAboveNumber} from 'helpers/courseLevels'
import {checkCoursesFor} from 'helpers/courses'

import {isRequiredCourse} from './commonMajorUtilities.es6'

const chineseStudiesRequiredCourses = [
	{deptnum: 'ASIAN 275'}, {deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

let isRequiredChineseStudiesCourse = isRequiredCourse(chineseStudiesRequiredCourses)

function lowerLevelLanguageCourses(course) {
	return _.all([
		hasDepartment(['CHINA', 'JAPAN'], course),
		(course.level < 300),
	])
}

function language(courses) {
	// Four Chinese language courses above Chinese 112;
	let chineseLanguage = _.chain(courses)
		.filter(hasDepartment('CHIN'))
		.filter(coursesAboveNumber(112))
		.value()

	let numberNeeded = 4
	let numberFulfilled = _.size(japaneseLanguage)
	let hasEnoughChinese = _.size(chineseLanguage) >= numberNeeded

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Chinese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: chineseLanguage,
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

	let chineseElectives = _.chain(courses)
		// Only things in the Asian Studies or Chinese departments...
		.filter(hasDepartment(['ASIAN', 'CHIN']))
		// that have the stems Chinese or China in their names...
		.filter(partialNameOrTitle(['Chinese', 'China']))
		// ignoring the language courses under 300 level...
		.reject(lowerLevelLanguageCourses)
		// and rejecting the required chinese studies courses,
		.reject(isRequiredChineseStudiesCourse)
		// then adding in AsianCon.
		.concat(asianCon)
		.value()

	let matching = _.size(chineseElectives)
	let needs = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Two other courses on China; no level I or II language courses may count in this category',
		result: matching >= needs,
		details: {
			has: matching,
			needs: needs,
			matches: chineseElectives
		}
	}
}

function checkChineseStudiesConcentration(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let chineseStudiesConcentrationRequirements = [
			language(courses),
			electives(courses),
		]

		return {
			result: _.all(chineseStudiesConcentrationRequirements, 'result'),
			details: chineseStudiesConcentrationRequirements
		}
	})
}

export default checkChineseStudiesConcentration
