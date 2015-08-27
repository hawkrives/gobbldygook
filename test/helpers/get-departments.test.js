import getDepartments from '../../src/helpers/get-departments'

describe('getDepartments', () => {
	it('plucks departments from a list of courses', () => {
		let courses = [
			{depts: ['ASIAN']},
			{depts: ['AMCON']},
		]

		expect(getDepartments(courses)).to.eql(['ASIAN', 'AMCON'])
	})

	it('de-duplicates the gathered departments', () => {
		let courses = [
			{depts: ['ASIAN', 'AMCON']},
			{depts: ['AMCON']},
		]

		expect(getDepartments(courses)).to.eql(['ASIAN', 'AMCON'])
	})
})
