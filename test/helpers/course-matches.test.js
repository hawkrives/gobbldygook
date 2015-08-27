import courseMatches from '../../src/helpers/course-matches'

describe('courseMatches', () => {
	it('checks if a course matches any qualifiers in a list of qualifiers', () => {
		let qualifiers = [
			{deptnum: 'NEURO 239'},
			{deptnum: 'ESTH 290'},
			{deptnum: 'ESTH 376'},
			{deptnum: 'PSYCH 230'},
			{deptnum: 'PSYCH 241'},
			{deptnum: 'PSYCH 247'},
			{deptnum: 'STAT 110'},
			{deptnum: 'STAT 212'},
			{deptnum: 'STAT 214'},
		]

		let course = {deptnum: 'ESTH 290'}

		expect(courseMatches(qualifiers, course)).to.be.true
	})

	it('should be curried', () => {
		let qualifiers = [
			{deptnum: 'NEURO 239'},
			{deptnum: 'ESTH 290'},
			{deptnum: 'ESTH 376'},
			{deptnum: 'PSYCH 230'},
			{deptnum: 'PSYCH 241'},
			{deptnum: 'PSYCH 247'},
			{deptnum: 'STAT 110'},
			{deptnum: 'STAT 212'},
			{deptnum: 'STAT 214'},
		]

		let course = {deptnum: 'ESTH 290'}

		expect(courseMatches(qualifiers)(course)).to.be.true
	})
})
