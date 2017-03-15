import pluralizeArea from '../pluralize-area'

describe('pluralizeArea', () => {
    it('pluralizes degree to degrees', () => {
        expect(pluralizeArea('degree')).toBe('degrees')
    })

    it('pluralizes major to majors', () => {
        expect(pluralizeArea('major')).toBe('majors')
    })

    it('pluralizes concentration to concentrations', () => {
        expect(pluralizeArea('concentration')).toBe('concentrations')
    })

    it('pluralizes emphasis to emphases', () => {
        expect(pluralizeArea('emphasis')).toBe('emphases')
    })
})
