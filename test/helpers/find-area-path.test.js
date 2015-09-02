import findAreaPath from '../../src/lib/find-area-path'

describe('findAreaPath', () => {
	it('handles apostrophes in the name', () => {
		expect(findAreaPath({name: `Women's and Gender Studies`, type: 'concentration'}))
			.to.equal('concentrations/womens-and-gender-studies.yaml')
	})
})
