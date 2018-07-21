import {countTerms} from '../count-terms'

describe('countTerms', () => {
	it('counts the number of terms in an array of courses', () => {
		const courses = [
			{year: 2010, semester: 'FA'},
			{year: 2010, semester: 'WI'},
			{year: 2010, semester: 'SP'},
		]
		expect(countTerms(courses)).toBe(3)
	})

	it('skips duplicate terms', () => {
		const courses = [
			{year: 2010, semester: 'FA'},
			{year: 2010, semester: 'FA'},
			{year: 2010, semester: 'SP'},
		]
		expect(countTerms(courses)).toBe(2)
	})
})
