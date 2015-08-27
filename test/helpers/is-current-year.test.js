import isCurrentYear from '../../src/helpers/is-current-year'

describe('isCurrentYear', () => {
	it('checks if a schedule is in the given year', () => {
		expect(isCurrentYear(2012, {year: 2012, semester: 2})).to.be.true
	})
})
