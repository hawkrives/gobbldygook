import { expect } from 'chai'
import { sortStudiesByType } from '../sort-studies-by-type'

describe('sortStudiesByType', () => {
  it('sorts a list of areas of study by type', () => {
    const input = [
			{ type: 'degree' },
			{ type: 'concentration' },
			{ type: 'emphasis' },
			{ type: 'major' },
    ]
    const expected = [
			{ type: 'degree' },
			{ type: 'major' },
			{ type: 'concentration' },
			{ type: 'emphasis' },
    ]
    expect(sortStudiesByType(input)).to.deep.equal(expected)
  })
})

