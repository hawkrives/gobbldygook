import {expect} from 'chai'
import {buildDeptNum} from '../build-dept-num'

describe('buildDeptNum', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {departments: ['ASIAN'], number: 175}

		expect(buildDeptNum(ASIAN)).to.equal('ASIAN 175')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {departments: ['ASIAN', 'REL'], number: 230}

		expect(buildDeptNum(ASRE)).to.equal('ASIAN/REL 230')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {departments: ['BIO', 'CHEM'], number: 125}
		let CHBI = {departments: ['CHEM', 'BIO'], number: 125}

		expect(buildDeptNum(BICH)).to.equal('BIO/CHEM 125')
		expect(buildDeptNum(CHBI)).to.equal('CHEM/BIO 125')
	})

	it('handles sections', () => {
		let AMCON = {departments: ['AMCON'], number: 201, sect: 'A'}

		expect(buildDeptNum(AMCON, true)).to.equal('AMCON 201A')
	})

	it('only handles sections when told to', () => {
		let AMCON = {departments: ['AMCON'], number: 201, sect: 'A'}

		expect(buildDeptNum(AMCON)).to.equal('AMCON 201')
	})
})
