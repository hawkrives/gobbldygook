import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: ['Of'] })
const course = customParser({ allowedStartRules: ['Course'] })

describe('OfExpression', () => {
    it('supports of-statements of the form "n of ()"', () => {
        expect(parse('one of (CHEM 121)')).toMatchSnapshot()
    })

    it('prohibits "n" from being a number', () => {
        expect(() => parse('1 of (A, B, C)')).toThrow()
    })

    it('allows "n" to be a counter', () => {
        expect(parse('three of (A, B, C)')).toMatchSnapshot()
    })

    it('allows "n" to be "all"', () => {
        expect(parse('all of (A, B, C)')).toMatchSnapshot()
    })

    it('if n is "all", it is the number of items in the of-parens', () => {
        const result = parse('all of (A, B, C)')
        expect(result).toMatchSnapshot()
        expect(result.$count).toBeDefined()
        expect(result.$count).toEqual({
            $operator: '$eq',
            $num: 3,
            $was: 'all',
        })
    })

    it('allows "n" to be "any"', () => {
        expect(parse('any of (A, B, C)')).toMatchSnapshot()
    })

    it('allows "n" to be "none"', () => {
        expect(parse('none of (A, B, C)')).toMatchSnapshot()
    })

    it('supports boolean statements within the parens', () => {
        expect(parse('one of (A | B & C, D)')).toMatchSnapshot()
    })

    it('supports courses within the parens', () => {
        expect(parse('one of (CSCI 121)')).toMatchSnapshot()
    })

    it('supports where-clauses within the parens', () => {
        const actual = parse(
            'one of (CSCI 121, one course where {gereqs = WRI})'
        )
        expect(actual).toMatchSnapshot()

        expect(actual.$of).toBeDefined()
        expect(actual.$of).toHaveLength(2)
    })

    it('supports occurrences within the parens', () => {
        const actual = parse('one of (two occurrences of CSCI 121, CSCI 308)')
        expect(actual).toMatchSnapshot()

        expect(actual.$of).toBeDefined()
        expect(actual.$of).toHaveLength(2)
    })

    it('supports references within the parens', () => {
        const actual = parse('one of (A, B, C, D)')
        expect(actual).toMatchSnapshot()

        expect(actual.$of).toBeDefined()
        expect(actual.$of).toHaveLength(4)
    })

    it('supports modifiers within the parens', () => {
        const actual = parse(
            'one of (two courses from children, two courses from filter, two credits from courses where {year <= 2016})'
        )
        expect(actual).toMatchSnapshot()

        expect(actual.$of).toBeDefined()
        expect(actual.$of).toHaveLength(3)
    })

    xit('requires that items be separated by commas', () => {})

    it('supports trailing commas', () => {
        expect(parse('one of (121,)')).toMatchSnapshot()
    })

    it('throws an error if more items are required than are provided', () => {
        expect(() => parse('three of (CSCI 121, 125)')).toThrow(
            `you requested 3 items, but only gave 2 options (${JSON.stringify([
                course('CSCI 121'),
                course('CSCI 125'),
            ])})`
        )
    })
})
