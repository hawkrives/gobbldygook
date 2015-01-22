// tests/areas/common-education-requirements-test.js

// todo: the [across two depts] requirements need to validate when there's
// only one course.
// f.ex: if there's only a course with the ALS-L, then the ALS-L should be true.
// but if there are both -L and -A, they must be in different departments.

let student = {
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

xdescribe('firstYearWriting', function() {
	it('checks if a list of courses fulfills the FYW requirement', function() {
		let firstYearWriting = reqs.firstYearWriting
		let [goodResult, badResult] = makeResults('First Year Writing', 'FYW')

		firstYearWriting(student.courses, student.matriculation).should.eql(goodResult)
	})
})

xdescribe('writingInContext', function() {
	it('checks if a list of courses fulfills the WRI requirement', function() {
		let writingInContext = reqs.writingInContext
		let [goodResult, badResult] = makeResults('Writing in Context', 'WRI')

		writingInContext(student.courses).should.eql(goodResult)
	})
})

xdescribe('foreignLanguage', function() {
	it('checks if a list of courses fulfills the FOL requirement', function() {
		let foreignLanguage = reqs.foreignLanguage
		let [goodResult, badResult] = makeResults('Foreign Language', 'FOL')

		foreignLanguage(student.courses).should.eql(goodResult)
	})
})

xdescribe('oralCommunication', function() {
	it('checks if a list of courses fulfills the ORC requirement', function() {
		let oralCommunication = reqs.oralCommunication
		let [goodResult, badResult] = makeResults('Oral Communication', 'ORC')

		oralCommunication(student.courses).should.eql(goodResult)
	})
})

xdescribe('abstractAndQuantitativeReasoning', function() {
	it('checks if a list of courses fulfills the AQR requirement', function() {
		let abstractAndQuantitativeReasoning = reqs.abstractAndQuantitativeReasoning
		let [goodResult, badResult] = makeResults('Abstract and Quantitative Reasoning', 'AQR')

		abstractAndQuantitativeReasoning(student.courses).should.eql(goodResult)
	})
})

xdescribe('studiesInPhysicalMovement', function() {
	it('checks if a list of courses fulfills the SPM requirement', function() {
		let studiesInPhysicalMovement = reqs.studiesInPhysicalMovement
		let [goodResult, badResult] = makeResults('Studies in Physical Movement', 'SPM')

		let goodCourseLoads = [
			[
				{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
				{crsid: 2, depts: ['ESTH'], gereqs: ['SPM'], credits: 0.25},
			],

			[
				{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
				{crsid: 2, depts: ['ESTH'], num: 172, gereqs: ['SPM'], credits: 0.25},
			],
		]

		let badCourseLoads = [
			// Bad because the second course doesn't fulfill an SPM requirement
			[
				{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
				{crsid: 2, depts: ['ESTH'], credits: 0.25},
			],

			// Bad because it's using two intercollegiate sports to try and fulfill the requirement
			[
				{crsid: 1, depts: ['ESTH'], num: 178, gereqs: ['SPM'], credits: 1.00},
				{crsid: 2, depts: ['ESTH'], num: 172, gereqs: ['SPM'], credits: 0.25},
			],

			// Bad because ... um, IDK. But it's bad!
			[
				{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 1.00},
				{crsid: 1, depts: ['ESAC'], gereqs: ['SPM'], credits: 0.25},
			],
		]

		studiesInPhysicalMovement(goodCourseLoads[0]).should.eql(goodResult)
		studiesInPhysicalMovement(goodCourseLoads[1]).should.eql(goodResult)

		studiesInPhysicalMovement(badCourseLoads[0]).should.eql(badResult)
		studiesInPhysicalMovement(badCourseLoads[1]).should.eql(badResult)
		studiesInPhysicalMovement(badCourseLoads[2]).should.eql(badResult)
	})
})

xdescribe('historicalStudiesInWesternCulture', function() {
	it('checks if a list of courses fulfills the HWC requirement', function() {
		let historicalStudiesInWesternCulture = reqs.historicalStudiesInWesternCulture
		let [goodResult, badResult] = makeResults('Historical Studies in Western Culture', 'HWC')

		historicalStudiesInWesternCulture(student.courses).should.eql(goodResult)
	})
})

xdescribe('multiculturalGlobalStudies', function() {
	it('checks if a list of courses fulfills the MCG requirement', function() {
		let multiculturalGlobalStudies = reqs.multiculturalGlobalStudies
		let [goodResult, badResult] = makeResults('Multicultural Studies - Global', 'MCG')

		multiculturalGlobalStudies(student.courses).should.eql(goodResult)
	})
})

xdescribe('multiculturalDomesticStudies', function() {
	it('checks if a list of courses fulfills the MCD requirement', function() {
		let multiculturalDomesticStudies = reqs.multiculturalDomesticStudies
		let [goodResult, badResult] = makeResults('Multicultural Studies - Domestic', 'MCD')

		multiculturalDomesticStudies(student.courses).should.eql(goodResult)
	})
})

xdescribe('artisticStudies', function() {
	it('checks if a list of courses fulfills the ALS-A requirement', function() {
		let artisticStudies = reqs.artisticStudies
		let [goodResult, badResult] = makeResults('Artistic Studies', 'ALS-A')

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['ALS-A']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-A', 'ALS-L']}]

		artisticStudies(student.courses).should.eql(goodResult)
		artisticStudies(validCourses).should.eql(goodResult)
		artisticStudies(invalidCourses).should.eql(badResult)
	})
})

xdescribe('literaryStudies', function() {
	it('checks if a list of courses fulfills the ALS-L requirement', function() {
		let literaryStudies = reqs.literaryStudies
		let [goodResult, badResult] = makeResults('Literary Studies', 'ALS-L')

		let validCourses = [{crsid: 3, year: 2014, depts: ['AMCON'], gereqs: ['ALS-L']}]
		let invalidCourses = [{crsid: 3, year: 2014, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-L', 'ALS-A']}]

		literaryStudies(student.courses).should.eql(goodResult)
		literaryStudies(validCourses).should.eql(goodResult)
		literaryStudies(invalidCourses).should.eql(badResult)
	})
})

xdescribe('biblicalStudies', function() {
	it('checks if a list of courses fulfills the BTS-B requirement', function() {
		let biblicalStudies = reqs.biblicalStudies
		let [goodResult, badResult] = makeResults('Biblical and Theological Studies - Bible', 'BTS-B')

		biblicalStudies(student.courses, student.matriculation).should.eql(goodResult)
	})
})

xdescribe('theologicalStudies', function() {
	it('checks if a list of courses fulfills the BTS-T requirement', function() {
		let theologicalStudies = reqs.theologicalStudies
		let [goodResult, badResult] = makeResults('Biblical and Theological Studies - Theology', 'BTS-T')

		theologicalStudies(student.courses).should.eql(goodResult)
	})
})

xdescribe('scientificExplorationAndDiscovery', function() {
	it('checks if a list of courses fulfills the SED requirement', function() {
		let scientificExplorationAndDiscovery = reqs.scientificExplorationAndDiscovery
		let [goodResult, badResult] = makeResults('Scientific Exploration and Discovery', 'SED')

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['SED']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['SED', 'IST']}]

		scientificExplorationAndDiscovery(student.courses).should.eql(goodResult)
		scientificExplorationAndDiscovery(validCourses).should.eql(goodResult)
		scientificExplorationAndDiscovery(invalidCourses).should.eql(badResult)
	})
})

xdescribe('integratedScientificTopics', function() {
	it('checks if a list of courses fulfills the IST requirement', function() {
		let integratedScientificTopics = reqs.integratedScientificTopics
		let [goodResult, badResult] = makeResults('Integrated Scientific Topics', 'IST')

		let validCourses = [{crsid: 3, depts: ['AMCON'], gereqs: ['IST']}]
		let invalidCourses = [{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['IST', 'SED']}]

		integratedScientificTopics(student.courses).should.eql(goodResult)
		integratedScientificTopics(validCourses).should.eql(goodResult)
		integratedScientificTopics(invalidCourses).should.eql(badResult)
	})
})

xdescribe('studiesInHumanBehaviorAndSociety', function() {
	it('checks if a list of courses fulfills the HBS requirement', function() {
		let studiesInHumanBehaviorAndSociety = reqs.studiesInHumanBehaviorAndSociety
		let [goodResult, badResult] = makeResults('Studies in Human Behavior and Society', 'HBS')

		let validCourses = [
			{crsid: 3, depts: ['AMCON'], gereqs: ['HBS']},
			{crsid: 4, depts: ['ASIAN'], gereqs: ['HBS']},
		]
		let invalidCourses = [{crsid: 1, depts: ['AMCON', 'ASIAN'], gereqs: ['HBS']}]

		studiesInHumanBehaviorAndSociety(student.courses).should.eql(goodResult)
		studiesInHumanBehaviorAndSociety(validCourses).should.eql(goodResult)
		studiesInHumanBehaviorAndSociety(invalidCourses).should.eql(badResult)
	})
})

xdescribe('ethicalIssuesAndNormativePerspectives', function() {
	it('checks if a list of courses fulfills the EIN requirement', function() {
		let ethicalIssuesAndNormativePerspectives = reqs.ethicalIssuesAndNormativePerspectives
		let [goodResult, badResult] = makeResults('Ethical Issues and Normative Perspectives', 'EIN')

		ethicalIssuesAndNormativePerspectives(student.courses).should.eql(goodResult)
	})
})
