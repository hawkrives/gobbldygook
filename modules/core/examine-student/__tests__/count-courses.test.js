// @flow
import {expect} from 'chai'
import countCourses from '../count-courses'

describe('countCourses', () => {
	it('counts the number of distinct courses in an array', () => {
		const courses = [
			{department: ['ASIAN', 'ART'], number: 111},
			{department: ['ASIAN', 'ART'], number: 112},
		]

		expect(countCourses(courses)).to.equal(2)
	})

	it('does not just return the number of courses in the array', () => {
		const courses = [
			{department: ['ASIAN', 'ART'], number: 111},
			{department: ['ASIAN', 'ART'], number: 111},
		]

		expect(countCourses(courses)).to.equal(1)
	})
})
