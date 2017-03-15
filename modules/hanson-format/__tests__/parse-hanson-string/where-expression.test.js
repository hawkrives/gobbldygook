import { customParser } from './parse-hanson-string.support'
const parseWhere = customParser({ allowedStartRules: ['Where'] })
const parseQualifier = customParser({ allowedStartRules: ['Qualifier'] })

describe('WhereExpression', () => {
    it('describes courses "where" a fact is true', () => {
        expect(parseWhere('one course where {a = 1}')).toMatchSnapshot()
    })

    it('may require distinct course', () => {
        expect(parseWhere('two distinct courses where {a = 1}')).toMatchSnapshot()
    })
})

describe('qualifiers syntax', () => {
    it('key must be a string', () => {
        expect(() => parseQualifier('{a = b}')).not.toThrow()
        expect(() => parseQualifier('{1 = b}')).toThrowError('Expected qualification-or but "1" found.')
    })

    it('value may be a number (coerced to integers)', () => {
        expect(parseQualifier('{a = 1}')).toMatchSnapshot()
    })

    it('value may include hyphens', () => {
        expect(parseQualifier('{a = BTS-B}')).toMatchSnapshot()
    })

    it('value may include underscores', () => {
        expect(parseQualifier('{a = BTS_B}')).toMatchSnapshot()
    })
})

describe('qualification value may be compared by', () => {
    it('= (single equals)', () => {
        expect(parseQualifier('{a = b}')).toMatchSnapshot()
    })

    it('== (double equals)', () => {
        expect(parseQualifier('{a == b}')).toMatchSnapshot()
    })

    it('!= (not equal to)', () => {
        expect(parseQualifier('{a != b}')).toMatchSnapshot()
    })

    it('< (less than)', () => {
        expect(parseQualifier('{a < b}')).toMatchSnapshot()
    })

    it('<= (less than or equal to)', () => {
        expect(parseQualifier('{a <= b}')).toMatchSnapshot()
    })

    it('> (greater than)', () => {
        expect(parseQualifier('{a > b}')).toMatchSnapshot()
    })

    it('=> (greater than or equal to)', () => {
        expect(parseQualifier('{a >= b}')).toMatchSnapshot()
    })
})

describe('qualifiers can use boolean logic', () => {
    it('can be separated by &', () => {
        expect(parseQualifier('{a = b & c = d}')).toMatchSnapshot()
    })
    it('can be separated by |', () => {
        expect(parseQualifier('{a = b | c = d}')).toMatchSnapshot()
    })
    it('can used in boolean logic: a & b | c', () => {
        expect(parseQualifier('{a = b & c = d | c = e}')).toMatchSnapshot()
    })
    it('can used in boolean logic: a | b & c', () => {
        expect(parseQualifier('{a = b | c = d & c = e}')).toMatchSnapshot()
    })
    it('boolean logic can be overridden by parens: (a | b) & c', () => {
        expect(parseQualifier('{ dept = THEAT & (num = 233 | num = 253) }')).toMatchSnapshot()
    })


    it('value may be a boolean and-list', () => {
        expect(parseQualifier('{ dept = THEAT & (num = (233 & 253) ) }')).toMatchSnapshot()
    })
    it('value may be a boolean or-list', () => {
        expect(parseQualifier('{ dept = THEAT & (num = (233 | 253) ) }')).toMatchSnapshot()
    })
})

describe('nested qualifiers', () => {
    xit('value may rely on a nested qualifier', () => {})

    it('function may optionally include a space between the name and the paren', () => {
        const withSpace = parseQualifier('{ year = max (year) from courses where {gereqs=year} }')
        const noSpace = parseQualifier('{ year = max(year) from courses where {gereqs=year} }')

        expect(withSpace).toMatchSnapshot()
        expect(noSpace).toMatchSnapshot()

        expect(withSpace).toEqual(noSpace)
    })
})
