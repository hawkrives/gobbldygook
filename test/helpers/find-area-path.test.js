import findAreaPath from '../../src/lib/find-area-path'

describe('findAreaPath', () => {
	it('handles apostrophes in the name', () => {
		expect(findAreaPath({name: `Women's and Gender Studies`, type: 'concentration', revision: '2014-15'}))
			.to.equal('concentrations/womens-and-gender-studies-2014-15')
	})
})
