import { customParser, course, qualification } from './parse-hanson-string.support'
const parse = customParser({ allowedStartRules: [ 'Filter' ] })

describe('FilterExpression', () => {
	it('allows filtering by a list of valid courses', () => {
		expect(parse('only courses from (CSCI 121, CSCI 125)')).toEqual({
			$type: 'filter',
			$filterType: 'of',
			$distinct: false,
			$of: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('allows filtering by a where-expression', () => {
		expect(parse('only courses where {dept = ASIAN}')).toEqual({
			$type: 'filter',
			$filterType: 'where',
			$distinct: false,
			$where: qualification('eq', 'dept', 'ASIAN'),
		})
	})

	it('allows a "distinct" modifier', () => {
		expect(parse('only distinct courses from (CSCI 121, CSCI 125)')).toEqual({
			$type: 'filter',
			$filterType: 'of',
			$distinct: true,
			$of: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})
})
