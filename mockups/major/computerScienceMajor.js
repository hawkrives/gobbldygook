import * as _ from 'lodash'

import hasDepartment from 'app/helpers/hasDepartment'
import {partialNameOrTitle} from 'app/helpers/partialTitle'
import {checkCoursesFor} from 'app/helpers/courses'

import isRequiredCourse from 'sto-areas/lib/isRequiredCourse'

const csDeptRequiredCourses = [
	{deptnum: 'CSCI 121'}, {deptnum: 'CSCI 125'}, {deptnum: 'CSCI 241'}, {deptnum: 'CSCI 251'},
	{deptnum: 'CSCI 252'}, {deptnum: 'CSCI 231'}, {deptnum: 'CSCI 253'}, {deptnum: 'CSCI 263'},
	{deptnum: 'CSCI 276'}, {deptnum: 'CSCI 333'}, {deptnum: 'CSCI 273'}, {deptnum: 'CSCI 284'},
	{deptnum: 'CSCI 390'},

	// IR/IS
	{deptnum: 'CSCI 298'}, {deptnum: 'CSCI 398'},

	{deptnum: 'CSCI 300', name: 'Parallel'},

	{deptnum: 'MATH 232'}, {deptnum: 'MATH 252'},
]

let isRequiredCompSciCourse = _.curry(isRequiredCourse(csDeptRequiredCourses))

function foundationCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	let cs1 = _.any([
		checkCoursesFor(courses, {deptnum:'CSCI 121'}),
		checkCoursesFor(courses, {deptnum:'CSCI 125'}),
	])

	let design = _.all([
		checkCoursesFor(courses, {deptnum:'CSCI 241'}),
		checkCoursesFor(courses, {deptnum:'CSCI 251'}),
		checkCoursesFor(courses, {deptnum:'CSCI 252'}),
	])

	let proofWriting = _.any([
		checkCoursesFor(courses, {deptnum:'MATH 282', term:20141}),
		checkCoursesFor(courses, {deptnum:'MATH 244'}),
		checkCoursesFor(courses, {deptnum:'MATH 252'}),
	])

	let requirements = [
		{
			title: 'CS1',
			result: cs1,
		},
		{
			title: 'Design',
			result: design,
		},
		{
			title: 'Proof Writing',
			result: proofWriting,
		},
	]

	return {
		title: 'Foundation',
		description: '- one of Computer Science 121 or 125;\n- Computer Science 241, 251, and 252;\n- one of Computer Science 231 or Math 232 or Math 252.',
		result: _.all(requirements, 'result'),
		type: 'array/boolean',
		details: requirements,
	}
}

function coreCourses(courses) {
	/* Core courses:
		- Computer Science 253;
		- Computer Science 263;
		- either of Computer Science 276 or 333;
		- and either Computer Science 273, 284, or 300 with parallel and distributed computing.
	*/

	let algorithms = checkCoursesFor(courses, {deptnum:'CSCI 253'})

	let ethics = checkCoursesFor(courses, {deptnum:'CSCI 263'})

	let theory = _.any([
		checkCoursesFor(courses, {deptnum:'CSCI 276'}),
		checkCoursesFor(courses, {deptnum:'CSCI 333'})
	])

	let parallelDistributedComputing = _.chain(courses)
		.filter({deptnum:'CSCI 300'})
		.filter(partialNameOrTitle('Parallel'))
		.size().value() >= 1

	let options = _.any([
		checkCoursesFor(courses, {deptnum:'CSCI 273'}),
		checkCoursesFor(courses, {deptnum:'CSCI 284'}),
		parallelDistributedComputing
	])

	let requirements = [
		{
			title: 'Algorithms',
			result: algorithms,
			description: '**Algorithms:** Computer Science 253 *(Algorithms and Data Structures)*',
		},
		{
			title: 'Ethics',
			result: ethics,
		},
		{
			title: 'Theory',
			result: theory,
		},
		{
			title: 'Options',
			result: options
		},
	]

	return {
		title: 'Core',
		type: 'array/boolean',
		description: '- **Algorithms:** Computer Science 253 *(Algorithms and Data Structures)*;\n- **Ethics:** Computer Science 263 *(Ethical Issues in Software Design)*;\n- **Theory:** either Computer Science 276 *(Programming Languages)* or 333 *(Theory of Computation)*;\n- **Options:** and either Computer Science 273 *(Operating Systems)*, 284 *(Mobile Computing Applications)*, or 300 *(Topics)* with parallel and distributed computing.',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	let validCourses = _.chain(courses)
		.filter(hasDepartment('CSCI'))
		.reject(isRequiredCompSciCourse)
		.value()

	let numberTaken = _.size(validCourses)
	let numberNeeded = 2

	return {
		title: 'Electives',
		type: 'object/number',
		description: 'Two approved electives.',
		result: numberTaken >= numberNeeded,
		details: {
			has: numberTaken,
			needs: numberNeeded,
			matches: validCourses,
		}
	}
}

function capstoneCourse(courses) {
	// Capstone: Computer Science 390
	let hasTakenCapstone = checkCoursesFor(courses, {dept:'CSCI', num:390})

	return {
		title: 'Capstone',
		type: 'boolean',
		description: 'The Computer Science Capstone Course',
		result: hasTakenCapstone
	}
}

function checkComputerScienceMajor(student) {
	return student.data().then((studentPieces) => {
		let {courses} = studentPieces

		let computerScienceMajorRequirements = [
			foundationCourses(courses),
			coreCourses(courses),
			electiveCourses(courses),
			capstoneCourse(courses),
		]

		return {
			result: _.all(computerScienceMajorRequirements, 'result'),
			details: computerScienceMajorRequirements,
		}
	})
}

export default checkComputerScienceMajor
