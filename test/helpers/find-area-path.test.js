import {expect} from 'chai'
import findAreaPath from '../../src/lib/find-area-path'

describe('findAreaPath', () => {
	it('handles apostrophes in the name', () => {
		expect(findAreaPath({name: `Women's and Gender Studies`, type: 'concentration', revision: '2014-15'}))
			.to.equal('concentrations/womens-and-gender-studies/2014-15')
	})

	it('handles the "latest" revision', () => {
		expect(findAreaPath({name: 'Asian Studies', type: 'major', revision: 'latest'}))
			.to.equal('majors/asian-studies/latest')
	})
})
