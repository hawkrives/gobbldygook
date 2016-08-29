import {expect} from 'chai'
import queryCourses from '../../src/helpers/query-courses'

describe('queryCourses', () => {
	it('queries a list of courses', () => {
		let query = {
			depts: ['AMCON'],
			year: [2013],
		}
		let courses = [
			{depts: ['AMCON'], year: 2013},
		]
		expect(queryCourses(query, courses)).to.eql(courses)
	})

	it('properly handles a list of five years', () => {
		let query = {
			year: ['$OR', 2010, 2011, 2012, 2013, 2014],
		}
		let courses = [
			{depts: ['AMCON'], year: 2013},
			{depts: ['ASIAN'], year: 2012},
		]
		expect(queryCourses(query, courses)).to.eql(courses)
	})
})
