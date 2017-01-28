import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Counter' ] })

describe('counters', () => {
	it('n may be in english from "zero" to "ten"', () => {
		expect(() => parse('zero')).not.toThrow()
		expect(() => parse('one')).not.toThrow()
		expect(() => parse('two')).not.toThrow()
		expect(() => parse('three')).not.toThrow()
		expect(() => parse('four')).not.toThrow()
		expect(() => parse('five')).not.toThrow()
		expect(() => parse('six')).not.toThrow()
		expect(() => parse('seven')).not.toThrow()
		expect(() => parse('eight')).not.toThrow()
		expect(() => parse('nine')).not.toThrow()
		expect(() => parse('ten')).not.toThrow()
	})

	it('returns numerical values for the parsed properties', () => {
		expect(parse('zero')).toEqual({ $num: 0, $operator: '$gte' })
		expect(parse('one')).toEqual({ $num: 1, $operator: '$gte' })
		expect(parse('two')).toEqual({ $num: 2, $operator: '$gte' })
		expect(parse('three')).toEqual({ $num: 3, $operator: '$gte' })
		expect(parse('four')).toEqual({ $num: 4, $operator: '$gte' })
		expect(parse('five')).toEqual({ $num: 5, $operator: '$gte' })
		expect(parse('six')).toEqual({ $num: 6, $operator: '$gte' })
		expect(parse('seven')).toEqual({ $num: 7, $operator: '$gte' })
		expect(parse('eight')).toEqual({ $num: 8, $operator: '$gte' })
		expect(parse('nine')).toEqual({ $num: 9, $operator: '$gte' })
		expect(parse('ten')).toEqual({ $num: 10, $operator: '$gte' })
	})

	it('may be prefixed by "at most" (≤)', () => {
		expect(parse('at most ten')).toEqual({ $num: 10, $operator: '$lte' })
	})

	it('may be prefixed by "exactly" (==)', () => {
		expect(parse('exactly ten')).toEqual({ $num: 10, $operator: '$eq' })
	})

	it('with no prefix are assumed to be ≥', () => {
		expect(parse('ten')).toEqual({ $num: 10, $operator: '$gte' })
	})
})
