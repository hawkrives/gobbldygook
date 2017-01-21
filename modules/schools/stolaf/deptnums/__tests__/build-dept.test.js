// @flow
import {expect} from 'chai'
import {buildDeptString} from '../build-dept'

describe('buildDeptString', () => {
	it('builds a department string from a single-dept course', () => {
		expect(buildDeptString(['ASIAN'])).to.equal('ASIAN')
	})

	it('builds a department string from a multi-department course', () => {
		expect(buildDeptString(['ASIAN', 'REL'])).to.equal('ASIAN/REL')
	})

	it('maintains the order of the departments array', () => {
		let BICH = ['BIO', 'CHEM']
		let CHBI = ['CHEM', 'BIO']

		expect(buildDeptString(BICH)).to.equal('BIO/CHEM')
		expect(buildDeptString(CHBI)).to.equal('CHEM/BIO')
	})

	it('maintains the order of the departments array even after shrinking', () => {
		expect(buildDeptString(['BIOLOGY', 'CHEMISTRY'])).to.equal('BIO/CHEM')
		expect(buildDeptString(['CHEMISTRY', 'BIOLOGY'])).to.equal('CHEM/BIO')
	})

	it('properly condenses department names into abbrs', () => {
		expect(buildDeptString(['RELIGION'])).to.equal('REL')
	})

	it('properly expands department short abbrs into abbrs', () => {
		expect(buildDeptString(['AS', 'RE'])).to.equal('ASIAN/REL')
	})

	it('doesn\'t modify the departments property', () => {
		let depts = ['AS', 'RE']
		let untouchedDepts = ['AS', 'RE']

		buildDeptString(depts)

		expect(depts).to.eql(untouchedDepts)
	})

	it('returns NONE for empty arguments', () => {
		expect(buildDeptString()).to.equal('NONE')
	})

	it('returns NONE for an empty departments list', () => {
		expect(buildDeptString([])).to.equal('NONE')
	})
})
