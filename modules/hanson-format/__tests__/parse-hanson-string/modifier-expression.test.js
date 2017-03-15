import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: ['Modifier'] })

describe('ModifierExpression', () => {
    it('can count courses', () => {
        expect(parse('one course from children')).toMatchSnapshot()
    })

    it('can count credits', () => {
        expect(parse('one credit from children')).toMatchSnapshot()
    })

    it('can count departments', () => {
        expect(parse('one department from children')).toMatchSnapshot()
    })

    it('will refuse to count departments from courses-where', () => {
        expect(() => parse('one department from children')).not.toThrow()
        expect(() => parse('one department from filter')).not.toThrow()
        expect(() =>
            parse('one department from courses where {a = b}')).toThrow(
            'cannot use a modifier with "departments"'
        )
    })

    it('can count from children', () => {
        expect(parse('one course from children')).toMatchSnapshot()
    })

    it('can count from specified children', () => {
        expect(parse('one course from (A, B)')).toMatchSnapshot()

        expect(
            parse('one course from (BTS-B, B)', {
                abbreviations: { 'BTS-B': 'Bible' },
            })
        ).toMatchSnapshot()
    })

    it('can count from filter', () => {
        expect(parse('one course from filter')).toMatchSnapshot()
    })

    it('can count from filter, then apply a where-clause', () => {
        expect(parse('one course from filter where {a = b}')).toMatchSnapshot()
    })

    it('can count from a where-statement', () => {
        expect(
            parse('one course from courses where {a = b}')
        ).toMatchSnapshot()
    })

    it('can count from a where-statement, with the input filtered by all children', () => {
        expect(
            parse('one course from children where {a = b}')
        ).toMatchSnapshot()
    })

    it('can count from a where-statement, with the input filtered by some children', () => {
        expect(parse('one course from (A, B) where {a = b}')).toMatchSnapshot()
    })

    it('will refuse to count anything but courses from children-where', () => {
        expect(() =>
            parse('one department from children where {a = b}')).toThrow(
            'must use "courses from" with "children where"'
        )

        expect(() => parse('one credit from children where {a = b}')).toThrow(
            'must use "courses from" with "children where"'
        )

        expect(() =>
            parse('one course from children where {a = b}')).not.toThrow()
    })
})
