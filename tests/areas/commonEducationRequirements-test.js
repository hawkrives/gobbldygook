// __tests__/areas/common-education-requirements-test.js
jest.dontMock('../../mockups/commonEducationRequirements');
jest.dontMock('../../mockups/commonEducationUtilities');
jest.dontMock('../../app/helpers/deptNum');
jest.dontMock('../../app/helpers/hasDepartment');

// todo: the [across two depts] requirements need to validate when there's
// only one course.
// f.ex: if there's only a course with the ALS-L, then the ALS-L should be true.
// but if there are both -L and -A, they must be in different departments.

const reqs = require('../../mockups/commonEducationRequirements')
const student = {
	matriculation: 2012,
	graduation: 2016,
	courses: [
		{crsid: 1, year: 2012, depts: ['AMCON'], gereqs: ['FYW', 'ALS-A', 'ALS-L']},
		{crsid: 2, year: 2013, depts: ['ASIAN'], gereqs: ['HBS', 'MCG', 'WRI']},
		{crsid: 3, year: 2014, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-L']},
		{crsid: 4, year: 2013, depts: ['CSCI', 'MATH'], gereqs: ['MCD', 'MCG', 'ALS-L']},
		{crsid: 5, year: 2013, depts: ['BIO'], gereqs: ['IST', 'FOL-J']},
		{crsid: 6, year: 2013, depts: ['CHEM'], gereqs: ['SED', 'WRI', 'HWC']},
		{crsid: 7, year: 2013, depts: ['CSCI', 'MATH'], gereqs: ['WRI', 'ALS-L']},
		{crsid: 8, year: 2013, depts: ['CSCI', 'MATH'], gereqs: ['WRI', 'MCD', 'ALS-L']},
		{crsid: 9, year: 2013, depts: ['CSCI', 'MATH'], gereqs: ['WRI', 'MCD', 'ALS-L']},
		{crsid: 10, year: 2013, depts: ['CSCI'], gereqs: ['AQR', 'ORC', 'MCG']},
		{crsid: 11, year: 2013, term: 20131, depts: ['CSCI'], gereqs: ['BTS-T']},
		{crsid: 12, year: 2013, term: 20131, depts: ['CSCI'], gereqs: ['EIN', 'HWC']},
		{crsid: 13, year: 2012, depts: ['BIO'], gereqs: ['BTS-B', 'HBS']},
	],
}

let makeResults = (title, abbr) => {
	let goodResult = {title, abbr}
	goodResult.result = true
	let badResult = {title, abbr}
	badResult.result = false
	return [goodResult, badResult]
}

describe('firstYearWriting', function() {
	it('checks if a list of courses fulfills the FYW requirement', function() {
		const firstYearWriting = reqs.firstYearWriting;
		const [goodResult, badResult] = makeResults('First Year Writing', 'FYW')

		expect(firstYearWriting(student.courses, student.matriculation)).toEqual(goodResult);
	})
})

describe('writingInContext', function() {
	it('checks if a list of courses fulfills the WRI requirement', function() {
		const writingInContext = reqs.writingInContext;
		const [goodResult, badResult] = makeResults('Writing in Context', 'WRI')

		expect(writingInContext(student.courses)).toEqual(goodResult);
	})
})

describe('foreignLanguage', function() {
	it('checks if a list of courses fulfills the FOL requirement', function() {
		const foreignLanguage = reqs.foreignLanguage;
		const [goodResult, badResult] = makeResults('Foreign Language', 'FOL')

		expect(foreignLanguage(student.courses)).toEqual(goodResult);
	})
})

describe('oralCommunication', function() {
	it('checks if a list of courses fulfills the ORC requirement', function() {
		const oralCommunication = reqs.oralCommunication;
		const [goodResult, badResult] = makeResults('Oral Communication', 'ORC')

		expect(oralCommunication(student.courses)).toEqual(goodResult);
	})
})

describe('abstractAndQuantitativeReasoning', function() {
	it('checks if a list of courses fulfills the AQR requirement', function() {
		const abstractAndQuantitativeReasoning = reqs.abstractAndQuantitativeReasoning;
		const [goodResult, badResult] = makeResults('Abstract and Quantitative Reasoning', 'AQR')

		expect(abstractAndQuantitativeReasoning(student.courses)).toEqual(goodResult);
	})
})

describe('studiesInPhysicalMovement', function() {
	it('checks if a list of courses fulfills the SPM requirement', function() {
		const studiesInPhysicalMovement = reqs.studiesInPhysicalMovement;
		const [goodResult, badResult] = makeResults('Studies in Physical Movement', 'SPM')

		let goodCourseLoads = [
			[{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
			 {crsid: 2, depts: ['ESTH'], gereqs: ['SPM'], credits: 0.25}],

			[{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
			 {crsid: 2, depts: ['ESTH'], num: 172, gereqs: ['SPM'], credits: 0.25}],
		]

		let badCourseLoads = [
			[{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
			 {crsid: 2, depts: ['ESTH'], credits: 0.25}],

			[{crsid: 1, depts: ['ESTH'], num: 178, gereqs: ['SPM'], credits: 1.00},
			 {crsid: 2, depts: ['ESTH'], num: 172, gereqs: ['SPM'], credits: 0.25}],

			[{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
			 {crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 0.25}],
		]

		expect(studiesInPhysicalMovement(goodCourseLoads[0])).toEqual(goodResult);
		expect(studiesInPhysicalMovement(goodCourseLoads[1])).toEqual(goodResult);

		expect(studiesInPhysicalMovement(badCourseLoads[0])).toEqual(badResult);
		expect(studiesInPhysicalMovement(badCourseLoads[1])).toEqual(badResult);
		expect(studiesInPhysicalMovement(badCourseLoads[2])).toEqual(badResult);
	})
})

describe('historicalStudiesInWesternCulture', function() {
	it('checks if a list of courses fulfills the HWC requirement', function() {
		const historicalStudiesInWesternCulture = reqs.historicalStudiesInWesternCulture;
		const [goodResult, badResult] = makeResults('Historical Studies in Western Culture', 'HWC')

		expect(historicalStudiesInWesternCulture(student.courses)).toEqual(goodResult);
	})
})

describe('multiculturalGlobalStudies', function() {
	it('checks if a list of courses fulfills the MCG requirement', function() {
		const multiculturalGlobalStudies = reqs.multiculturalGlobalStudies;
		const [goodResult, badResult] = makeResults('Multicultural Studies - Global', 'MCG')

		expect(multiculturalGlobalStudies(student.courses)).toEqual(goodResult);
	})
})

describe('multiculturalDomesticStudies', function() {
	it('checks if a list of courses fulfills the MCD requirement', function() {
		const multiculturalDomesticStudies = reqs.multiculturalDomesticStudies;
		const [goodResult, badResult] = makeResults('Multicultural Studies - Domestic', 'MCD')

		expect(multiculturalDomesticStudies(student.courses)).toEqual(goodResult);
	})
})

describe('artisticStudies', function() {
	it('checks if a list of courses fulfills the ALS-A requirement', function() {
		const artisticStudies = reqs.artisticStudies;
		const [goodResult, badResult] = makeResults('Artistic Studies', 'ALS-A');

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['ALS-A']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-A', 'ALS-L']}]

		expect(artisticStudies(student.courses)).toEqual(goodResult);
		expect(artisticStudies(validCourses)).toEqual(goodResult);
		expect(artisticStudies(invalidCourses)).toEqual(badResult);
	})
})

describe('literaryStudies', function() {
	it('checks if a list of courses fulfills the ALS-L requirement', function() {
		const literaryStudies = reqs.literaryStudies;
		const [goodResult, badResult] = makeResults('Literary Studies', 'ALS-L')

		let validCourses = [{crsid: 3, year: 2014, depts: ['AMCON'], gereqs: ['ALS-L']}]
		let invalidCourses = [{crsid: 3, year: 2014, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-L', 'ALS-A']}]

		expect(literaryStudies(student.courses)).toEqual(goodResult);
		expect(literaryStudies(validCourses)).toEqual(goodResult);
		expect(literaryStudies(invalidCourses)).toEqual(badResult);
	})
})

describe('biblicalStudies', function() {
	it('checks if a list of courses fulfills the BTS-B requirement', function() {
		const biblicalStudies = reqs.biblicalStudies;
		const [goodResult, badResult] = makeResults('Biblical and Theological Studies - Bible', 'BTS-B')

		expect(biblicalStudies(student.courses, student.matriculation)).toEqual(goodResult);
	})
})

describe('theologicalStudies', function() {
	it('checks if a list of courses fulfills the BTS-T requirement', function() {
		const theologicalStudies = reqs.theologicalStudies;
		const [goodResult, badResult] = makeResults('Biblical and Theological Studies - Theology', 'BTS-T')

		expect(theologicalStudies(student.courses)).toEqual(goodResult);
	})
})

describe('scientificExplorationAndDiscovery', function() {
	it('checks if a list of courses fulfills the SED requirement', function() {
		const scientificExplorationAndDiscovery = reqs.scientificExplorationAndDiscovery;
		const [goodResult, badResult] = makeResults('Scientific Exploration and Discovery', 'SED')

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['SED']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['SED', 'IST']}]

		expect(scientificExplorationAndDiscovery(student.courses)).toEqual(goodResult);
		expect(scientificExplorationAndDiscovery(validCourses)).toEqual(goodResult);
		expect(scientificExplorationAndDiscovery(invalidCourses)).toEqual(badResult);
	})
})

describe('integratedScientificTopics', function() {
	it('checks if a list of courses fulfills the IST requirement', function() {
		const integratedScientificTopics = reqs.integratedScientificTopics;
		const [goodResult, badResult] = makeResults('Integrated Scientific Topics', 'IST')

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['IST']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['IST', 'SED']}]

		expect(integratedScientificTopics(student.courses)).toEqual(goodResult);
		expect(integratedScientificTopics(validCourses)).toEqual(goodResult);
		expect(integratedScientificTopics(invalidCourses)).toEqual(badResult);
	})
})

describe('studiesInHumanBehaviorAndSociety', function() {
	it('checks if a list of courses fulfills the HBS requirement', function() {
		const studiesInHumanBehaviorAndSociety = reqs.studiesInHumanBehaviorAndSociety;
		const [goodResult, badResult] = makeResults('Studies in Human Behavior and Society', 'HBS')

		let validCourses = [
			{crsid: 3, depts: ['AMCON'], gereqs: ['HBS']},
			{crsid: 4, depts: ['ASIAN'], gereqs: ['HBS']},
		]
		let invalidCourses = [{crsid: 1, depts: ['AMCON', 'ASIAN'], gereqs: ['HBS']}]

		expect(studiesInHumanBehaviorAndSociety(student.courses)).toEqual(goodResult);
		expect(studiesInHumanBehaviorAndSociety(validCourses)).toEqual(goodResult);
		expect(studiesInHumanBehaviorAndSociety(invalidCourses)).toEqual(badResult);
	})
})

describe('ethicalIssuesAndNormativePerspectives', function() {
	it('checks if a list of courses fulfills the EIN requirement', function() {
		const ethicalIssuesAndNormativePerspectives = reqs.ethicalIssuesAndNormativePerspectives;
		const [goodResult, badResult] = makeResults('Ethical Issues and Normative Perspectives', 'EIN')

		expect(ethicalIssuesAndNormativePerspectives(student.courses)).toEqual(goodResult);
	})
})
