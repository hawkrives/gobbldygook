'use strict';

var _ = require('lodash')

var hasDeptNumBetween = require('../app/helpers/deptNum').hasDeptNumBetween
var countCredits = require('../app/helpers/countCredits')
var onlyCoursesAtOrAboveLevel = require('../app/helpers/courseLevels').onlyCoursesAtOrAboveLevel
var utilities = require('./common graduation utilities')

function courses(coursesTaken, creditsNeeded) {
	// Students must take the equivalent of 35 St. Olaf credits through a
	// combination of full-credit and fractional-credit courses.

	// Note: For numerical purposes, the term "course" means a full (1.00)
	// course credit, as distinguished from fractional course credits, unless
	// otherwise noted.

	// "An intercollegiate SPM (.25) credit cannot be used as an elective for
	// the purpose of earning a credit toward the 35 full-credit course
	// requirement for graduation." (from the SPM requirement)

	// The intercollegiate SPM credits are determined by courses Exercise
	// Science 171-194. (from the SPM requirement)

	var noIntercollegiateSports = _.reject(
		coursesTaken,
		hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194})
	)

	var creditsTaken = countCredits(noIntercollegiateSports, 'credits')

	return {
		title: 'Courses',
		type: 'boolean',
		result: creditsTaken >= creditsNeeded
	}
}

function ensureLimitedOffCampusCoursesDuringFinalYear(courses, fabrications) {
	// Used by the residency checker to ensure that only the allowed amount of
	// off-campus courses are taken during the final year

	var finalYear = _.max(fabrications, 'year')
	var finalYearFabrications = _.filter(fabrications, {year: finalYear})
	var finalYearCourses = _.filter(courses, {year: finalYear})

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

	var residencyReq = (
		_.size(courses) - _.size(fabrications) >= 17 &&
		ensureLimitedOffCampusCoursesDuringFinalYear(courses, fabrications)
	)

	return {
		title: 'Residency',
		type: 'boolean',
		result: residencyReq
	}
}

function interim(courses, fabrications) {
	// At least three of the required 35 St. Olaf credits must be earned in
	// three separate January full-credit (1.0) Interims. An Interim may be
	// taken on campus, through a St. Olaf off-campus Interim program, or
	// through an approved Interim exchange with another 4-1-4 college.
	// Transfer students admitted with at least sophomore standing must
	// complete two Interims. After having successfully completed two
	// Interims, senior participators may satisfy the third Interim
	// requirement by means of a summer course taken during a St. Olaf summer
	// session after the commencement in which the student participates.

	var interimCourses = _.filter(courses, utilities.onlyFullCreditInterimCourses)
	var interimCourseCount = _.size(interimCourses)

	// "After having successfully completed two Interims, senior participators
	// may satisfy the third Interim requirement by means of a summer course
	// taken during a St. Olaf summer session after the commencement in which
	// the student participates."
	var years = _.uniq(_.pluck(fabrications, 'year'))
	var finalYear = _.max(years)

	var summerSessionCourses = _.filter(courses, utilities.onlyFullCreditSummerSessionCourses)
	var finalSummerSessionCourses = _.filter(summerSessionCourses, {year: finalYear})
	var finalSummerSessionCourseCount = _.size(finalSummerSessionCourses)

	var interimRequirement = (
		interimCourseCount >= 3 ||
		(interimCourseCount >= 2 && finalSummerSessionCourseCount >= 1)
	)

	return {
		title: 'Interim',
		type: 'boolean',
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
		type: 'boolean',
		result: true
	}
}

function courseLevel(courses) {
	// Satisfactory completion of 18 credits above level I, courses numbered
	// 200 and higher.

	return {
		title: 'Course Level',
		type: 'boolean',
		result: _.size(onlyCoursesAtOrAboveLevel(200, courses)) >= 18
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
		type: 'boolean',
		result: _.size(courses) - _.size(fabrications) >= 24
	}
}

function finalTwoYearsInResidence(courses, fabrications) {
	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."

	// I'm solving this by assuming that off-campus courses will be manually
	// entered, so they'll be in fabrications. Therefore, if there aren't any
	// fabrications in the last two years, it passes.

	var years = _.uniq(_.pluck(courses, 'year'))

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

	var fullCreditCourses = _.filter(courses, utilities.onlyFullCreditCourses)

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

	var baseResult = {
		title: 'Arts and Music',
		type: 'boolean',
		prose: '',
	}

	var degrees = _.filter(studies, {type: 'degree'})
	if (_.size(degrees) === 1) {
		// there's only one degree, so we don't care.
		return _.merge(baseResult, {result: true})
	}

	var majors = _.filter(studies, {type: 'major'})
	if (utilities.isBachelorOfBoth(studies) && utilities.isMajoringIn('Music', studies)) {
		// there's a double-ba/bm trying to major in Music -- no.
		return _.merge(baseResult, {result: false})
	}

	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."
	if (!finalTwoYearsInResidence(courses, fabrications)) {
		return _.merge(baseResult, {result: false})
	}

	// "17 of the last 20 full-course credits must be earned through St. Olaf."
	if (!seventeenOlafCourses(courses)) {
		return _.merge(baseResult, {result: false})
	}

	return _.merge(baseResult, {result: true})
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
