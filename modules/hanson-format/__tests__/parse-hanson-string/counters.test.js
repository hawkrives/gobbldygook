import {expect} from 'chai'
import {parse} from '../../parse-hanson-string'

describe('counters', () => {
	it('n may be in english from "zero" to "ten"', () => {
		expect(() => parse('zero occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('one occurrence of AAAA 101')).to.not.throw()
		expect(() => parse('two occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('three occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('four occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('five occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('six occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('seven occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('eight occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('nine occurrences of AAAA 101')).to.not.throw()
		expect(() => parse('ten occurrences of AAAA 101')).to.not.throw()
	})

	it('may be prefixed by "at most" (≤)', () => {
		expect(parse('at most ten occurrences of AAAA 101'))
			.to.have.property('$count').deep.equal({$num: 10, $operator: '$lte'})
	})

	it('may be prefixed by "exactly" (==)', () => {
		expect(parse('exactly ten occurrences of AAAA 101'))
			.to.have.property('$count').deep.equal({$num: 10, $operator: '$eq'})
	})

	it('with no prefix are assumed to be ≥', () => {
		expect(parse('ten occurrences of AAAA 101'))
			.to.have.property('$count').deep.equal({$num: 10, $operator: '$gte'})
	})
})
