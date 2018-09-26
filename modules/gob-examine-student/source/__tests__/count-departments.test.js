import countDepartments from '../count-departments'

describe('countDepartments', () => {
	it('counts the number of distinct departments in an array of courses', () => {
		const courses = [
			{department: 'ART'},
			{department: 'AR/AS'},
			{department: 'AR/AS'},
			{department: 'CH/BI'},
		]
		expect(countDepartments(courses)).toBe(4)
	})
})
