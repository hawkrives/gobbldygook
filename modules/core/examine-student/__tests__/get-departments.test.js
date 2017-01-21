// @flow
import {expect} from 'chai'
import getDepartments from '../get-departments'

describe('getDepartments', () => {
	it('returns the distinct departments from an array of courses', () => {
		const courses = [
			{department: ['ART']},
			{department: ['ART', 'ASIAN']},
			{department: ['CHEM', 'BIO']},
		]

		expect(getDepartments(courses)).to.deep.equal(['ART', 'ASIAN', 'CHEM', 'BIO'])
	})
})
