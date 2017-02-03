import { buildDeptString } from '../build-dept'

describe('buildDeptString', () => {
	it('builds a department string from a single-dept course', () => {
		expect(buildDeptString(['ASIAN'])).toBe('ASIAN')
	})

	it('builds a department string from a multi-department course', () => {
		expect(buildDeptString(['ASIAN', 'REL'])).toBe('ASIAN/REL')
	})

	it('maintains the order of the departments array', () => {
		let BICH = ['BIO', 'CHEM']
		let CHBI = ['CHEM', 'BIO']

		expect(buildDeptString(BICH)).toBe('BIO/CHEM')
		expect(buildDeptString(CHBI)).toBe('CHEM/BIO')
	})

	it('maintains the order of the departments array even after shrinking', () => {
		expect(buildDeptString(['BIOLOGY', 'CHEMISTRY'])).toBe('BIO/CHEM')
		expect(buildDeptString(['CHEMISTRY', 'BIOLOGY'])).toBe('CHEM/BIO')
	})

	it('properly condenses department names into abbrs', () => {
		expect(buildDeptString(['RELIGION'])).toBe('REL')
	})

	it('properly expands department short abbrs into abbrs', () => {
		expect(buildDeptString(['AS', 'RE'])).toBe('ASIAN/REL')
	})

	it('does not modify the departments property', () => {
		let depts = ['AS', 'RE']
		let untouchedDepts = ['AS', 'RE']

		buildDeptString(depts)

		expect(depts).toEqual(untouchedDepts)
	})

	it('returns NONE for empty arguments', () => {
		expect(buildDeptString()).toBe('NONE')
	})

	it('returns NONE for an empty departments list', () => {
		expect(buildDeptString([])).toBe('NONE')
	})
})
