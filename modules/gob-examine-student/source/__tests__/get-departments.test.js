import getDepartments from '../get-departments'

describe('getDepartments', () => {
	it('returns the distinct departments from an array of courses', () => {
		const courses = [
			{department: 'ART'},
			{department: 'AR/AS'},
			{department: 'CH/BI'},
			{department: 'CH/BI'},
		]

		expect(getDepartments(courses)).toEqual(['ART', 'ASIAN', 'CHEM', 'BIO'])
	})
})
