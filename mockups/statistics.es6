'use strict';

import * as _ from 'lodash'

import hasDepartment from '../app/helpers/hasDepartment'
import {partialNameOrTitle} from '../app/helpers/partialTitle'
import {checkCoursesFor} from '../app/helpers/courses'

function foundationCourses(courses) {
	/* Foundation courses:
		- one of Computer Science 121 or 125;
		- Computer Science 241, 251, and 252;
		- one of Computer Science 231 or Math 232 or Math 252.
	*/

	var requirements = [
		{title: 'STAT 110', result: checkCoursesFor(courses, {dept:'STAT', num:110})},
		{title: 'STAT 212', result: checkCoursesFor(courses, {dept:'STAT', num:212})},
		{title: 'STAT 214', result: checkCoursesFor(courses, {dept:'STAT', num:214})},
		{title: 'STAT 263', result: checkCoursesFor(courses, {dept:'STAT', num:263})},
	]

	return {
		title: 'Foundation',
		description: 'These are recommended courses for the concentration.',
		result: true,
		type: 'array/some',
		details: {
			from: requirements,
			has: _.chain(requirements).pluck('result').compact().size().value(),
			needs: 'any number',
		},
	}
}

function coreCourses(courses) {
	/* The Two (2) Core Courses:
		- Statistics 272: Statistical Modeling
		- Statistics 316: Advanced Statistical Modeling
	*/

	var statisticalModeling = checkCoursesFor(courses, {dept:'STAT', num:272})
	var advancedModeling = checkCoursesFor(courses, {dept:'STAT', num:316})

	let requirements = [
		{
			title: 'Statistical Modeling',
			result: statisticalModeling,
		},
		{
			title: 'Advanced Modeling',
			result: advancedModeling,
		},
	]

	return {
		title: 'Core',
		type: 'array/boolean',
		description: 'Statistics 272: Statistical Modeling, and Statistics 316: Advanced Statistical Modeling',
		result: _.all(requirements, 'result'),
		details: requirements,
	}
}

function electiveCourses(courses) {
	// Electives: Two approved electives.

	var validElectives = [
		{title: 'CSCI 125', result: checkCoursesFor(courses, {dept:'CSCI', num:125})},
		{title: 'ECON 385', result: checkCoursesFor(courses, {dept:'ECON', num:385})},
		{title: 'MATH 262', result: checkCoursesFor(courses, {dept:'MATH', num:262})},
		{title: 'PSYCH 230', result: checkCoursesFor(courses, {dept:'PSYCH', num:230})},
		{title: 'SOAN 371', result: checkCoursesFor(courses, {dept:'SOAN', num:371})},
		{title: 'STAT 270', result: checkCoursesFor(courses, {dept:'STAT', num:270})},
		{title: 'STAT 282', result: checkCoursesFor(courses, {dept:'STAT', num:282})},
		{title: 'STAT 322', result: checkCoursesFor(courses, {dept:'STAT', num:322})},
	]

	var numberTaken = _.chain(validElectives)
		.pluck('result').compact().size().value()
	var numberNeeded = 2

	return {
		title: 'Electives',
		type: 'array/some',
		description: 'Two electives.',
		result: numberTaken >= numberNeeded,
		details: {
			needs: numberNeeded,
			has: numberTaken,
			from: validElectives,
		}
	}
}

function checkStatisticsConcentration(student) {
	var statisticsConcentrationRequirements = [
		foundationCourses(student.courses),
		coreCourses(student.courses),
		electiveCourses(student.courses),
	]

	return {
		result: _.all(statisticsConcentrationRequirements, 'result'),
		details: statisticsConcentrationRequirements,
	}
}

export default checkStatisticsConcentration
