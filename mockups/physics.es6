'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment'
import {partialNameOrTitle} from '../app/helpers/partialTitle'
import {checkCoursesFor} from '../app/helpers/getCourses'

import {isRequiredCourse} from './commonMajorUtilities'

const physDeptRequiredCourses = [
	{deptnum:'PHYS 130'},
	{deptnum:'PHYS 131'},
	{deptnum:'PHYS 232'},
	{deptnum:'PHYS 244'},
	{deptnum:'PHYS 245'},
	{deptnum:'PHYS 374'},
	{deptnum:'PHYS 375'},
	{deptnum:'PHYS 385'},
	{deptnum:'PHYS 386'},
	{deptnum:'PHYS 376'},
	{deptnum:'PHYS 286'},
]

let isRequiredPhysicsCourse = _.curry(isRequiredCourse(physDeptRequiredCourses))

function analyticsCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	var requirements = [
		{
			title: 'Intro',
			result: _.all([
				checkCoursesFor(courses, {dept:'PHYS', num:130}),
				checkCoursesFor(courses, {dept:'PHYS', num:131}),
				checkCoursesFor(courses, {dept:'PHYS', num:232}),
			])
		},
		{
			title: 'Transitions',
			result: _.all([
				checkCoursesFor(courses, {dept:'PHYS', num:244}),
				checkCoursesFor(courses, {dept:'PHYS', num:245}),
			])
		},
		{
			title: 'Upper Level',
			result: _.all([
				checkCoursesFor(courses, {dept:'PHYS', num:374}),
				checkCoursesFor(courses, {dept:'PHYS', num:375}),
				checkCoursesFor(courses, {dept:'PHYS', num:385}),
				checkCoursesFor(courses, {dept:'PHYS', num:376}),
				checkCoursesFor(courses, {dept:'PHYS', num:286}),
			])
		}
	]

	return {
		title: 'Requirements',
		description: 'Physics 130, 131, 232, 244 and 245, 374, 375 and 385, 376 and 386',
		type: 'array/boolean',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

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
	var physicsMajorRequirements = [
		analyticsCourses(student.courses),
		electiveCourses(student.courses),
	]

	return {
		result: _.all(physicsMajorRequirements, 'result'),
		details: physicsMajorRequirements,
	}
}

export default checkPhysicsMajor
