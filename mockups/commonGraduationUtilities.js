'use strict';

import * as _ from 'lodash'

import countCredits from '../app/helpers/countCredits'
import hasDepartment from '../app/helpers/hasDepartment'

function onlyFullCreditCourses(course) {
	return course.credits >= 1.0
}

function onlyInterimCourses(course) {
	return course.semester === 2
}

function onlyFullCreditInterimCourses(course) {
	return (onlyInterimCourses(course) && onlyFullCreditCourses(course))
}

function onlySummerSessionCourses(course) {
	return (course.semester === 4 || course.semester === 5)
}

function onlyFullCreditSummerSessionCourses(course) {
	return (onlySummerSessionCourses(course) && onlyFullCreditCourses(course))
}

var creditsBeyondTheArea = _.curry(function(courses, creditCount, area) {
	// Takes the courses *outside* of the major department, and counts them.
	var deptAbbr = area.dept

	// Leave only those outside of the department code
	var matchingCourses = _.reject(courses, hasDepartment(deptAbbr))

	// Grab the number of credits taken
	var matchingCourseCredits = countCredits(matchingCourses)

	// See if there are more than the required number.
	return (matchingCourseCredits >= creditCount)
})

function checkStudentStudiesFor(desiredType, desiredAbbr, studies) {
	// Filter down to just the type of study (degree, major, concentration)
	var typeMatches = _.filter(studies, {type: desiredType})
	// then check for any matches of the abbreviation.
	return _.any(typeMatches, {abbr: desiredAbbr})
}

function checkStudentDegreesFor(desiredDegreeAbbreviation, studies) {
	return checkStudentStudiesFor('degree', desiredDegreeAbbreviation, studies)
}

function isMajoringIn(desiredMajorAbbr, studies) {
	return checkStudentStudiesFor('major', desiredMajorAbbr, studies)
}

function isConcentrationgOn(desiredConcentrationAbbr, studies) {
	return checkStudentStudiesFor('concentration', desiredConcentrationAbbr, studies)
}

function isBachelorOfMusic(studies) {
	return checkStudentDegreesFor('B.M.', studies)
}

function isBachelorOfArts(studies) {
	return checkStudentDegreesFor('B.A.', studies)
}

function isBachelorOfBoth(studies) {
	return _.all([isBachelorOfMusic(studies), isBachelorOfArts(studies)])
}

// Helpers
export {
	onlyFullCreditCourses,
	onlyInterimCourses,
	onlyFullCreditInterimCourses,
	onlySummerSessionCourses,
	onlyFullCreditSummerSessionCourses,

	creditsBeyondTheArea,

	isBachelorOfMusic,
	isBachelorOfArts,
	isBachelorOfBoth,

	checkStudentStudiesFor,
	checkStudentDegreesFor,
	isMajoringIn,
	isConcentrationgOn,

	isBachelorOfMusic,
	isBachelorOfArts,
	isBachelorOfBoth
}
