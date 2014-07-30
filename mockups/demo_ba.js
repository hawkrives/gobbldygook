var _ = require('lodash')
var Promise = require('bluebird')

var common = require('./demo_common_graduation_requirements')
var hasDepartment = require('../client/helpers/hasDepartment')

function artsMajor(studies, courses) {
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

	var majors = _.filter(studies, {type: 'major'})

	return {
		title: 'Major',
		result: _.size(majors) >= 1 && _.every(majors, common.atLeastEightCredits(courses))
	}
}

var twentyOneCreditsAndBeyond = _.curry(function(courses, major) {
	// Takes the courses *outside* of the major department, and counts them.

	// _.curry allows the function to be called with arguments multiple times.
	// also, remember: reject !== filter.

	var beyondMajorCourses = _.reject(courses, hasDepartment(major.abbr))
	var fullCreditBeyondMajorCourses = _.filter(beyondMajorCourses, common.onlyFullCreditCourses)
	return countCredits(fullCreditBeyondMajorCourses) >= 21
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

	return {
		title: 'Beyond the Major',
		result: _.every(_.filter(studies, {type: 'major'}), twentyOneCreditsAndBeyond(courses))
	}
}

function checkBachelorOfArtsDegree(student) {
	// Requirements taken from
	// http://www.stolaf.edu/catalog/1314/academiclife/ba-gen-grad-requirements.html

	// TODO: Turn off cortex.
	var requirements = [
		common.courses(student.courses, student.creditsNeeded),
		common.residency(student.courses, student.fabrications),
		common.interim(student.courses),
		common.gpa(student.courses),
		common.courseLevel(student.courses),
		common.gradedCourses(student.courses, student.fabrications),
		artsMajor(student.studies, student.courses),
		beyondTheMajor(student.studies, student.courses),
	]

	if (common.isBachelorOfBoth(student)) {
		requirements.push(common.artsAndMusicDoubleMajor(
			student.courses, student.studies, student.fabrications
		))
	}

	var bachelorOfArtsRequirements = Promise.all(requirements).then(function(results) {
		console.log('checkBachelorOfArtsDegree', 'results', results)
		return results
	})

	return Promise.props({
		result: bachelorOfArtsRequirements.then(function(results) {
			return _.all(results, 'result')
		}),
		details: bachelorOfArtsRequirements
	})
}

module.exports = checkBachelorOfArtsDegree
