import countDepartments from '../count-departments'

describe('countDepartments', () => {
	it('counts the number of distinct departments in an array of courses', () => {
		const courses = [
			{subject: 'ART'},
			{subject: 'ART'},
			{subject: 'ASIAN'},
			{subject: 'CHEM'},
			{subject: 'BIO'},
		]
		expect(countDepartments(courses)).toBe(4)
	})
})
