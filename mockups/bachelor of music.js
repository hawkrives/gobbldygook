var _ = require('lodash')
var Promise = require('bluebird')

var common = require('./common graduation requirements')
var utilities = require('./common graduation utilities')

function onlyMusicMajors(major) {
	return _.any([
		major.title === 'Performance',
		major.title === 'Church Music',
		major.title === 'Theory-Composition',
		major.title === 'Music Education',
		major.title === 'Elective Studies'
	])
}

function dedicatedMusicMajor(studies, courses) {
	// B.M. candidates must choose from the five majors offered. Please
	// consult the Music Department listing in this catalog for specific major
	// requirements. These constitute the final authority on degree
	// requirements.  Entrance to all B.M. majors is by audition and/or
	// application only. Once approved, students should declare their major
	// formally as soon as possible by submitting a completed declaration of
	// major form to the Music Department office. Subsequent changes are
	// allowed, but students are encouraged to keep their records current,
	// documenting any changes with re-submissions of the same form.

	// Other regulations are:

	// Of the credits counting toward the minimum requirements for a major, a
	// total of six (6.00) must be completed with a grade of C or higher.
	// NOTE: Ignored, because we don't store grades.

	// No courses explicitly required for a B.M Music major may be taken S/U.
	// NOTE: Ignored, because we don't store s/u status.

	// At least 50 percent of the minimum major must be taken through St.
	// Olaf. Students should consult the registrar and the department chair or
	// program director about counting toward a major courses taken at other
	// colleges. In addition to the registrar, the chair must sign the
	// student’s transfer of credit form (available from the Office of the
	// Registrar and Academic Advising) if work from other institutions is
	// accepted in advance. Likewise, courses taken through St. Olaf off-
	// campus programs must be approved by the chair or director and the off-
	// campus program advisor in advance if credit toward a major is sought.
	// (See TRANSFER OF CREDIT TO ST. OLAF )
	// NOTE: Ignored, because this doesn't know about major requirements.

	var majors = _.filter(studies, {type: 'major'})

	var musicMajors = _.filter(majors, onlyMusicMajors)

	return {
		title: 'Dedicated Music Major',
		result: _.size(musicMajors) >= 1 && _.every(musicMajors, utilities.creditsBeyondTheArea(courses, 8))
	}
}

function checkBachelorOfMusicDegree(student) {
	// Requirements taken from
	// http://www.stolaf.edu/catalog/1314/academiclife/bm-gen-grad-requirements.html

	var studies = student.studies
	var courses = _.filter(student.courses, utilities.onlyQuarterCreditCoursesCanBePassFail)
	var fabrications = []
	var creditsNeeded = student.creditsNeeded

	// console.log('student, bm', student)

	var requirements = [
		common.courses(courses, creditsNeeded),
		common.residency(courses, fabrications),
		common.interim(courses, fabrications),
		common.gpa(courses),
		common.courseLevel(courses),
		common.gradedCourses(courses, fabrications),
		dedicatedMusicMajor(studies, courses),
	]

	if (utilities.isBachelorOfBoth(studies)) {
		requirements.push(common.artsAndMusicDoubleMajor(courses, studies, fabrications))
	}

	var bachelorOfMusicRequirements = Promise.all(requirements).then(function(results) {
		// console.log('checkBachelorOfMusicDegree', 'results', results)
		return results
	})

	return Promise.props({
		result: bachelorOfMusicRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: bachelorOfMusicRequirements
	})
}

module.exports = checkBachelorOfMusicDegree
