var _ = require('lodash')
var add = require('./add')
var count = require('./count')

function courses(creditsTaken, creditsNeeded) {
	// Students must take the equivalent of 35 St. Olaf credits through a
	// combination of full-credit and fractional-credit courses.

	// Note: For numerical purposes, the term "course" means a full (1.00)
	// course credit, as distinguished from fractional course credits, unless
	// otherwise noted.

	return creditsTaken >= creditsNeeded
}

function ensureNoOffCampusCoursesDuringFinalYear(student) {
	var finalYear = _.max(student.fabrications, 'year')
	var finalYearFabrications = _.filter(student.fabrications, {year: finalYear})
	var finalYearCourses = _.filter(student.courses, {year: finalYear})
	return (
		_.isEmpty(finalYearFabrications) || 
		_.reduce(finalYearFabrications, 'credits') <= 3
	)
}

function residency(student) {
	// Seventeen of the 35 St. Olaf credits required for graduation must be
	// taken through St. Olaf College. This may include St. Olaf-sponsored
	// off-campus programs.

	// The senior residency requirement consists of registration through St.
	// Olaf either (a) during the last two semesters and Interim preceding the
	// conferring of the degree or (b) for at least nine of the last 12 full-
	// course credits. For instance, seniors may spend one of their last terms
	// at another institution only if a maximum of three credits are applied
	// to the St. Olaf degree. A senior may spend the final semester on a St.
	// Olaf-sponsored off-campus program. See, however, PARTICIPATION IN
	// COMMENCEMENT.

	// `fabrications` is a list of courses that the student has manually
	// entered, and which did not come from the course catalog. I'm using it
	// as a list of off-campus courses.

	return (
		_.size(student.courses) - _.size(student.fabrications) >= 17 &&
		ensureNoOffCampusCoursesDuringFinalYear(student)
	)
}

function interim(schedules) {

}

function gpa(schedules) {

}

function courseLevel(schedules) {

}

function gradedCourses(schedules) {

}

function major(studies, schedules) {

}

function beyondTheMajor(studies, schedules) {

}

function artsAndMusicMajor(studies, schedules) {

}

module.exports = function(student) {
	// Requirements taken from 
	// http://www.stolaf.edu/catalog/1314/academiclife/ba-gen-grad-requirements.html

	var creditsTaken = _.reduce(_.pluck(student.courses, 'credits'), add)

	return (
		courses(creditsTaken, student.creditsNeeded) &&
		residency(student) &&
		interim(student.schedules) &&
		gpa(student.schedules) &&
		courseLevel(student.schedules) &&
		gradedCourses(student.schedules) &&
		major(student.studies, student.schedules) &&
		beyondTheMajor(student.studies, student.schedules) &&
		artsAndMusicMajor(student.studies, student.schedules)
	)
}
