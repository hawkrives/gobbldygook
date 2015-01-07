// test/buildDept.test.js

import buildDept from 'app/helpers/buildDept'
describe('buildDept', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {depts: ['ASIAN']}

		buildDept(ASIAN).should.equal('ASIAN')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {depts: ['ASIAN', 'REL']}

		buildDept(ASRE).should.equal('ASIAN/REL')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {depts: ['BIO', 'CHEM']}
		let CHBI = {depts: ['CHEM', 'BIO']}

		buildDept(BICH).should.equal('BIO/CHEM')
		buildDept(CHBI).should.equal('CHEM/BIO')
	})
})
