// sto-areas/majors/test/computerScienceMajor.test.js
import compSci from 'sto-areas/major/computerScienceMajor'

describe('Major - Computer Science', () => {
	describe('foundationCourses', () => {
		it('checks for courses that fulfill the foundational requirements', () => {
			let validCourses = [
				{deptnum: 'CSCI 121'},
				{deptnum: 'CSCI 251'}, {deptnum: 'CSCI 252'}, {deptnum: 'CSCI 241'},
				{deptnum: 'MATH 282', term: 20141}
			]
			let expectedResult = {
				title: 'Foundation',
				description: '- one of Computer Science 121 or 125;\n- Computer Science 241, 251, and 252;\n- one of Computer Science 231 or Math 232 or Math 252.',
				result: true,
				type: 'array/boolean',
				details: [
					{
						title: 'CS1',
						result: true,
					},
					{
						title: 'Design',
						result: true,
					},
					{
						title: 'Proof Writing',
						result: true,
					},
				]
			}

			compSci.foundationCourses(validCourses).should.eql(expectedResult)
		})
	})
})
