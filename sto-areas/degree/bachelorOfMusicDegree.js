import _ from 'lodash'

import common from 'sto-areas/lib/commonGraduationRequirements'
import utilities from 'sto-areas/lib/commonGraduationUtilities'
import educ from 'sto-areas/lib/commonEducationRequirements'
import eduUtilities from 'sto-areas/lib/commonEducationUtilities'
let countGeneds = eduUtilities.countGeneds

function onlyMusicMajors(major) {
	return _.any([
		major.title === 'Performance',
		major.title === 'Church Music',
		major.title === 'Theory-Composition',
		major.title === 'Music Education',
		major.title === 'Elective Studies',
	])
}

function foreignLanguage(courses) {
	// Foreign Language [FOL] -- 0-2 courses
	// Vocal Performance: 0-2 courses in each of 2 languages; one must be French or German)
	return {
		title: 'Foreign Language',
		abbr: 'FOL',
		result: true,
	}
}

function abstractAndQuantitativeReasoning(courses) {
	// AQR or SED or IST
	let which = _.find([
		{
			title: 'Abstract and Quantitative Reasoning',
			abbr: 'AQR',
			result: countGeneds(courses, 'AQR') >= 1,
		},
		{
			title: 'Studies in Natural Science: Scientific Exploration and Discovery',
			abbr: 'SED',
			result: countGeneds(courses, 'SED') >= 1,
		},
		{
			title: 'Integrated Scientific Topics',
			abbr: 'IST',
			result: countGeneds(courses, 'IST') >= 1,
		},
	], 'result')

	let generic = {
		title: 'Abstract and Quantitative Reasoning OR Studies in Natural Science: Scientific Exploration and Discovery OR Integrated Scientific Topics',
		abbr: 'AQR/SED/IST',
		result: false,
	}

	if (which) {
		return which
	}
	else {
		return generic
	}
}

function historicalOrLiteraryStudies(courses) {
	// ALS-L or HWC - 1 course
	let which = _.find([
		{
			title: 'Historical Studies in Western Culture',
			abbr: 'HWC',
			result: countGeneds(courses, 'HWC') >= 1,
		},
		{
			title: 'Literary Studies',
			abbr: 'ALS-L',
			result: countGeneds(courses, 'ALS-L') >= 1,
		},
	], 'result')

	let generic = {
		title: 'Historical Studies in Western Culture OR Literary Studies',
		abbr: 'HWC/ALS-L',
		result: false,
	}

	if (which) {
		return which
	}
	else {
		return generic
	}
}

function multiculturalStudies(courses) {
	// MCD or MCG - 1 course
	let which = _.find([
		{
			title: 'Multicultural Studies - Domestic',
			abbr: 'MCD',
			result: countGeneds(courses, 'MCD') >= 1,
		},
		{
			title: 'Multicultural Studies - Global',
			abbr: 'MCG',
			result: countGeneds(courses, 'MCG') >= 1,
		},
	], 'result')

	let generic = {
		title: 'Multicultural Studies',
		abbr: 'MCD/MCG',
		result: false,
	}

	if (which) {
		return which
	}
	else {
		return generic
	}
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

	let majors = _.filter(studies, {type: 'major'})

	let musicMajors = _.filter(majors, onlyMusicMajors)

	let everyMusicMajorHasEnoughExtraCredits = _.every(musicMajors, utilities.creditsBeyondTheArea(courses, 8))

	return {
		title: 'Music Major',
		type: 'boolean',
		result: _.size(musicMajors) >= 1 && everyMusicMajorHasEnoughExtraCredits,
	}
}

function checkBachelorOfMusicDegree(student) {
	return student.data().then((studentPieces) => {
		let {
			courses,
			fabrications,
			studies,
			creditsNeeded,
			graduation,
			matriculation,
		} = studentPieces

		courses = _.filter(courses, utilities.onlyQuarterCreditCoursesCanBePassFail)

		// Requirements taken from
		// http://www.stolaf.edu/catalog/1314/academiclife/bm-gen-grad-requirements.html

		let graduationRequirements = [
			common.courses(courses, creditsNeeded),
			common.residency(courses, fabrications),
			common.interim(courses, fabrications, graduation),
			common.courseLevel(courses),
			common.gpa(courses),
			common.gradedCourses(courses, fabrications),
			dedicatedMusicMajor(studies, courses),
		]

		if (utilities.isBachelorOfBoth(studies)) {
			graduationRequirements.push(common.artsAndMusicDoubleMajor(courses, studies, fabrications))
		}

		let educationRequirements = {
			foundation: [
				educ.firstYearWriting(courses, matriculation),
				educ.writingInContext(courses),
				foreignLanguage(courses),
				educ.oralCommunication(courses),
				abstractAndQuantitativeReasoning(courses),
				educ.studiesInPhysicalMovement(courses),
			],
			core: [
				historicalOrLiteraryStudies(courses),
				multiculturalStudies(courses),
				educ.biblicalStudies(courses, matriculation),
				educ.theologicalStudies(courses),
				educ.studiesInHumanBehaviorAndSociety(courses),
			],
			integrative: [
				educ.ethicalIssuesAndNormativePerspectives(courses),
			],
		}

		let educationRequirementsResults = [
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
				details: educationRequirements.core,
			},
			{
				title: 'Integrative',
				type: 'array/boolean',
				result: _.all(educationRequirements.integrative, 'result'),
				details: educationRequirements.integrative,
			},
		]

		let bachelorOfMusicRequirements = [
			{
				title: 'Graduation',
				type: 'array/boolean',
				result: _.all(graduationRequirements, 'result'),
				details: graduationRequirements,
			},
			{
				title: 'Education',
				type: 'array/requirementSet',
				result: _.all(educationRequirementsResults, 'result'),
				details: educationRequirementsResults,
			},
		]

		// console.log('checkBachelorOfMusicDegree', 'results', results)

		return {
			result: _.all(bachelorOfMusicRequirements, 'result'),
			details: bachelorOfMusicRequirements,
		}
	})
}

let bachelorOfMusicDegree = {
	title: 'Bachelor of Music',
	type: 'degree',
	id: 'd-bm',
	departmentAbbr: 'B.M.',

	check: checkBachelorOfMusicDegree,
	_requirements: {
		dedicatedMusicMajor,
		abstractAndQuantitativeReasoning,
		foreignLanguage,
		historicalOrLiteraryStudies,
		multiculturalStudies,
	},
}

export default checkBachelorOfMusicDegree
