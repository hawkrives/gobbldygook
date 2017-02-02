import { customParser } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: ['Or'] })

describe('BooleanExpression', () => {
	it('parses courses separated by | as being or-d', () => {
		expect(parse('CSCI 121 | CSCI 125')).toMatchSnapshot()
	})

	it('parses courses separated by & as being and-d', () => {
		expect(parse('CSCI 121 & CSCI 125')).toMatchSnapshot()
	})

	it('parses courses with no departments after an prior department', () => {
		expect(parse('CSCI 121 | 125')).toMatchSnapshot()
	})

	it('changes departments when given a new one', () => {
		expect(parse('CSCI 121 | PSCI 125')).toMatchSnapshot()
	})

	it('allows several &-d courses in a row', () => {
		expect(parse('CSCI 121 & 125 & 126 & 123')).toMatchSnapshot()
	})

	it('allows several |-d courses in a row', () => {
		expect(parse('CSCI 121 | 125 | 126 | 123')).toMatchSnapshot()
	})

	it('keeps duplicates in a list of courses', () => {
		expect(parse('CSCI 121 | 121 | 125')).toMatchSnapshot()
	})

	it('allows a & b | c – boolean logic for courses', () => {
		expect(parse('CSCI 121 & 122 | 123')).toMatchSnapshot()
	})

	it('allows a | b & c – boolean logic for courses', () => {
		expect(parse('CSCI 121 | 122 & 123')).toMatchSnapshot()
	})

	it('supports parentheses to control order-of-operations - (a | b) & c', () => {
		expect(parse('(CSCI 121 | 122) & 123')).toMatchSnapshot()
	})
})
