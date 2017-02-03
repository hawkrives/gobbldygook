import getOccurrences from '../get-occurrences'

describe('getOccurrences', () => {
	it('returns a list of occurrences of a course', () => {
		const courses = [
			{ department: ['THEAT'], number: 222 },
			{ department: ['THEAT'], number: 222 },
			{ department: ['ASIAN'], number: 275 },
		]

		const lookingFor = { department: ['THEAT'], number: 222 }

		expect(getOccurrences(lookingFor, courses)).toEqual([
			{ department: ['THEAT'], number: 222 },
			{ department: ['THEAT'], number: 222 },
		])
	})

	it('ignores sections when identifying occurrences', () => {
		const courses = [
			{ department: ['THEAT'], number: 222, section: 'A' },
			{ department: ['THEAT'], number: 222, section: 'B' },
			{ department: ['ASIAN'], number: 275 },
		]

		const lookingFor = { department: ['THEAT'], number: 222 }

		expect(getOccurrences(lookingFor, courses)).toEqual([
			{ department: ['THEAT'], number: 222, section: 'A' },
			{ department: ['THEAT'], number: 222, section: 'B' },
		])
	})
})
