var _ = require('lodash')
var Promise = require('bluebird')

var hasDeptNumBetween = require('../client/helpers/deptNum').hasDeptNumBetween

var utilities = require('./common education utilities')
var onlyQuarterCreditCoursesCanBePassFail = utilities.onlyQuarterCreditCoursesCanBePassFail
var hasGenEd = utilities.hasGenEd
var countGeneds = utilities.countGeneds

// TODO: Consider returning matches from these functions, in addition to the boolean.

function firstYearWriting(courses) {
	// First-year students are required to complete First-Year Writing (FYW),
	// with two exceptions:
	// NOTE: These two exceptions don't apply to Gobbldygook.

	// The course must be taken in the first year.
	var firstYear = _.min(courses, 'year')
	var firstYearCourses = _.filter(courses, {year: firstYear})

	return {
		title: 'First Year Writing',
		abbr: 'FYW',
		result: countGeneds(firstYearCourses, 'FYW') >= 1,
	}
}

function writingInContext(courses) {
	// WRI - 4 courses in any departments/programs
	return {
		title: 'Writing in Context',
		abbr: 'WRI',
		result: countGeneds(courses, 'WRI') >= 4,
	}
}

function foreignLanguage(courses) {
	// FOL - 0-4 courses

	// NOTE: This gened is only awarded in the final required course, so there
	// just needs to be one.

	return {
		title: 'Foreign Language',
		abbr: 'FOL',
		result: countGeneds(courses, 'FOL') >= 1,
	}
}

function oralCommunication(courses) {
	// ORC - 1 course
	return {
		title: 'Oral Communication',
		abbr: 'ORC',
		result: countGeneds(courses, 'ORC') >= 1,
	}
}

function abstractAndQuantitativeReasoning(courses) {
	// AQR - 1 course
	return {
		title: 'Abstract and Quantitative Reasoning',
		abbr: 'AQR',
		result: countGeneds(courses, 'AQR') >= 1,
	}
}

function studiesInPhysicalMovement(courses) {
	// SPM - 2 different courses

	// Two different courses, of any credit value, that expand students'
	// experiences in and understanding of movement and promote lifelong
	// health and wellness of the whole person. Students are encouraged to
	// expland their horizons and focus on different activities or modes of
	// movement in order to fulfill the requirements.

	// Only one SPM course credit may be earned by students as a result of
	// participation in an approved intercollegiate sport. This credit must be
	// entered as Exercise Science 171-194 at the registration preceding the
	// sport/participation term. Credit cannot be claimed after the term in
	// which participation took place unless the student completes a petition
	// form; a late fee is assessed. An intercollegiate SPM (.25) credit can
	// only be used within the two-course SPM graduation requirement. An
	// intercollegiate SPM (.25) credit cannot be used as an elective for the
	// purpose of earning a credit toward the 35 full-credit course
	// requirement for graduation. It can only be used once as one half of the
	// two-course SPM requirement.

	// After the two-course SPM requirement has been completed, students may
	// repeat a specific exercise science activity (ESAC) course under the
	// following conditions:

	// - The SPM requirement is completed with two different courses.

	// - Each specific exercise science activity course may only be taken a
	// maximum of four times (the first time plus three repeats).

	var spmCourses = _.filter(courses, hasGenEd('SPM'))
	var distinctSpmCourses = _.uniq(spmCourses, 'crsid')
	var numberOfSpmCourses = _.size(distinctSpmCourses)

	var sportsCourses = _.filter(courses, hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194}))
	var distinctSports = _.uniq(sportsCourses, 'crsid')
	var hasSportsCredit = _.size(distinctSports) >= 1

	if (numberOfSpmCourses < 2 && hasSportsCredit) {
		numberOfSpmCourses += 1
	}

	var result = (numberOfSpmCourses >= 2)

	return {
		title: 'Studies in Physical Movement',
		abbr: 'SPM',
		result: result,
	}
}

function historicalStudiesInWesternCulture(courses) {
	// HWC - 2 courses
	return {
		title: 'Historical Studies in Western Culture',
		abbr: 'HWC',
		result: countGeneds(courses, 'HWC') >= 2,
	}
}

function getDepartments(courses) {
	return _.chain(courses).pluck('depts').flatten().uniq().value()
}

function acrossAtLeastTwoDepartments(courses) {
	var depts = getDepartments(courses)

	return _.size(depts) >= 2
}

function checkCoursesAcrossTwoDepartments(courses, geneds, genedToCheck) {
	// XXX,YYY - 2 courses, from different departments
	var coursesOne = _.filter(courses, hasGenEd(geneds[0]))
	var coursesTwo = _.filter(courses, hasGenEd(geneds[1]))

	var allCourses = _.uniq(_.merge(coursesOne, coursesTwo), 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(allCourses)

	return _.all([
		countGeneds(courses, genedToCheck) >= 1,
		_.size(allCourses) >= 2,
		coversTwoDepartments
	])
}

function multiCulturalDomesticAndGlobalStudies(courses, gened) {
	// MCG,MCD - 2 courses, from different departments

	var mcdCourses = _.filter(courses, hasGenEd('MCD'))
	var mcgCourses = _.filter(courses, hasGenEd('MCG'))

	var mcdAndMcgCourses = _.uniq(_.merge(mcdCourses, mcgCourses), 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(mcdAndMcgCourses)

	return _.all([
		countGeneds(courses, gened) >= 1,
		_.size(mcdAndMcgCourses) >= 2,
		coversTwoDepartments
	])
}

function multiculturalDomesticStudies(courses) {
	// MCG,MCD - 2 courses, from different departments
	return {
		title: 'Multicultural Studies - Domestic',
		abbr: 'MCD',
		result: multiCulturalDomesticAndGlobalStudies(courses, 'MCD'),
	}
}

function multiculturalGlobalStudies(courses) {
	// MCG,MCD - 2 courses, from different departments
	return {
		title: 'Multicultural Studies - Global',
		abbr: 'MCG',
		result: multiCulturalDomesticAndGlobalStudies(courses, 'MCG'),
	}
}

function artisticAndLiteraryStudies(courses, gened) {
	// ALS-A,ALS-L - 2 courses, from different departments

	var artisticCourses = _.filter(courses, hasGenEd('ALS-A'))
	var literaryCourses = _.filter(courses, hasGenEd('ALS-L'))

	var artisticAndLiteraryCourses = _.uniq(_.merge(artisticCourses, literaryCourses), 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(artisticAndLiteraryCourses)

	return _.all([
		countGeneds(courses, gened) >= 1,
		_.size(artisticAndLiteraryCourses) >= 2,
		coversTwoDepartments
	])
}

function artisticStudies(courses) {
	// ALS-A,ALS-L - 2 courses, from different departments
	return {
		title: 'Artistic Studies',
		abbr: 'ALS-A',
		result: artisticAndLiteraryStudies(courses, 'ALS-A'),
	}
}

function literaryStudies(courses) {
	// ALS-A,ALS-L - 2 courses, from different departments
	return {
		title: 'Literary Studies',
		abbr: 'ALS-L',
		result: artisticAndLiteraryStudies(courses, 'ALS-L'),
	}
}

function biblicalStudies(courses) {
	// BTS-B - 1 course

	// We're going to continue under the assumption that the BTS-B must be
	// taken in the first year at Olaf.
	var firstYear = _.min(courses, 'year')
	var firstYearCourses = _.filter(courses, {year: firstYear})

	return {
		title: 'Biblical and Theological Studies - Bible',
		abbr: 'BTS-B',
		result: countGeneds(firstYearCourses, 'BTS-B') >= 1
	}
}

function theologicalStudies(courses) {
	// BTS-T - 1 course
	return {
		title: 'Biblical and Theological Studies - Theology',
		abbr: 'BTS-T',
		result: countGeneds(courses, 'BTS-T') >= 1,
	}
}

function studiesInNaturalScience(courses, gened) {
	// SED,IST - 2 courses, from different departments/programs

	var sedCourses = _.filter(courses, hasGenEd('SED'))
	var istCourses = _.filter(courses, hasGenEd('IST'))

	var naturalScienceCourses = _.uniq(_.merge(sedCourses, istCourses), 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(naturalScienceCourses)

	return _.all([
		countGeneds(courses, gened) >= 1,
		_.size(naturalScienceCourses) >= 2,
		coversTwoDepartments
	])
}

function scientificExplorationAndDiscovery(courses) {
	// SED,IST - 2 courses, from different departments/programs
	return {
		title: 'Scientific Exploration and Discovery',
		abbr: 'SED',
		result: studiesInNaturalScience(courses, 'SED'),
	}
}

function integratedScientificTopics(courses) {
	// SED,IST - 2 courses, from different departments/programs
	return {
		title: 'Integrated Scientific Topics',
		abbr: 'IST',
		result: studiesInNaturalScience(courses, 'IST'),
	}
}

function studiesInHumanBehaviorAndSociety(courses) {
	// HBS - 2 courses, from different departments/programs
	var hbsCourses = _.filter(courses, hasGenEd('HBS'))

	var matchingCourses = _.uniq(hbsCourses, 'crsid')
	var coversTwoDepartments = acrossAtLeastTwoDepartments(matchingCourses)

	var result = _.all([
		countGeneds(courses, 'HBS') >= 2,
		coversTwoDepartments
	])

	return {
		title: 'Studies in Human Behavior and Society',
		abbr: 'HBS',
		result: result,
	}
}

function ethicalIssuesAndNormativePerspectives(courses) {
	// EIN - 1 course

	// Prerequisite for all EIN courses: completion of the BTS-T requirement
	// or permission of the instructor.

	var termOfFirstBtsT = _.chain(courses)
		.filter(hasGenEd('BTS-T'))
		.pluck('term')
		.min()
		.value()

	var termOfFirstEin = _.chain(courses)
		.filter(hasGenEd('EIN'))
		.pluck('term')
		.min()
		.value()

	var result = _.all([
		termOfFirstBtsT <= termOfFirstEin,
		countGeneds(courses, 'EIN') >= 1,
	])

	return {
		title: 'Ethical Issues and Normative Perspectives',
		abbr: 'EIN',
		result: result,
	}
}

function integrativeCourses(courses) {
	return Promise.all([
		ethicalIssuesAndNormativePerspectives(courses),
	]).then(function(results) {
		return {
			title: 'Integrative',
			result: _.all(results),
			details: results
		}
	})
}

// Foundation
module.exports.firstYearWriting = firstYearWriting
module.exports.writingInContext = writingInContext
module.exports.foreignLanguage = foreignLanguage
module.exports.oralCommunication = oralCommunication
module.exports.abstractAndQuantitativeReasoning = abstractAndQuantitativeReasoning
module.exports.studiesInPhysicalMovement = studiesInPhysicalMovement

// Core
module.exports.historicalStudiesInWesternCulture = historicalStudiesInWesternCulture
module.exports.multiculturalDomesticStudies = multiculturalDomesticStudies
module.exports.multiculturalGlobalStudies = multiculturalGlobalStudies
module.exports.artisticStudies = artisticStudies
module.exports.literaryStudies = literaryStudies
module.exports.biblicalStudies = biblicalStudies
module.exports.theologicalStudies = theologicalStudies
module.exports.scientificExplorationAndDiscovery = scientificExplorationAndDiscovery
module.exports.integratedScientificTopics = integratedScientificTopics
module.exports.studiesInHumanBehaviorAndSociety = studiesInHumanBehaviorAndSociety

// Integrative
module.exports.ethicalIssuesAndNormativePerspectives = ethicalIssuesAndNormativePerspectives
