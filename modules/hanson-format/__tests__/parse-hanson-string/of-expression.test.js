import { customParser, course, reference, boolean } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Of' ] })

describe('OfExpression', () => {
	it('supports of statements of the form "n of ()"', () => {
		expect(() => parse('one of (CHEM 121)')).not.toThrow()
	})

	xit('allows "n" to be a number', () => {
		expect(() => parse('1 of (A, B, C)')).not.toThrow()
	})

	it('allows "n" to be a counter', () => {
		expect(() => parse('three of (A, B, C)')).not.toThrow()
	})

	it('allows "n" to be "all"', () => {
		expect(() => parse('all of (A, B, C)')).not.toThrow()
	})

	it('if n is "all", it is the number of items in the of-parens', () => {
		const result = parse('all of (A, B, C)')
		expect(result.$count).toBeDefined()
		expect(result.$count).toEqual({ $operator: '$eq', $num: 3, $was: 'all' })
	})

	it('allows "n" to be "any"', () => {
		expect(() => parse('any of (A, B, C)')).not.toThrow()
	})

	it('allows "n" to be "none"', () => {
		expect(() => parse('none of (A, B, C)')).not.toThrow()
	})

	it('supports boolean statements within the parens', () => {
		expect(parse('one of (A | B & C, D)')).toEqual({
			$type: 'of',
			$count: { $operator: '$gte', $num: 1 },
			$of: [
				boolean('or', [
					reference('A'),
					boolean('and', [
						reference('B'),
						reference('C'),
					]),
				]),
				reference('D'),
			],
		})
	})

	it('supports courses within the parens', () => {
		expect(parse('one of (CSCI 121)')).toEqual({
			$type: 'of',
			$count: { $operator: '$gte', $num: 1 },
			$of: [
				course('CSCI 121'),
			],
		})
	})

	it('supports where-clauses within the parens', () => {
		const actual = parse('one of (CSSCI 121, one course where {gereqs = WRI})')
		expect(actual.$of).toBeDefined()
		expect(actual.$of).toHaveLength(2)
	})

	it('supports occurrences within the parens', () => {
		const actual = parse('one of (two occurrences of CSCI 121, CSCI 308)')
		expect(actual.$of).toBeDefined()
		expect(actual.$of).toHaveLength(2)
	})

	it('supports references within the parens', () => {
		const actual = parse('one of (A, B, C, D)')
		expect(actual.$of).toBeDefined()
		expect(actual.$of).toHaveLength(4)
	})

	it('supports modifiers within the parens', () => {
		const actual = parse('one of (two courses from children, two courses from filter, two credits from courses where {year <= 2016})')
		expect(actual.$of).toBeDefined()
		expect(actual.$of).toHaveLength(3)
	})

	xit('requires that items be separated by commas', () => {})

	it('supports trailing commas', () => {
		expect(parse('one of (121,)')).toEqual({
			$type: 'of',
			$count: { $operator: '$gte', $num: 1 },
			$of: [
				{ $type: 'course', $course: { number: 121 } },
			],
		})
	})

	it('throws an error if more items are required than are provided', () => {
		expect(() => parse('three of (CSCI 121, 125)'))
			.toThrow(`you requested 3 items, but only gave 2 options (${JSON.stringify([ course('CSCI 121'), course('CSCI 125') ])})`)
	})
})
