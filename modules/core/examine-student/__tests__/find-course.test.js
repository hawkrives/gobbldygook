import {expect} from 'chai'
import findCourse from '../find-course'

describe('findCourse', () => {
	it('finds a course in a list of courses', () => {
		const courses = [
			{department: ['THEAT'], number: 222, section: 'A'},
			{department: ['THEAT'], number: 222},
			{department: ['ASIAN'], number: 275},
		]

		const lookingFor = {department: ['THEAT'], number: 222, section: 'A'}

		expect(findCourse(lookingFor, courses)).to.equal(courses[0])
	})

	it('requires the found course to have at least all of the properties of the query', () => {
		const courses = [
			{department: ['THEAT'], number: 222, section: 'A'},
			{department: ['THEAT'], number: 222},
			{department: ['ASIAN'], number: 275},
		]

		const lookingFor = {department: ['THEAT'], number: 222}

		expect(findCourse(lookingFor, courses)).to.equal(courses[0])
	})
})
