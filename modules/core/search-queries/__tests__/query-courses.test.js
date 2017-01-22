import { expect } from 'chai'
import { queryCourses } from '../query-courses'

describe('queryCourses', () => {
	it('queries a list of courses', () => {
		let query = {
			departments: [ 'AMCON' ],
			year: [ 2013 ],
		}
		let courses = [
			{ departments: [ 'AMCON' ], year: 2013 },
		]
		expect(queryCourses(query, courses)).to.eql(courses)
	})

	it('properly handles a list of five years', () => {
		let query = {
			year: [ '$OR', 2010, 2011, 2012, 2013, 2014 ],
		}
		let courses = [
			{ departments: [ 'AMCON' ], year: 2013 },
			{ departments: [ 'ASIAN' ], year: 2012 },
		]
		expect(queryCourses(query, courses)).to.eql(courses)
	})
})
