'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment'
import {partialNameOrTitle} from '../app/helpers/partialTitle'
import {checkCoursesFor} from '../app/helpers/courses'

import {isRequiredCourse} from './commonMajorUtilities'

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

	var cs1 = _.any([
		checkCoursesFor(courses, {dept:'CSCI', num:121}),
		checkCoursesFor(courses, {dept:'CSCI', num:125}),
	])

	var design = _.all([
		checkCoursesFor(courses, {dept:'CSCI', num:241}),
		checkCoursesFor(courses, {dept:'CSCI', num:251}),
		checkCoursesFor(courses, {dept:'CSCI', num:252}),
	])

	var proofWriting = _.any([
		checkCoursesFor(courses, {dept:'MATH', num:282, term:20141}),
		checkCoursesFor(courses, {dept:'MATH', num:244}),
		checkCoursesFor(courses, {dept:'MATH', num:252}),
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
		description: 'one of Computer Science 121 or 125; Computer Science 241, 251, and 252; one of Computer Science 231 or Math 232 or Math 252.',
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

	var algorithms = checkCoursesFor(courses, {dept:'CSCI', num:253})

	var ethics = checkCoursesFor(courses, {dept:'CSCI', num:263})

	var theory = _.any([
		checkCoursesFor(courses, {dept:'CSCI', num:276}),
		checkCoursesFor(courses, {dept:'CSCI', num:333})
	])

	var parallelDistributedComputing = _.chain(courses)
		.filter({dept: 'CSCI', num: 300})
		.filter(partialNameOrTitle('Parallel'))
		.size().value() >= 1

	var options = _.any([
		checkCoursesFor(courses, {dept:'CSCI', num:273}),
		checkCoursesFor(courses, {dept:'CSCI', num:284}),
		parallelDistributedComputing
	])

	let requirements = [
		{
			title: 'Algorithms',
			result: algorithms,
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
		description: 'Computer Science 253; Computer Science 263; either Computer Science 276 or 333; and either Computer Science 273, 284, or 300 with parallel and distributed computing.',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	var validCourses = _.chain(courses)
		.filter(hasDepartment('CSCI'))
		.reject(isRequiredCompSciCourse)
		.value()

	var numberTaken = _.size(validCourses)
	var numberNeeded = 2

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
	var hasTakenCapstone = checkCoursesFor(courses, {dept:'CSCI', num:390})

	return {
		title: 'Capstone',
		type: 'boolean',
		description: 'Capstone',
		result: hasTakenCapstone
	}
}

function checkComputerScienceMajor(student) {
	var computerScienceMajorRequirements = [
		foundationCourses(student.courses),
		coreCourses(student.courses),
		electiveCourses(student.courses),
		capstoneCourse(student.courses),
	]

	return {
		result: _.all(computerScienceMajorRequirements, 'result'),
		details: computerScienceMajorRequirements,
	}
}

export default checkComputerScienceMajor
