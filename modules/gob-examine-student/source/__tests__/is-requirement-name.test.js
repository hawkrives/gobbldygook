import isRequirementName from '../is-requirement-name'

describe('isRequirementName checks if a string is a requirement name', () => {
    it('can contain hyphens', () => {
        expect(isRequirementName('BTS-B')).toBe(true)
    })

    it('may be a single letter', () => {
        expect(isRequirementName('BTS-B')).toBe(true)
    })

    it('may be a single number', () => {
        expect(isRequirementName('0')).toBe(true)
    })

    it('may include spaces', () => {
        expect(isRequirementName('Studio Art')).toBe(true)
    })

    it('must not begin with an underscore', () => {
        expect(isRequirementName('_A0')).toBe(false)
    })

    it('must be one or more chars long', () => {
        expect(isRequirementName('')).toBe(false)
    })
})
