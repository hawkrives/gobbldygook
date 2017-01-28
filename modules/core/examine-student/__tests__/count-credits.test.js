import { expect } from 'chai'
import { countCredits } from '../count-credits'

describe('countCredits', () => {
	it('counts the number of credits in an array of courses', () => {
		const courses = [
			{ credits: 1.0 },
			{ credits: 1.5 },
			{ credits: 1.5 },
		]
		expect(countCredits(courses)).to.equal(4.0)
	})
})
