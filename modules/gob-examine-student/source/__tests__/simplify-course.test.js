import simplifyCourse from '../simplify-course'

describe('simplifyCourse', () => {
	it('only uses department, number, and type', () => {
		expect(
			simplifyCourse({
				department: 'CSCI',
				number: 121,
				year: 2014,
				type: 'Research',
			}),
		).toBe('CSCI 121 Research')
	})

	it('adds a distinguishing symbol to FLAC courses', () => {
		expect(
			simplifyCourse({
				department: 'CH/BI',
				number: 121,
				type: 'FLAC',
			}),
		).toBe('CH/BI 121 FLAC')
	})
})
