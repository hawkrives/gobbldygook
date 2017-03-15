import { customParser } from './parse-hanson-string.support'
const parseReference = customParser({ allowedStartRules: ['Reference'] })
const parseRequirementTitle = customParser({
    allowedStartRules: ['RequirementTitle'],
})

describe('ReferenceExpression', () => {
    it('can reference a requirement', () => {
        expect(parseReference('BTS-B')).toMatchSnapshot()
    })

    it('handles a full requirement title', () => {
        const actual = parseReference('Biblical Studies (BTS-B)')
        expect(actual).toMatchSnapshot()

        expect(actual.$requirement).toBeDefined()
        expect(actual.$requirement).toBe('Biblical Studies (BTS-B)')
    })

    it('returns a full requirement title when given an abbreviation', () => {
        const actual = parseReference('BTS-B', {
            abbreviations: { 'BTS-B': 'Biblical Studies (BTS-B)' },
        })
        expect(actual).toMatchSnapshot()

        expect(actual.$requirement).toBeDefined()
        expect(actual.$requirement).toBe('Biblical Studies (BTS-B)')
    })

    it('returns a full requirement title when given the title-minus-abbreviation', () => {
        const actual = parseReference('Biblical Studies', {
            titles: { 'Biblical Studies': 'Biblical Studies (BTS-B)' },
        })
        expect(actual).toMatchSnapshot()

        expect(actual.$requirement).toBeDefined()
        expect(actual.$requirement).toBe('Biblical Studies (BTS-B)')
    })
})

describe('titles may include', () => {
    it('letters "A-Z"', () => {
        expect(() => parseRequirementTitle('ABC')).not.toThrow()
        expect(() => parseRequirementTitle('A')).not.toThrow()
    })

    it('numbers "0-9"', () => {
        expect(() => parseRequirementTitle('A0')).not.toThrow()
        expect(() => parseRequirementTitle('0')).not.toThrow()
        expect(() => parseRequirementTitle('0A')).not.toThrow()
    })

    it('hyphen "-"', () => {
        expect(() => parseRequirementTitle('ABC-D')).not.toThrow()
    })

    it('underscore "_"', () => {
        expect(() => parseRequirementTitle('ABC_D')).not.toThrow()
    })

    it('may only begin with a letter or number', () => {
        expect(() => parseRequirementTitle('0A')).not.toThrow()
        expect(() => parseRequirementTitle('A0')).not.toThrow()
        expect(() => parseRequirementTitle('_A0')).toThrowError(
            'Expected [A-Z0-9] but "_" found.'
        )
        expect(() => parseRequirementTitle('-A0')).toThrowError(
            'Expected [A-Z0-9] but "-" found.'
        )
        expect(parseRequirementTitle('A0')).toBe('A0')
    })
})
