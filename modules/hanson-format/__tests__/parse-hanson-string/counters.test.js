import { expect } from 'chai'
import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Counter' ] })

describe('counters', () => {
	it('n may be in english from "zero" to "ten"', () => {
		expect(() => parse('zero')).to.not.throw()
		expect(() => parse('one')).to.not.throw()
		expect(() => parse('two')).to.not.throw()
		expect(() => parse('three')).to.not.throw()
		expect(() => parse('four')).to.not.throw()
		expect(() => parse('five')).to.not.throw()
		expect(() => parse('six')).to.not.throw()
		expect(() => parse('seven')).to.not.throw()
		expect(() => parse('eight')).to.not.throw()
		expect(() => parse('nine')).to.not.throw()
		expect(() => parse('ten')).to.not.throw()
	})

	it('returns numerical values for the parsed properties', () => {
		expect(parse('zero')).to.deep.equal({ $num: 0, $operator: '$gte' })
		expect(parse('one')).to.deep.equal({ $num: 1, $operator: '$gte' })
		expect(parse('two')).to.deep.equal({ $num: 2, $operator: '$gte' })
		expect(parse('three')).to.deep.equal({ $num: 3, $operator: '$gte' })
		expect(parse('four')).to.deep.equal({ $num: 4, $operator: '$gte' })
		expect(parse('five')).to.deep.equal({ $num: 5, $operator: '$gte' })
		expect(parse('six')).to.deep.equal({ $num: 6, $operator: '$gte' })
		expect(parse('seven')).to.deep.equal({ $num: 7, $operator: '$gte' })
		expect(parse('eight')).to.deep.equal({ $num: 8, $operator: '$gte' })
		expect(parse('nine')).to.deep.equal({ $num: 9, $operator: '$gte' })
		expect(parse('ten')).to.deep.equal({ $num: 10, $operator: '$gte' })
	})

	it('may be prefixed by "at most" (≤)', () => {
		expect(parse('at most ten')).to.deep.equal({ $num: 10, $operator: '$lte' })
	})

	it('may be prefixed by "exactly" (==)', () => {
		expect(parse('exactly ten')).to.deep.equal({ $num: 10, $operator: '$eq' })
	})

	it('with no prefix are assumed to be ≥', () => {
		expect(parse('ten')).to.deep.equal({ $num: 10, $operator: '$gte' })
	})
})
