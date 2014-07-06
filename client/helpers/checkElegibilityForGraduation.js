var _ = require('lodash')
var add = require('./add')
var count = require('./count')

function courses(coursesTaken, creditsNeeded) {
	// Students must take the equivalent of 35 St. Olaf credits through a
	// combination of full-credit and fractional-credit courses.

	// Note: For numerical purposes, the term "course" means a full (1.00)
	// course credit, as distinguished from fractional course credits, unless
	// otherwise noted.

	var creditsTaken = _.reduce(_.pluck(coursesTaken, 'credits'), add)

	return creditsTaken >= creditsNeeded
}

function ensureLimitedOffCampusCoursesDuringFinalYear(student) {
	// Used by the residency checker to ensure that only the allowed amount of
	// off-campus courses are taken during the final year

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
		ensureLimitedOffCampusCoursesDuringFinalYear(student)
	)
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

	return _.size(_.filter(courses, {term: 2})) >= 3
}

function gpa(student) {
	// An average grade of C (2.00 on a 4.00 system) for all courses taken for
	// the usual letter grades. See GRADE POINT AVERAGE for details.

	// NOTE: Currently, we don't store grades for courses, so we'll just
	// assume the best.

	return true
}

function onlyTwoHundredLevelCourses(courses) {
	return _.filter(courses, function(course) {
		return course.level >= 200
	})
}

function courseLevel(courses) {
	// Satisfactory completion of 18 credits above level I, courses numbered
	// 200 and higher.

	return _.size(onlyTwoHundredLevelCourses(courses)) >= 18
}

function gradedCourses(student) {
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

	return _.size(student.courses) - _.size(student.fabrications) >= 24
}

function major(studies, courses) {
	// One completed major is required for graduation. Depending on the
	// department or interdisciplinary program, the number of courses required
	// for a major ranges from eight to twelve courses, with some departments
	// requiring course work in other departments. Departments and
	// interdisciplinary programs may require comprehensive examinations or
	// special research projects. (See Majors, Concentrations, and Areas of
	// Emphasis.) Consult the department or interdisciplinary program listing
	// in this catalog for specific major requirements. Students must declare
	// one major no later than the time of registration for Interim and spring
	// semester of their junior year by filling out a form available at the
	// Office of the Registrar and Academic Advising. Students are allowed to
	// change this declaration or add a second major at a later date. Only
	// this catalog defines the specific requirements for each departmental or
	// interdisciplinary major.

	// Other regulations are:

	// Of the credits counting toward the minimum requirements for a major, a
	// total of six (6.00) must be completed with a grade of C or higher.
	// NOTE: Ignored, because we don't store grades.

	// Only one full-course equivalent (1.00-credit course) taken S/U may
	// count toward the minimum requirements for a major. Some departments
	// have more stringent regulations.
	// NOTE: Ignored, because we don't store s/u status.

	// At least 50 percent of the minimum major must be taken through St.
	// Olaf. Students should consult the registrar and the appropriate
	// department chair or program director about counting toward a major
	// courses taken at other colleges. In addition to the registrar, the
	// chair must sign the student’s transfer of credit form (available from
	// the Office of the Registrar and Academic Advising) if work from other
	// institutions is accepted in advance. Likewise, courses taken through
	// St. Olaf off-campus programs must be approved by the chair or director
	// and the off-campus program advisor in advance if credit toward a major
	// is sought.
	// NOTE: Ignored, because this doesn't know about major requirements.

	return _.size(_.filter(studies, {type: 'major'}) >= 1
}

var hasDepartment = _.curry(function(dept, course) {
	// _.curry allows the function to be called with arguments multiple times.
	return _.contains(course.depts, dept)
})

var twentyOneCreditsAndBeyond = _.curry(function(courses, major) {
	// Takes the courses *outside* of the major department, and counts them.

	// _.curry allows the function to be called with arguments multiple times.
	// also, remember: reject !== filter.
	return _.size(_.reject(courses, hasDepartment(major.abbr))) >= 21
})

function beyondTheMajor(studies, courses) {
	// While the maximum course credits counting toward a major in any one
	// department may vary, 21 total full-course credits must be completed
	// outside of the SIS "department" code of the major. The 21 total credits
	// include Education Department courses attending the major. In order for
	// a student to be certified in a second or third major, 21 credits also
	// must be taken outside of the SIS "department" code of each of those
	// majors as well. If a student has a double major, courses taken in one
	// major count toward the 21 credits outside of the other major. Credits
	// outside the major department or program include full- (1.00) credit
	// courses plus partial - (.25, .50, .75) credit courses.

	return _.every(_.filter(studies, {type: 'major'}), twentyOneCreditsAndBeyond(courses))
}

function finalTwoYearsInResidence(student) {
	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."

	var years = _.pluck(student.fabrications, 'year')

	if (_.size(years) >= 2) {
		var sortedYears = _.sortBy(years).reverse()
		var finalYear = years[0]
		var secondFinalYear = years[1]
		var finalYearFabrications = _.filter(student.fabrications, {year: finalYear})
		var secondFinalYearFabrications = _.filter(student.fabrications, {year: finalYear})

		if ( !_.every(
			[_.isEmpty(finalYearFabrications), _.isEmpty(secondFinalYearFabrications)]
		) ) {
			return false
		}

		return true
	}

	return false
}

function onlyFullCreditCourses(course) {
	return course.credits >= 1.0
}

function seventeenOlafCourses(student) {
	// "17 of the last 20 full-course credits must be earned through St. Olaf."
	if (_.size(student.courses) < 20) {
		return false
	}

	var fullCreditCourses = _.filter(student.courses, onlyFullCreditCourses)

	// Put the most recent courses at the front
	var sortedFullCreditCourses = _.sortBy(fullCreditCourses, 'term').reverse()

	// Get just the most recent 20 courses
	var lastTwentyFullCreditCourses = _.first(sortedFullCreditCourses, 20)

	// Reject all of the fabricated courses
	var notFabricatedFullCreditCourses = _.reject(lastTwentyFullCreditCourses, { alteration: 'fabricated' })

	if (_.size(notFabricatedFullCreditCourses) < 17) {
		return false
	}

	return true
}

function artsAndMusicDoubleMajor(student) {
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

	var degrees = _.filter(studies, {type: 'degree'})
	if (_.size(degrees) === 1) {
		// there's only one degree, so we don't care.
		return true
	}

	var majors = _.filter(studies, {type: 'major'})
	if (_.find(degrees, {abbr: 'B.A.'}) && _.find(majors, {abbr: 'MUSIC'})) {
		// there's a double-ba-bm trying to major in Music -- no.
		return false
	}

	// "The final two years of coursework in pursuit of the degrees must be
	// spent in residence."
	if (!finalTwoYearsInResidence(student)) {
		return false
	}

	// "17 of the last 20 full-course credits must be earned through St. Olaf."
	if (!seventeenOlafCourses(student)) {
		return false
	}

	return true
}

module.exports = function(student) {
	// Requirements taken from
	// http://www.stolaf.edu/catalog/1314/academiclife/ba-gen-grad-requirements.html
	var requirements = {
		courses: courses(student.courses, student.creditsNeeded),
		residency: residency(student),
		interim: interim(student.courses),
		gpa: gpa(student),
		courseLevel: courseLevel(student.courses),
		gradedCourses: gradedCourses(student),
		major: major(student.studies, student.courses),
		beyondTheMajor: beyondTheMajor(student.studies, student.courses),
		artsAndMusicDoubleMajor: artsAndMusicDoubleMajor(student)
	}
	return _.every(requirements)
}
