import {expect} from 'chai'
import hasDepartment from '../../src/helpers/has-department'

describe('hasDepartment', () => {
	it('checks if a course is in a department', () => {
		let course = {depts: ['ASIAN'], num: 175}

		expect(hasDepartment('ASIAN', course)).to.be.true
	})

	it('handles cross-disciplinary courses', () => {
		let course = {depts: ['ASIAN', 'REL'], num: 230}

		expect(hasDepartment('REL', course)).to.be.true
	})

	it('does not care about the ordering of departments', () => {
		let course1 = {depts: ['BIO', 'CHEM'], num: 125}
		let course2 = {depts: ['CHEM', 'BIO'], num: 125}

		expect(hasDepartment('BIO', course1)).to.be.true
		expect(hasDepartment('CHEM', course2)).to.be.true
	})

	it('checks against an array of possible departments', () => {
		let course = {depts: ['ASIAN', 'REL'], num: 230}

		expect(hasDepartment(['REL', 'AMCON'], course)).to.be.true
		expect(hasDepartment(['AMCON', 'GCON'], course)).to.be.false
	})
})
