var _ = require('lodash')
var Promise = require('bluebird')

var add = require('../client/helpers/add')

var countCredits = require('../client/helpers/countCredits')
var hasDepartment = require('../client/helpers/hasDepartment')

var coursesAtLevel = require('../client/helpers/courseLevels').coursesAtLevel
var coursesAtOrAboveLevel = require('../client/helpers/courseLevels').coursesAtOrAboveLevel

function courses(coursesTaken, creditsNeeded) {
	// Students must take the equivalent of 35 St. Olaf credits through a
	// combination of full-credit and fractional-credit courses.

	// Note: For numerical purposes, the term "course" means a full (1.00)
	// course credit, as distinguished from fractional course credits, unless
	// otherwise noted.

	var creditsTaken = countCredits(coursesTaken, 'credits')

	return {
		title: 'Courses',
		result: creditsTaken >= creditsNeeded
	}
}

function ensureLimitedOffCampusCoursesDuringFinalYear(courses, fabrications) {
	// Used by the residency checker to ensure that only the allowed amount of
	// off-campus courses are taken during the final year

	var finalYear = _.max(student.fabrications, 'year')
	var finalYearFabrications = _.filter(student.fabrications, {year: finalYear})
	var finalYearCourses = _.filter(student.courses, {year: finalYear})

	return (
		_.isEmpty(finalYearFabrications) ||
		countCredits(finalYearFabrications) <= 3
	)
}

function residency(courses, fabrications) {
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

	var residency = (
		_.size(courses) - _.size(fabrications) >= 17 &&
		ensureLimitedOffCampusCoursesDuringFinalYear(courses, fabrications)
	)

	return {
		title: 'Residency',
		result: residency
	}
}

function onlyFullCreditCourses(course) {
	return course.credits >= 1.0
}

function onlyFullCreditInterimCourses(course) {
	return (course.semester === 2 && onlyFullCreditCourses(course))
}

function onlySummerSessionCourses(course) {
	return course.semester === 4 || course.semester === 5
}

function onlyFullCreditSummerSessionCourses(course) {
	return (onlySummerSessionCourses(course) && onlyFullCreditCourses(course))
}

function interim(courses) {
	// At least three of the required 35 St. Olaf credits must be earned in
	// three separate January full-credit (1.0) Interims. An Interim may be
	// taken on campus, through a St. Olaf off-campus Interim program, or
	// through an approved Interim exchange with another 4-1-4 college.
	// Transfer students admitted with at least sophomore standing must
	// complete two Interims. After having successfully completed two
	// Interims, senior participators may satisfy the third Interim
	// requirement by means of a summer course taken during a St. Olaf summer
	// session after the commencement in which the student participates.

	var interimCourses = _.filter(courses, onlyFullCreditInterimCourses)
	var interimCourseCount = _.size(interimCourses)

	// "After having successfully completed two Interims, senior participators
	// may satisfy the third Interim requirement by means of a summer course
	// taken during a St. Olaf summer session after the commencement in which
	// the student participates."
	var years = _.uniq(_.pluck(student.fabrications, 'year'))
	var finalYear = _.max(years)

	var summerSessionCourses = _.filter(courses, onlyFullCreditSummerSessionCourses)
	var finalSummerSessionCourses = _.filter(summerSessionCourses, {year: finalYear})
	var finalSummerSessionCourseCount = _.size(finalSummerSessionCourses)

	var interimRequirement = (
		interimCourseCount >= 3 ||
		(interimCourseCount >= 2 && finalSummerSessionCourseCount >= 1)
	)

	return {
		title: 'Interim',
		result: interimRequirement
	}
}

function gpa(courses) {
	// An average grade of C (2.00 on a 4.00 system) for all courses taken for
	// the usual letter grades. See GRADE POINT AVERAGE for details.

	// NOTE: Currently, we don't store grades for courses, so we'll just
	// assume the best.

	return {
		title: 'GPA',
		result: true
	}
}

function onlyTwoHundredLevelCourses(courses) {
	return _.filter(courses, coursesAtOrAboveLevel(200))
}

function courseLevel(courses) {
	// Satisfactory completion of 18 credits above level I, courses numbered
	// 200 and higher.

	return {
		title: 'Course Level',
		result: _.size(onlyTwoHundredLevelCourses(courses)) >= 18
	}
}

function gradedCourses(courses, fabrications) {
	// A minimum of 24 credits out of 35 must be taken graded through courses
	// taken from a St. Olaf professor.

	// A sliding scale is used if not all work is taken at St. Olaf or if
	// credit is earned through special programs such as Advanced Placement.
	// Sophomore transfer students need a minimum of 18 graded credits and
	// junior transfer students a minimum of 13 graded credits. Details are
	// available from the registrar.

	// All students should be aware of the restrictions on S/U and P/N grades.

	// Students studying on St. Olaf off-campus programs should refer to
	// GRADED AND UNGRADED COURSES in the Academic Regulations section of this
	// catalog for details about how this graduation requirement is affected
	// by off-campus programs.

	// From the [S/U] section: [quote]
	// The intent of the S/U option is to allow students to explore areas in
	// which they have an interest, without the grade counting in their grade
	// point average.

	// All graded courses are open to the S/U option as distinguished from P/N
	// (pass/no pass) courses where the ungraded option is mandatory. Neither
	// an S nor a U figure into the grade point average. An S is awarded for a
	// grade of C- or higher; a U is assigned for any grade of D+ or lower. A
	// student earning a grade of D+ to F in a course taken S/U receives a U,
	// which carries no course credit. A U cannot be assigned another type of
	// grade at a later date.

	// Students should exercise caution in choosing to take courses on an S/U
	// basis. Some graduate schools, for example, assume that a grade of S
	// replaces a C or C-.
	// [/quote]

	// NOTE: Because we don't store grades, we canot verify them. Same goes
	// for S/U courses.

	return {
		title: 'Graded Courses',
		result: _.size(courses) - _.size(fabrications) >= 24
	}
}

var creditsBeyondTheArea = _.curry(function(courses, creditCount, area) {
	// Takes the courses *outside* of the major department, and counts them.
	var deptAbbr = area.dept

	// Leave only those outside of the department code
	var matchingCourses = _.reject(courses, hasDepartment(deptAbbr))

	// Grab the number of credits taken
	var matchingCourseCredits = common.countCredits(matchingCourses)

	// See if there are more than the required number.
	return (matchingCourseCredits >= creditCount)
})

function finalTwoYearsInResidence(fabrications) {
	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."

	var years = _.uniq(_.pluck(fabrications, 'year'))

	if (_.size(years) >= 2) {
		var sortedYears = _.sortBy(years).reverse()
		var finalYear = years[0]
		var secondFinalYear = years[1]
		var finalYearFabrications = _.filter(fabrications, {year: finalYear})
		var secondFinalYearFabrications = _.filter(fabrications, {year: finalYear})

		var hasFabricationsInFinalYears = _.every([
			_.isEmpty(finalYearFabrications),
			_.isEmpty(secondFinalYearFabrications)
		])

		if (hasFabricationsInFinalYears) {
			return false
		}

		return true
	}

	return false
}

function seventeenOlafCourses(courses) {
	// "17 of the last 20 full-course credits must be earned through St. Olaf."
	if (_.size(courses) < 20) {
		return false
	}

	var fullCreditCourses = _.filter(courses, onlyFullCreditCourses)

	// Put the most recent courses at the front
	var sortedFullCreditCourses = _.sortBy(fullCreditCourses, 'term').reverse()

	// Get just the most recent 20 courses
	var lastTwentyFullCreditCourses = _.first(sortedFullCreditCourses, 20)

	// Reject all of the fabricated courses
	var notFabricatedFullCreditCourses = _.reject(
		lastTwentyFullCreditCourses, {alteration: 'fabricated'}
	)

	if (_.size(notFabricatedFullCreditCourses) < 17) {
		return false
	}

	return true
}

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

function artsAndMusicDoubleMajor(courses, studies, fabrications) {
	// 	Students must meet the application requirements for both the Bachelor
	// 	of Arts and Bachelor of Music degree programs.

	// [...]

	// Students pursuing the double-degree option may choose any of the five
	// Bachelor of Music graduation majors (Church Music, Elective Studies, Music
	// Education, Performance, and Theory/Composition) and any of the Bachelor of
	// Arts graduation majors except Music.

	// Students shall meet the requirements for the B.A. graduation major and B.M.
	// graduation major, as well as the general education requirements and general
	// graduation requirements for the two degrees. The final two years of
	// coursework in pursuit of the degrees must be spent in residence. 17 of the
	// last 20 full-course credits must be earned through St. Olaf. Some students
	// may require up to 43 total credits in order to complete all requirements
	// for both degrees.

	// [...]

	// A double-degree student may elect to graduate in two different semesters,
	// one with each degree, but must meet all requirements for the degree and the
	// graduation major within that degree before the diploma for that degree will
	// be awarded.

	var title = 'Arts and Music'

	var degrees = _.filter(studies, {type: 'degree'})
	if (_.size(degrees) === 1) {
		// there's only one degree, so we don't care.
		return {title: title, result: true}
	}

	var majors = _.filter(studies, {type: 'major'})
	if (isBachelorOfBoth(studies) && _.find(majors, {abbr: 'MUSIC'})) {
		// there's a double-ba-bm trying to major in Music -- no.
		return {title: title, result: false}
	}

	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."
	if (!finalTwoYearsInResidence(fabrications)) {
		return {title: title, result: false}
	}

	// "17 of the last 20 full-course credits must be earned through St. Olaf."
	if (!seventeenOlafCourses(courses)) {
		return {title: title, result: false}
	}

	return {title: title, result: true}
}

// Requirements
module.exports.courses = courses
module.exports.ensureLimitedOffCampusCoursesDuringFinalYear = ensureLimitedOffCampusCoursesDuringFinalYear
module.exports.residency = residency
module.exports.interim = interim
module.exports.gpa = gpa
module.exports.courseLevel = courseLevel
module.exports.gradedCourses = gradedCourses
module.exports.artsAndMusicDoubleMajor = artsAndMusicDoubleMajor

// Helpers
module.exports.onlyFullCreditCourses = onlyFullCreditCourses
module.exports.creditsBeyondTheArea = creditsBeyondTheArea

module.exports.isBachelorOfMusic = isBachelorOfMusic
module.exports.isBachelorOfArts = isBachelorOfArts
module.exports.isBachelorOfBoth = isBachelorOfBoth

module.exports.checkStudentStudiesFor = checkStudentStudiesFor
module.exports.checkStudentDegreesFor = checkStudentDegreesFor
module.exports.isMajoringIn = isMajoringIn
module.exports.isConcentrationgOn = isConcentrationgOn
