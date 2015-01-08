// sto-areas/test/lib-acrossAtLeastTwoDepartments.test.js
import acrossAtLeastTwoDepartments from '../lib/acrossAtLeastTwoDepartments'

describe('Library - acrossAtLeastTwoDepartments', () => {
	it('checks that a set of courses spans at least two departments', () => {
		let courses = [
			{depts: ['ASIAN']},
			{depts: ['AMCON']},
		]

		acrossAtLeastTwoDepartments(courses).should.be.true
	})

	it('fails if the courses don\'t cover two departments', () => {
		let courses = [
			{depts: ['ASIAN']},
			{depts: ['ASIAN']},
		]

		acrossAtLeastTwoDepartments(courses).should.be.false
	})

	it('allows one course to span multiple departments', () => {
		let courses = [{depts: ['ASIAN', 'REL']}]

		acrossAtLeastTwoDepartments(courses).should.be.true
	})
})
