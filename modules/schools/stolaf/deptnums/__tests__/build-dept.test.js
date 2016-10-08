import {expect} from 'chai'
import {buildDept} from '../build-dept'

describe('buildDept', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {departments: ['ASIAN']}

		expect(buildDept(ASIAN)).to.equal('ASIAN')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {departments: ['ASIAN', 'REL']}

		expect(buildDept(ASRE)).to.equal('ASIAN/REL')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {departments: ['BIO', 'CHEM']}
		let CHBI = {departments: ['CHEM', 'BIO']}

		expect(buildDept(BICH)).to.equal('BIO/CHEM')
		expect(buildDept(CHBI)).to.equal('CHEM/BIO')
	})

	it('maintains the order of the departments array even after shrinking', () => {
		let BICH = {departments: ['BIOLOGY', 'CHEMISTRY']}
		let CHBI = {departments: ['CHEMISTRY', 'BIOLOGY']}

		expect(buildDept(BICH)).to.equal('BIO/CHEM')
		expect(buildDept(CHBI)).to.equal('CHEM/BIO')
	})

	it('properly condenses department names into abbrs', () => {
		let course = {departments: ['RELIGION']}

		expect(buildDept(course)).to.equal('REL')
	})

	it('properly expands department short abbrs into abbrs', () => {
		let course = {departments: ['AS', 'RE']}

		expect(buildDept(course)).to.equal('ASIAN/REL')
	})

	it('doesn\'t modify the departments property', () => {
		let course = {departments: ['AS', 'RE']}
		let safecourse = {departments: ['AS', 'RE']}

		buildDept(course)

		expect(course).to.eql(safecourse)
	})
})
