import {expect} from 'chai'
import hasDeptNumBetween from '../../src/helpers/has-dept-num-between'

describe('hasDeptNumBetween', () => {
	it('returns true if a course\'s dept and num are between the parameters', () => {
		let ASIAN_PARAMS = {dept: 'ASIAN', start: 200, end: 250}
		let ASIAN_COURSE = {depts: ['ASIAN'], num: 230}

		expect(hasDeptNumBetween(ASIAN_PARAMS, ASIAN_COURSE)).to.be.true
	})

	it('handles both sides of a interdisciplinary course\'s departments', () => {
		let ASIAN_PARAMS = {dept: 'ASIAN', start: 200, end: 250}
		let ASIAN_COURSE = {depts: ['ASIAN', 'REL'], num: 230}
		let ASIAN_REL_COURSE = {depts: ['REL', 'ASIAN'], num: 230}

		expect(hasDeptNumBetween(ASIAN_PARAMS, ASIAN_COURSE)).to.be.true
		expect(hasDeptNumBetween(ASIAN_PARAMS, ASIAN_REL_COURSE)).to.be.true
	})
})
