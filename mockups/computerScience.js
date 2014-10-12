'use strict';

let _ = require('lodash')
let Promise = require('bluebird')

let hasDepartment = require('../app/helpers/hasDepartment')
let partialTitle = require('../app/helpers/partialTitle').partialTitle
let checkCoursesForDeptNum = require('../app/helpers/getCourses').checkCoursesForDeptNum

let utilities = require('./commonMajorUtilities')

const csDeptRequiredCourses = [
	{deptnum: 'CSCI 121'}, {deptnum: 'CSCI 125'}, {deptnum: 'CSCI 241'}, {deptnum: 'CSCI 251'},
	{deptnum: 'CSCI 252'}, {deptnum: 'CSCI 231'}, {deptnum: 'CSCI 253'}, {deptnum: 'CSCI 263'},
	{deptnum: 'CSCI 276'}, {deptnum: 'CSCI 333'}, {deptnum: 'CSCI 273'}, {deptnum: 'CSCI 284'},
	{deptnum: 'CSCI 390'},

	{deptnum: 'CSCI 300', name: 'Parallel'},

	{deptnum: 'MATH 232'}, {deptnum: 'MATH 252'},
]

let isRequiredCompSciCourse = _.curry(utilities.isRequiredCourse(csDeptRequiredCourses))

function foundationCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	var cs1 = Promise.any([
		checkCoursesForDeptNum(courses, 'CSCI 121'),
		checkCoursesForDeptNum(courses, 'CSCI 125'),
	])

	var design = Promise.all([
		checkCoursesForDeptNum(courses, 'CSCI 241'),
		checkCoursesForDeptNum(courses, 'CSCI 251'),
		checkCoursesForDeptNum(courses, 'CSCI 252'),
	])

	var mfc = Promise.any([
		checkCoursesForDeptNum(courses, 'CSCI 231'),
		checkCoursesForDeptNum(courses, 'MATH 232'),
		checkCoursesForDeptNum(courses, 'MATH 252'),
	])

	return Promise.all([
		Promise.props({
			title: 'CS1',
			result: cs1,
		}),
		Promise.props({
			title: 'Design',
			result: design.then(_.all),
		}),
		Promise.props({
			title: 'MFC',
			result: mfc,
		}),
	]).then(function(requirements) {
		return {
			title: 'Foundation',
			description: 'one of Computer Science 121 or 125; Computer Science 241, 251, and 252; one of Computer Science 231 or Math 232 or Math 252.',
			result: _.all(requirements),
			type: 'array/boolean',
			details: requirements,
		}
	})
}

function coreCourses(courses) {
	/* Core courses:
		- Computer Science 253;
		- Computer Science 263;
		- either of Computer Science 276 or 333;
		- and either Computer Science 273, 284, or 300 with parallel and distributed computing.
	*/

	var algorithms = checkCoursesForDeptNum(courses, 'CSCI 253')

	var ethics = checkCoursesForDeptNum(courses, 'CSCI 263')

	var theory = Promise.any([
		checkCoursesForDeptNum(courses, 'CSCI 276'),
		checkCoursesForDeptNum(courses, 'CSCI 333')
	])

	var parallelDistributedComputing = _.chain(courses)
		.filter(hasDepartment('CSCI'))
		.filter({num: 300})
		.filter(partialTitle('Parallel'))
		.size().value() >= 1

	var options = Promise.any([
		checkCoursesForDeptNum(courses, 'CSCI 273'),
		checkCoursesForDeptNum(courses, 'CSCI 284'),
		Promise.resolve(parallelDistributedComputing)
	])

	return Promise.all([
		Promise.props({
			title: 'Algorithms',
			result: algorithms,
		}),
		Promise.props({
			title: 'Ethics',
			result: ethics,
		}),
		Promise.props({
			title: 'Theory',
			result: theory,
		}),
		Promise.props({
			title: 'Options',
			result: options
		}),
	]).then(function(requirements) {
		return {
			title: 'Core',
			type: 'array/boolean',
			description: 'Computer Science 253; Computer Science 263; either Computer Science 276 or 333; and either Computer Science 273, 284, or 300 with parallel and distributed computing.',
			result: _.all(requirements),
			details: requirements,
		}
	})
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	var validCourses = _.chain(courses)
		.filter(hasDepartment('CSCI'))
		.reject(isRequiredCompSciCourse)
		.value()

	var numberTaken = _.size(validCourses)
	var numberNeeded = 2

	return Promise.resolve({
		title: 'Electives',
		type: 'object/number',
		description: 'Two approved electives.',
		result: numberTaken >= numberNeeded,
		details: {
			has: numberTaken,
			needs: numberNeeded,
			matches: validCourses,
		}
	})
}

function capstoneCourse(courses) {
	// Capstone: Computer Science 390
	var hasTakenCapstone = checkCoursesForDeptNum(courses, 'CSCI 390')
	return hasTakenCapstone.then(function(result) {
		return {
			title: 'Capstone',
			type: 'boolean',
			description: 'Capstone',
			result: result
		}
	})
}

function checkComputerScienceMajor(student) {
	var computerScienceMajorRequirements = Promise.all([
		foundationCourses(student.courses),
		coreCourses(student.courses),
		electiveCourses(student.courses),
		capstoneCourse(student.courses),
	]).then(function(results) {
		// console.log('checkComputerScienceMajor', 'results', results)
		return results
	})

	return Promise.props({
		result: computerScienceMajorRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: computerScienceMajorRequirements
	})
}

module.exports = checkComputerScienceMajor
