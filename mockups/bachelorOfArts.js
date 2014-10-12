'use strict';

let _ = require('lodash')
let Promise = require('bluebird')

let common = require('./commonGraduationRequirements')
let utilities = require('./commonGraduationUtilities')
let isMajoringIn = utilities.isMajoringIn
let educ = require('./commonEducationRequirements')

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
		type: 'boolean',
		result: _.size(majors) >= 1 && _.every(majors, utilities.creditsBeyondTheArea(courses, 8))
	}
}

function onlyTheTwoArtMajors(major) {
	return (major.title === 'Studio Art' || major.title === 'Art History')
}

function beyondTheMajor(studies, courses) {
	// While the maximum course credits counting toward a major in any one
	// department may vary, 21 total full-course credits must be completed
	// outside of the SIS "department" code of the major. The 21 total credits
	// include Education Department courses attending the major. In order for
	// a student to be certified in a second or third major, 21 credits also
	// must be taken outside of the SIS "department" code of each of those
	// majors as well. If a student has a double major, courses taken in one
	// major count toward the 21 credits outside of the other major. Credits
	// outside the major department or program include full (1.00) credit
	// courses plus partial - (.25, .50, .75) credit courses.

	// 2014/15: Students who double-major in studio art and art history are
	// required to complete at least 18 full-course credits outside the SIS
	// "ART" department designation.

	var majors = _.filter(studies, {type: 'major'})

	// If double-majorsing in ART HISTORY and STUDIO ART, ensure that they
	// have 18 credits outside of the ART dept. Accomplished by setting both
	// ART and STUDIO ART's dept to ART.
	var isDedicatedArtist = _.all([
		// Only returns true if majoring in both Studio Art and Art History.
		isMajoringIn('Studio Art', studies),
		isMajoringIn('Art History', studies),
	])

	var artMajorAndBeyond = undefined
	if (isDedicatedArtist) {
		// Check the two majors agains the 18-course requirement
		artMajorAndBeyond = _.chain(majors)
			.filter(onlyTheTwoArtMajors)
			.every(utilities.creditsBeyondTheArea(courses, 18))
			.value()

		// Remove the two majors, so they aren't checked against the 21-course
		// requirement.
		majors = _.chain(majors)
			.reject({title: 'Studio Art'})
			.reject({title: 'Art History'})
			.value()
	}

	// Ensure that each major has 21 credits beyond its scope.
	var mainstream = _.every(majors, utilities.creditsBeyondTheArea(courses, 21))

	var result = mainstream
	if (isDedicatedArtist) {
		result = _.all([mainstream, artMajorAndBeyond])
	}

	return {
		title: 'Beyond the Major',
		type: 'boolean',
		result: result
	}
}

function checkBachelorOfArtsDegree(student) {
	// Requirements taken from
	// http://www.stolaf.edu/catalog/1314/academiclife/ba-gen-grad-requirements.html

	var studies = student.studies
	var courses = _.filter(student.courses, utilities.onlyQuarterCreditCoursesCanBePassFail)
	var fabrications = []
	var creditsNeeded = student.creditsNeeded

	var graduationRequirements = [
		common.courses(courses, creditsNeeded),
		common.residency(courses, fabrications),
		common.interim(courses, fabrications),
		common.gpa(courses),
		common.courseLevel(courses),
		common.gradedCourses(courses, fabrications),
		artsMajor(studies, courses),
		beyondTheMajor(studies, courses),
	]

	if (utilities.isBachelorOfBoth(studies)) {
		graduationRequirements.push(common.artsAndMusicDoubleMajor(courses, studies, fabrications))
	}

	var educationRequirements = {
		foundation: [
			educ.firstYearWriting(courses),
			educ.writingInContext(courses),
			educ.foreignLanguage(courses),
			educ.oralCommunication(courses),
			educ.abstractAndQuantitativeReasoning(courses),
			educ.studiesInPhysicalMovement(courses),
		],
		core: [
			educ.historicalStudiesInWesternCulture(courses),
			educ.multiculturalDomesticStudies(courses),
			educ.multiculturalGlobalStudies(courses),
			educ.artisticStudies(courses),
			educ.literaryStudies(courses),
			educ.biblicalStudies(courses),
			educ.theologicalStudies(courses),
			educ.scientificExplorationAndDiscovery(courses),
			educ.integratedScientificTopics(courses),
			educ.studiesInHumanBehaviorAndSociety(courses),
		],
		integrative: [
			educ.ethicalIssuesAndNormativePerspectives(courses),
		]
	}

	var educationRequirementsResults = [
		{
			title: 'Foundation',
			type: 'array/boolean',
			result: _.all(educationRequirements.foundation, 'result'),
			details: educationRequirements.foundation,
		},
		{
			title: 'Core',
			type: 'array/boolean',
			result: _.all(educationRequirements.core, 'result'),
			details: educationRequirements.core
		},
		{
			title: 'Integrative',
			type: 'array/boolean',
			result: _.all(educationRequirements.integrative, 'result'),
			details: educationRequirements.integrative
		},
	]

	var bachelorOfArtsRequirements = [
		{
			title: 'Graduation',
			type: 'array/boolean',
			result: _.all(graduationRequirements, 'result'),
			details: graduationRequirements
		},
		{
			title: 'Education',
			type: 'array/requirementSet',
			result: _.all(educationRequirementsResults, 'result'),
			details: educationRequirementsResults
		}
	]

	// console.log('checkBachelorOfArtsDegree', 'results', bachelorOfArtsRequirements)

	return Promise.props({
		result: _.all(bachelorOfArtsRequirements, 'result'),
		details: bachelorOfArtsRequirements
	})
}

module.exports = checkBachelorOfArtsDegree
