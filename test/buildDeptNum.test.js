// test/buildDeptNum.test.js
import 'should'

import buildDeptNum from 'app/helpers/buildDeptNum'
describe('buildDeptNum', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {depts: ['ASIAN'], num: 175}

		buildDeptNum(ASIAN).should.equal('ASIAN 175')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {depts: ['ASIAN', 'REL'], num: 230}

		buildDeptNum(ASRE).should.equal('ASIAN/REL 230')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {depts: ['BIO', 'CHEM'], num: 125}
		let CHBI = {depts: ['CHEM', 'BIO'], num: 125}

		buildDeptNum(BICH).should.equal('BIO/CHEM 125')
		buildDeptNum(CHBI).should.equal('CHEM/BIO 125')
	})

	it('handles sections', () => {
		let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

		buildDeptNum(AMCON, true).should.equal('AMCON 201A')
	})

	it('only handles sections when told to', () => {
		let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

		buildDeptNum(AMCON).should.equal('AMCON 201')
	})
})
