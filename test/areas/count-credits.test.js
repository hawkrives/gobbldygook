import {expect} from 'chai'
import countCredits from '../../src/area-tools/count-credits'
import {List} from 'immutable'

describe('countCredits', () => {
	it('counts the number of credits in an array of courses', () => {
		const courses = [
			{credits: 1.0},
			{credits: 1.5},
			{credits: 1.5},
		]
		expect(countCredits(courses)).to.equal(4.0)
	})

	it('counts the number of credits in an immutable.list of courses', () => {
		const courses = List([
			{credits: 1.0},
			{credits: 1.5},
			{credits: 1.5},
		])
		expect(countCredits(courses)).to.equal(4.0)
	})
})
