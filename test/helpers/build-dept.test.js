import {expect} from 'chai'
import buildDept from '../../src/helpers/build-dept'

describe('buildDept', () => {
	it('builds a department string from a single-dept course', () => {
		let ASIAN = {depts: ['ASIAN']}

		expect(buildDept(ASIAN)).to.equal('ASIAN')
	})

	it('builds a department string from a multi-department course', () => {
		let ASRE = {depts: ['ASIAN', 'REL']}

		expect(buildDept(ASRE)).to.equal('ASIAN/REL')
	})

	it('maintains the order of the departments array', () => {
		let BICH = {depts: ['BIO', 'CHEM']}
		let CHBI = {depts: ['CHEM', 'BIO']}

		expect(buildDept(BICH)).to.equal('BIO/CHEM')
		expect(buildDept(CHBI)).to.equal('CHEM/BIO')
	})

	it('maintains the order of the departments array even after shrinking', () => {
		let BICH = {depts: ['BIOLOGY', 'CHEMISTRY']}
		let CHBI = {depts: ['CHEMISTRY', 'BIOLOGY']}

		expect(buildDept(BICH)).to.equal('BIO/CHEM')
		expect(buildDept(CHBI)).to.equal('CHEM/BIO')
	})

	it('properly condenses department names into abbrs', () => {
		let course = {depts: ['RELIGION']}

		expect(buildDept(course)).to.equal('REL')
	})

	it('properly expands department short abbrs into abbrs', () => {
		let course = {depts: ['AS', 'RE']}

		expect(buildDept(course)).to.equal('ASIAN/REL')
	})

	it('doesn\'t modify the depts property', () => {
		let course = {depts: ['AS', 'RE']}
		let safecourse = {depts: ['AS', 'RE']}

		buildDept(course)

		expect(course).to.eql(safecourse)
	})
})
