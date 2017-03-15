import { sortStudiesByType } from '../sort-studies-by-type'

describe('sortStudiesByType', () => {
    it('sorts a list of areas of study by type', () => {
        const input = [
            { type: 'degree' },
            { type: 'concentration' },
            { type: 'emphasis' },
            { type: 'major' },
        ]

        expect(sortStudiesByType(input)).toMatchSnapshot()
    })
})
