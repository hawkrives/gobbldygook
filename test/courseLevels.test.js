// tests/courseLevels-test.js
import 'should'

describe('courseLevels', () => {
	import * as courseLevels from '../app/helpers/courseLevels'
	let courses = []

	beforeEach(() => {
		courses = [
			{level: 300},
			{level: 200},
			{level: 100},
			{level: 400},
			{level: 900},
		]
	})

	it('checks if a course is at or above a certain level', () => {
		let coursesAtOrAboveLevel = courseLevels.coursesAtOrAboveLevel

		coursesAtOrAboveLevel(200, courses[0]).should.be.true
		coursesAtOrAboveLevel(200, courses[1]).should.be.true
		coursesAtOrAboveLevel(200, courses[2]).should.be.false
	})

	it('filters a list of courses to only those with a level at or above "x"', () => {
		let onlyCoursesAtOrAboveLevel = courseLevels.onlyCoursesAtOrAboveLevel

		onlyCoursesAtOrAboveLevel(200, courses).should.have.length(4)
	})

	it('checks if a course is at a certain level', () => {
		let coursesAtLevel = courseLevels.coursesAtLevel

		coursesAtLevel(200, courses[0]).should.be.false
		coursesAtLevel(200, courses[1]).should.be.true
		coursesAtLevel(200, courses[2]).should.be.false
	})

	it('filters a list of courses to only those with a level at "x"', () => {
		let onlyCoursesAtLevel = courseLevels.onlyCoursesAtLevel

		onlyCoursesAtLevel(200, courses).should.have.length(1)
	})
})
