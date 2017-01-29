import { customParser, course, qualification } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Filter' ] })

describe('FilterExpression', () => {
	it('allows filtering by a list of valid courses', () => {
		expect(parse('only courses from (CSCI 121, CSCI 125)')).toMatchSnapshot()
	})

	it('allows filtering by a where-expression', () => {
		expect(parse('only courses where {dept = ASIAN}')).toMatchSnapshot()
	})

	it('allows a "distinct" modifier', () => {
		expect(parse('only distinct courses from (CSCI 121, CSCI 125)')).toMatchSnapshot()
	})
})
