import * as _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import {coursesAtLevel, coursesAtOrAboveLevel} from 'app/helpers/courseLevels'
import {checkCoursesFor} from 'app/helpers/courses'

import {isRequiredCourse} from 'sto-areas/lib/commonMajorUtilities'

const asianDeptRequiredCourses = [
	{deptnum: 'ASIAN 275'}, {deptnum: 'ASIAN 397'}, {deptnum: 'ASIAN 399'},
]

var isRequiredAsianStudiesCourse = isRequiredCourse(asianDeptRequiredCourses)

function languageCourses(course) {
	// If all of these match, it is a lower-level language course, and will be
	// rejected by the `reject` method.
	return hasDepartment(['CHINA', 'JAPAN'], course)
}

function electives(courses) {
	// An Asian studies concentration consists of six courses:
	// - At least two of the six courses must be taken on campus
	// - No language courses may count toward this concentration

	let asianStudiesElectives = _.chain(courses)
		.filter(hasDepartment('ASIAN'))
		.reject(lowerLevelLanguageCourses)
		.reject(isRequiredAsianStudiesCourse)
		.value()

	let asianStudiesElectivesOnCampus = _.chain(asianStudiesElectives)
		.reject({kind: 'fabrication'})
		.value()

	let totalTaken = _.size(asianStudiesElectives)
	let needs = 6

	let takenOnCampus = _.size(asianStudiesElectivesOnCampus)
	let needsOnCampus = 2

	let result = _.all([
		totalTaken >= needs,
		takenOnCampus >= needsOnCampus,
	])

	return {
		title: 'Electives',
		type: 'object/number',
		description: '// An Asian studies concentration consists of six courses: At least two of the six courses must be taken on campus, and No language courses may count toward this concentration',
		result: result,
		details: {
			has: totalTaken,
			needs: needs,
			matches: asianStudiesElectives
		}
	}
}

function checkAsianStudiesConcentration(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		var asianStudiesConcentrationRequirements = [
			electives(courses),
		]

		return {
			result: _.all(asianStudiesConcentrationRequirements, 'result'),
			details: asianStudiesConcentrationRequirements
		}
	})
}

export default checkAsianStudiesConcentration
