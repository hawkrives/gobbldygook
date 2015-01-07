import _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import {coursesAboveNumber} from 'app/helpers/courseLevels'
import {checkCoursesFor} from 'app/helpers/courses'

import {isAsianCon} from 'sto-areas/lib/isAsianCon'
import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'

const chinaStudiesRequiredCourses = [
	{deptnum: 'ASIAN 275'}, {deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

let isRequiredChinaStudiesCourse = isRequiredCourse(chinaStudiesRequiredCourses)

function lowerLevelLanguageCourses(course) {
	return _.all([
		hasDepartment(['CHINA', 'JAPAN'], course),
		(course.level < 300),
	])
}

function language(courses) {
	// Four Chinese language courses above Chinese 112;
	let chineseLanguage = _(courses)
		.filter(hasDepartment('CHIN'))
		.filter(coursesAboveNumber(112))
		.value()

	let numberNeeded = 4
	let numberFulfilled = _.size(chineseLanguage)
	let hasEnoughChinese = numberFulfilled >= numberNeeded

	return {
		title: 'Language',
		type: 'object/number',
		description: 'Two courses in Chinese or Japanese above 112 or its equivalent',
		result: numberFulfilled >= numberNeeded,
		details: {
			has: numberFulfilled,
			needs: numberNeeded,
			matches: chineseLanguage,
		},
	}
}

function electives(courses) {
	// Two other courses on China;
	// no level I or II language courses may count in this category

	let asianCon = _.filter(courses, isAsianCon)

	let chinaElectives = _(courses)
		// Only things in the Asian Studies or Chinese departments...
		.filter(hasDepartment(['ASIAN', 'CHIN']))
		// that have the stems Chinese or China in their names...
		.filter(partialNameOrTitle(['Chinese', 'China']))
		// ignoring the language courses under 300 level...
		.reject(lowerLevelLanguageCourses)
		// and rejecting the required chinese studies courses,
		.reject(isRequiredChinaStudiesCourse)
		// then adding in AsianCon.
		.concat(asianCon)
		.value()

	let matching = _.size(chinaElectives)
	let needs = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Two other courses on China; no level I or II language courses may count in this category',
		result: matching >= needs,
		details: {
			has: matching,
			needs: needs,
			matches: chinaElectives,
		},
	}
}

function checkChinaStudiesConcentration(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let chinaStudiesConcentrationRequirements = [
			language(courses),
			electives(courses),
		]

		return {
			result: _.all(chinaStudiesConcentrationRequirements, 'result'),
			details: chinaStudiesConcentrationRequirements,
		}
	})
}

export default checkChinaStudiesConcentration
