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
		expect(parse('zero')).toMatchSnapshot()
		expect(parse('one')).toMatchSnapshot()
		expect(parse('two')).toMatchSnapshot()
		expect(parse('three')).toMatchSnapshot()
		expect(parse('four')).toMatchSnapshot()
		expect(parse('five')).toMatchSnapshot()
		expect(parse('six')).toMatchSnapshot()
		expect(parse('seven')).toMatchSnapshot()
		expect(parse('eight')).toMatchSnapshot()
		expect(parse('nine')).toMatchSnapshot()
		expect(parse('ten')).toMatchSnapshot()
	})

	it('may be prefixed by "at most" (≤)', () => {
		expect(parse('at most ten')).toMatchSnapshot()
	})

	it('may be prefixed by "exactly" (==)', () => {
		expect(parse('exactly ten')).toMatchSnapshot()
	})

	it('with no prefix are assumed to be ≥', () => {
		expect(parse('ten')).toMatchSnapshot()
	})
})
