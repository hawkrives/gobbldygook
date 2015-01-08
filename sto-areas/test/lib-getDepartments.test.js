// sto-areas/test/lib-countGeneds.test.js
import getDepartments from '../lib/getDepartments'

describe('Library - getDepartments', () => {
	it('plucks departments from a list of courses', () => {
		let courses = [
			{depts: ['ASIAN']},
			{depts: ['AMCON']},
		]

		getDepartments(courses).should.eql(['ASIAN', 'AMCON'])
	})

	it('de-duplicates the gathered departments', () => {
		let courses = [
			{depts: ['ASIAN', 'AMCON']},
			{depts: ['AMCON']},
		]

		getDepartments(courses).should.eql(['ASIAN', 'AMCON'])
	})
})
