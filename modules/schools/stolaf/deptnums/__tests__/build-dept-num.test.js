import {expect} from 'chai'
import {buildDeptNum} from '../build-dept-num'

describe('buildDeptNum', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {depts: ['ASIAN'], num: 175}

		expect(buildDeptNum(ASIAN)).to.equal('ASIAN 175')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {depts: ['ASIAN', 'REL'], num: 230}

		expect(buildDeptNum(ASRE)).to.equal('ASIAN/REL 230')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {depts: ['BIO', 'CHEM'], num: 125}
		let CHBI = {depts: ['CHEM', 'BIO'], num: 125}

		expect(buildDeptNum(BICH)).to.equal('BIO/CHEM 125')
		expect(buildDeptNum(CHBI)).to.equal('CHEM/BIO 125')
	})

	it('handles sections', () => {
		let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

		expect(buildDeptNum(AMCON, true)).to.equal('AMCON 201A')
	})

	it('only handles sections when told to', () => {
		let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

		expect(buildDeptNum(AMCON)).to.equal('AMCON 201')
	})
})
