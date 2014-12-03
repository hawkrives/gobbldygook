'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment.es6'
import {checkCoursesFor} from '../app/helpers/courses.es6'

import {isRequiredCourse} from './commonMajorUtilities.es6'

const physDeptRequiredCourses = [
	{deptnum:'PHYS 130'},
	{deptnum:'PHYS 131'},
	{deptnum:'PHYS 232'},
	{deptnum:'PHYS 244'},
	{deptnum:'PHYS 245'},
	{deptnum:'PHYS 374'},
	{deptnum:'PHYS 375'},
	{deptnum:'PHYS 385'},
	{deptnum:'PHYS 376'},
	{deptnum:'PHYS 386'},
]

let isRequiredPhysicsCourse = _.curry(isRequiredCourse(physDeptRequiredCourses))

function analyticsCourses(courses) {
	var requirements = [
		{title: 'PHYS 130', result: checkCoursesFor(courses, {deptnum:'PHYS 130'})},
		{title: 'PHYS 131', result: checkCoursesFor(courses, {deptnum:'PHYS 131'})},
		{title: 'PHYS 232', result: checkCoursesFor(courses, {deptnum:'PHYS 232'})},
	]

	return {
		title: 'Analytics',
		description: 'Physics 130, 131, 232',
		type: 'array/boolean',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function transitionsCourses(courses) {
	var requirements = [
		{title: 'PHYS 244', result: checkCoursesFor(courses, {deptnum:'PHYS 244'})},
		{title: 'PHYS 245', result: checkCoursesFor(courses, {deptnum:'PHYS 245'})},
	]

	return {
		title: 'Transitions',
		description: 'Physics 244 and 245',
		type: 'array/boolean',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function upperLevelCourses(courses) {
	var requirements = [
		{title: 'PHYS 374', result: checkCoursesFor(courses, {deptnum: 'PHYS 374'})},
		{title: 'PHYS 375', result: checkCoursesFor(courses, {deptnum: 'PHYS 375'})},
		{title: 'PHYS 385', result: checkCoursesFor(courses, {deptnum: 'PHYS 385'})},
		{title: 'PHYS 376', result: checkCoursesFor(courses, {deptnum: 'PHYS 376'})},
		{title: 'PHYS 386', result: checkCoursesFor(courses, {deptnum: 'PHYS 386'})},
	]

	return {
		title: 'Upper Level',
		description: 'Physics 374, 375 and 385, 376 and 386',
		type: 'array/boolean',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	var validCourses = _.chain(courses)
		.filter(hasDepartment('PHYS'))
		.reject(isRequiredPhysicsCourse)
		.value()

	var numberTaken = _.size(validCourses)
	var numberNeeded = 1

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

function checkPhysicsMajor(student) {
	return Promise.all([
		student.courses
	]).then((studentPieces) => {
		let [courses] = studentPieces

		var physicsMajorRequirements = [
			analyticsCourses(courses),
			transitionsCourses(courses),
			upperLevelCourses(courses),
			electiveCourses(courses),
		]

		return {
			result: _.all(physicsMajorRequirements, 'result'),
			details: physicsMajorRequirements,
		}
	})
}

export default checkPhysicsMajor
