import _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import checkCoursesFor from 'app/helpers/checkCoursesFor'
import {coursesAtLevel, coursesAtOrAboveLevel} from 'app/helpers/courseLevels'

import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'

const chemDeptRequiredCourses = [
	{deptnum:'CHEM 121'}, {deptnum:'CHEM 123'}, {deptnum:'CHEM 126'},
	{deptnum:'CHEM 125'}, {deptnum:'CHEM 126'},
	{deptnum:'CHEM/BIO 125'}, {deptnum:'CHEM/BIO 126'}, {deptnum:'CHEM/BIO 227'},

	{deptnum:'CHEM 247'}, {deptnum:'CHEM 248'}, {deptnum:'CHEM 255'}, {deptnum:'CHEM 371'},
	{deptnum:'CHEM 253'}, {deptnum:'CHEM 254'}, {deptnum:'CHEM 256'}, {deptnum:'CHEM 357'},
]

let isRequiredChemistryCourse = _.curry(isRequiredCourse(chemDeptRequiredCourses))

function introductorySequence(courses) {
	// Complete one of the introductory sequences (Chemistry
	// 121/123/126, Chemistry 125/126, or CHEM/BI0 125/126/227).

	let sequences = [
		[{deptnum:'CHEM 121'}, {deptnum:'CHEM 123'}, {deptnum:'CHEM 126'}],
		[{deptnum:'CHEM 125'}, {deptnum:'CHEM 126'}],
		[{deptnum:'CHEM/BIO 125'}, {deptnum:'CHEM/BIO 126'}, {deptnum:'CHEM/BIO 227'}],
	]

	let checkedSequences = _.map(sequences, (sequence) =>
		_.map(sequence, (filter) => checkCoursesFor(courses, filter)))

	return {
		title: 'Introductory Sequence',
		type: 'object/number',
		description: 'Complete one of the introductory sequences: Chemistry 121/123/126, Chemistry 125/126, or CH/BI 125/126/227',
		result: _.any(checkedSequences, (sequence) => _.all(sequence)),
		details: {
			// hasDepartment: matching,
			// needs: needs,
			// matches: asianStudiesElectives
		},
	}
}

function required(courses) {
	// Additional required courses include 247, 248, 255, 371
	let details = []

	return {
		title: 'Required',
		type: 'object/number',
		description: 'Additional required courses include 247, 248, 255, 371',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: asianStudiesElectives,
		},
	}
}

function laboratory(courses) {
	// laboratory courses 253, 254, 256, 357
	let details = []

	return {
		title: 'Laboratory',
		type: 'object/number',
		description: 'laboratory courses 253, 254, 256, 357',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: asianStudiesElectives,
		},
	}
}

function electives(courses) {
	// and at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398.
	let details = []

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: chemistryElectives,
		},
	}
}

function beyondChemistry(courses) {
	// In addition, students majoring in chemistry must take physics through
	// 125 or 232; mathematics through 126 or 128; and attend a total of 12
	// Chemistry Department seminars during their junior and senior years.

	let physics = []
	let mathematics = []
	let seminars = true

	let details = [
		physics,
		mathematics,
		seminars,
	]

	return {
		title: 'Beyond Chemistry',
		type: 'array',
		description: 'In addition, students majoring in chemistry must take physics through 125 or 232; mathematics through 126 or 128; and attend a total of 12 Chemistry Department seminars during their junior and senior years.',
		result: (matching >= needs) && electivesAreGood,
		details: {
			has: matching,
			needs: needs,
			matches: asianStudiesElectives,
		},
	}
}

function checkChemistryMajor(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let chemistryMajorRequirements = [
			introductorySequence(courses),
			// required(courses),
			// laboratory(courses),
			// electives(courses),
			// beyondChemistry(courses),
		]

		return {
			result: _.all(chemistryMajorRequirements, 'result'),
			details: chemistryMajorRequirements,
		}
	})
}

let chemistryMajor = {
	title: 'Chemistry',
	type: 'major',
	id: 'm-chem',
	departmentAbbr: 'CHEM',

	check: checkChemistryMajor,
	_requirements: {
		introductorySequence,
		required,
		laboratory,
		electives,
		beyondChemistry,
	},
}

export default chemistryMajor
