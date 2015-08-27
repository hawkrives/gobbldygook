import checkCoursesFor from '../../src/helpers/check-courses-for'

describe('checkCoursesFor', () => {
	it('evaluates whether any courses in a list of courses pass a check', () => {
		let courses = [
			{dept: 'AMCON', crsid: 1},
		]

		expect(checkCoursesFor(courses, {crsid: 1})).to.be.true
	})

	it('doesn\'t always return true', () => {
		let courses = [
			{dept: 'AMCON', crsid: 2},
		]

		expect(checkCoursesFor(courses, {crsid: 1})).to.be.false
	})

	it('requires two parameters', () => {
		let courses = []

		expect(checkCoursesFor(courses)).to.be.false
	})
})
