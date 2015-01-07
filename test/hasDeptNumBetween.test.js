// test/hasDeptNumBetween.test.js
import hasDeptNumBetween from 'app/helpers/hasDeptNumBetween'

describe('hasDeptNumBetween', () => {
	it('returns true if a course\'s dept and num are between the parameters', () => {
		let ASIAN_PARAMS = {dept: 'ASIAN', start: 200, end: 250}
		let ASIAN_COURSE = {depts: ['ASIAN'], num: 230}

		hasDeptNumBetween(ASIAN_PARAMS, ASIAN_COURSE).should.be.true
	})

	it('handles both sides of a interdisciplinary course\'s departments', () => {
		let ASIAN_PARAMS = {dept: 'ASIAN', start: 200, end: 250}
		let ASIAN_COURSE = {depts: ['ASIAN', 'REL'], num: 230}
		let ASIAN_REL_COURSE = {depts: ['REL', 'ASIAN'], num: 230}

		hasDeptNumBetween(ASIAN_PARAMS, ASIAN_COURSE).should.be.true
		hasDeptNumBetween(ASIAN_PARAMS, ASIAN_REL_COURSE).should.be.true
	})
})
