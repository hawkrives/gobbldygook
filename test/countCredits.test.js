// tests/countCredits-test.js
import 'should'

describe('countCredits', () => {
	it('counts the number of credits in a list of courses', () => {
		import countCredits from 'app/helpers/countCredits'
		let courses = [
			{credits: 1},
			{credits: 0.25},
			{credits: 0.5},
			{credits: 0.75},
			{credits: 1},
		]

		countCredits(courses).should.equal(3.5)
	})
})
