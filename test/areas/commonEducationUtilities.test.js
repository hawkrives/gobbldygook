// tests/areas/common-education-utilities-test.js
jest.dontMock('../../mockups/commonEducationUtilities')

describe('onlyQuarterCreditCoursesCanBePassFail', function() {
	it('doesn\'t really do anything, yet', function() {
		var quarterCreditCourses = require('../../mockups/commonEducationUtilities').onlyQuarterCreditCoursesCanBePassFail
		var course = {}
		expect(quarterCreditCourses(course)).toBe(true)
	})
})

describe('hasGenEd', function() {
	it('check if a given course counts towards a gened', function() {
		var hasGenEd = require('../../mockups/commonEducationUtilities').hasGenEd
		var course = {gereqs: ['FYW']}

		expect(hasGenEd('FYW', course)).toBe(true)
		expect(hasGenEd('WRI', course)).toBe(false)
	})
})

describe('hasFOL', function() {
	it('check if a given course counts towards the FOL gened', function() {
		var hasFOL = require('../../mockups/commonEducationUtilities').hasFOL
		var courses = {
			C: {gereqs: ['FOL-C']},
			F: {gereqs: ['FOL-F']},
			G: {gereqs: ['FOL-G']},
			J: {gereqs: ['FOL-J']},
			K: {gereqs: ['FOL-K']},
			L: {gereqs: ['FOL-L']},
			M: {gereqs: ['FOL-M']},
			N: {gereqs: ['FOL-N']},
			O: {gereqs: ['FOL-O']},
			R: {gereqs: ['FOL-R']},
			S: {gereqs: ['FOL-S']},
			T: {gereqs: ['FOL-T']},
			Y: {gereqs: ['FOL-Y']},
			false: {gereqs: ['WRI']},
		}

		expect(hasFOL(courses.C)).toBe(true)
		expect(hasFOL(courses.F)).toBe(true)
		expect(hasFOL(courses.G)).toBe(true)
		expect(hasFOL(courses.J)).toBe(true)
		expect(hasFOL(courses.K)).toBe(true)
		expect(hasFOL(courses.L)).toBe(true)
		expect(hasFOL(courses.M)).toBe(true)
		expect(hasFOL(courses.N)).toBe(true)
		expect(hasFOL(courses.O)).toBe(true)
		expect(hasFOL(courses.R)).toBe(true)
		expect(hasFOL(courses.S)).toBe(true)
		expect(hasFOL(courses.T)).toBe(true)
		expect(hasFOL(courses.Y)).toBe(true)

		expect(hasFOL(courses.false)).toBe(false)
	})
})

describe('countGeneds', function() {
	it('counts the number of courses that have a given gened', function() {
		var countGeneds = require('../../mockups/commonEducationUtilities').countGeneds
		var courses = [
			{gereqs: ['FYW']}, {gereqs: ['FYW']},
			{gereqs: ['FOL-C']}, {gereqs: ['FOL-J', 'FOL-L']},
		]

		expect(countGeneds(courses, 'FYW')).toBe(2)
		expect(countGeneds(courses, 'WRI')).toBe(0)
		expect(countGeneds(courses, 'FOL')).toBe(2)
	})
})

describe('getDepartments', function() {
	it('returns an uniqued array of the departments from a list of courses', function() {
		var getDepartments = require('../../mockups/commonEducationUtilities').getDepartments
		var courses = [
			{depts: ['AMCON']}, {depts: ['ASIAN']},
			{depts: ['AMCON', 'ASIAN']}, {depts: ['CSCI', 'MATH']},
		]

		expect(getDepartments(courses)).toEqual(['AMCON', 'ASIAN', 'CSCI', 'MATH'])
	})
})

describe('acrossAtLeastTwoDepartments', function() {
	it('checks if a list of courses spans at least two departments', function() {
		var twoDepts = require('../../mockups/commonEducationUtilities').acrossAtLeastTwoDepartments
		var courses = [
			{depts: ['AMCON']}, {depts: ['ASIAN']},
			{depts: ['AMCON', 'ASIAN']}, {depts: ['CSCI', 'MATH']},
		]
		var failure = [
			{depts: ['AMCON']}, {depts: ['AMCON']},
		]

		expect(twoDepts(courses)).toBe(true)
		expect(twoDepts(failure)).toBe(false)
	})
})

describe('checkThatNCoursesSpanTwoDepartments', function() {
	it('checks if a list of courses covers at least two departments', function() {
		var checkThatNCoursesSpanTwoDepartments = require('../../mockups/commonEducationUtilities').checkThatNCoursesSpanTwoDepartments

		var courses = [
			{crsid: 1, depts: ['AMCON'], gereqs: ['HBS', 'ALS-A']},
			{crsid: 2, depts: ['ASIAN'], gereqs: ['HBS', 'MCG']},
			{crsid: 3, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-L']},
			{crsid: 4, depts: ['CSCI', 'MATH'], gereqs: ['MCD', 'ALS-L']},
			{crsid: 5, depts: ['BIO'], gereqs: ['IST']},
			{crsid: 6, depts: ['CHEM'], gereqs: ['SED']},
		]

		var failure = [
			{crsid: 1, depts: ['AMCON', 'ASIAN'], gereqs: ['ALS-L']},
			{crsid: 2, depts: ['BIO', 'CHEM'], gereqs: ['IST', 'SED']},
		]

		expect(checkThatNCoursesSpanTwoDepartments(courses, ['MCD', 'MCG'], 'MCD')).toBe(true)
		expect(checkThatNCoursesSpanTwoDepartments(courses, ['MCD', 'MCG'], 'MCG')).toBe(true)
		expect(checkThatNCoursesSpanTwoDepartments(courses, ['ALS-L', 'ALS-A'], 'ALS-A')).toBe(true)
		expect(checkThatNCoursesSpanTwoDepartments(courses, ['ALS-L', 'ALS-A'], 'ALS-L')).toBe(true)
		expect(checkThatNCoursesSpanTwoDepartments(courses, ['SED', 'IST'], 'IST')).toBe(true)
		expect(checkThatNCoursesSpanTwoDepartments(courses, ['HBS'], 'HBS', 1)).toBe(true)

		expect(checkThatNCoursesSpanTwoDepartments(failure, ['ALS-L', 'ALS-A'], 'ALS-L')).toBe(false)
	})
})
