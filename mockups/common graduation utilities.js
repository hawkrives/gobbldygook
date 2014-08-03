var _ = require('lodash')
var Promise = require('bluebird')

var countCredits = require('../client/helpers/countCredits')
var hasDepartment = require('../client/helpers/hasDepartment')

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
module.exports.onlyFullCreditCourses = onlyFullCreditCourses
module.exports.onlyInterimCourses = onlyInterimCourses
module.exports.onlyFullCreditInterimCourses = onlyFullCreditInterimCourses
module.exports.onlySummerSessionCourses = onlySummerSessionCourses
module.exports.onlyFullCreditSummerSessionCourses = onlyFullCreditSummerSessionCourses

module.exports.creditsBeyondTheArea = creditsBeyondTheArea

module.exports.isBachelorOfMusic = isBachelorOfMusic
module.exports.isBachelorOfArts = isBachelorOfArts
module.exports.isBachelorOfBoth = isBachelorOfBoth

module.exports.checkStudentStudiesFor = checkStudentStudiesFor
module.exports.checkStudentDegreesFor = checkStudentDegreesFor
module.exports.isMajoringIn = isMajoringIn
module.exports.isConcentrationgOn = isConcentrationgOn

module.exports.isBachelorOfMusic = isBachelorOfMusic
module.exports.isBachelorOfArts = isBachelorOfArts
module.exports.isBachelorOfBoth = isBachelorOfBoth
