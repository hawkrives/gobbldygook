var _ = require('lodash')
var Promise = require('bluebird')

var hasDepartment = require('../client/helpers/hasDepartment')
var partialTitle = require('../client/helpers/partialTitle')
var coursesAtLevel = require('../client/helpers/courseLevels').coursesAtLevel
var coursesAtOrAboveLevel = require('../client/helpers/courseLevels').coursesAtOrAboveLevel
var checkCoursesForDeptNum = require('../client/helpers/getCourses').checkCoursesForDeptNum

var csDeptRequiredCourses = [
	{deptnum: 'CSCI 121'}, {deptnum: 'CSCI 125'}, {deptnum: 'CSCI 241'}, {deptnum: 'CSCI 251'},
	{deptnum: 'CSCI 251'}, {deptnum: 'CSCI 231'}, {deptnum: 'CSCI 253'}, {deptnum: 'CSCI 263'},
	{deptnum: 'CSCI 276'}, {deptnum: 'CSCI 333'}, {deptnum: 'CSCI 273'}, {deptnum: 'CSCI 284'},
	{deptnum: 'CSCI 390'},

	{deptnum: 'CSCI 300', name: 'Parallel'},

	{deptnum: 'MATH 232'}, {deptnum: 'MATH 252'},
]

function isRequiredCourse(requiredCourses, course) {
	console.log(arguments)
	var match = _.filter(requiredCourses, {deptnum: course.deptnum})
	var results = [match ? true : false]

	if (match.name) {
		results.push(_.contains(course.name, match.name))
	}

	if (match.title) {
		results.push(_.contains(course.title, match.title))
	}

	return _.all(results)
}

var isRequiredCompSciCourse = _.curry(isRequiredCourse)(csDeptRequiredCourses)

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

	return Promise.props({
		cs1: cs1,
		design: design.then(_.all),
		mfc: mfc
	}).then(function(requirements) {
		return {
			result: _.all(requirements),
			details: requirements
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

	return Promise.props({
		algorithms: algorithms,
		ethics: ethics,
		theory: theory,
		options: options
	}).then(function(requirements) {
		return {
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

	return Promise.resolve({
		result: _.size(validCourses) >= 2,
		details: _.size(validCourses)
	})
}

function capstoneCourse(courses) {
	// Capstone: Computer Science 390
	return checkCoursesForDeptNum(courses, 'CSCI 390')
}

function checkComputerScienceMajor(student) {
	// Turn off cortex for any object that needs values other than `courses`.

	var computerScienceMajorRequirements = Promise.props({
		foundationResults: foundationCourses(student.courses),
		coreResults: coreCourses(student.courses),
		electivesResults: electiveCourses(student.courses),
		capstoneResults: capstoneCourse(student.courses),
	}).then(function(results) {
		console.log('checkComputerScienceMajor results', results)
		return [
			{
				title: 'Foundation',
				result: results.foundationResults.result,
				details: results.foundationResults.details,
			},
			{
				title: 'Core',
				result: results.coreResults.result,
				details: results.coreResults.details,
			},
			{
				title: 'Electives',
				result: results.electivesResults.result,
				details: results.electivesResults.details,
			},
			{
				title: 'Capstone',
				result: results.capstoneResults
			}
		]
	})

	return Promise.props({
		result: computerScienceMajorRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: computerScienceMajorRequirements
	})
}

module.exports = checkComputerScienceMajor
