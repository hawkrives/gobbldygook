import getDepartments from '../get-departments'

describe('getDepartments', () => {
	it('returns the distinct departments from an array of courses', () => {
		const courses = [
			{subject: 'ART'},
			{subject: 'ART'},
			{subject: 'CHEM'},
			{subject: 'BIO'},
		]

		expect(getDepartments(courses)).toEqual(['ART', 'CHEM', 'BIO'])
	})
})
