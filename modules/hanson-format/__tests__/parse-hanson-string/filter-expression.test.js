import {expect} from 'chai'
import {customParser, course, qualification} from './support'
const parse = customParser({allowedStartRules: ['Filter']})

describe('FilterExpression', () => {
	it('allows filtering by a list of valid courses', () => {
		expect(parse('only courses from (CSCI 121, CSCI 125)')).to.deep.equal({
			$type: 'filter',
			$distinct: false,
			$of: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})

	it('allows filtering by a where-expression', () => {
		expect(parse('only courses where {dept = ASIAN}')).to.deep.equal({
			$type: 'filter',
			$distinct: false,
			$where: qualification('eq', 'dept', 'ASIAN'),
		})
	})

	it('allows a "distinct" modifier', () => {
		expect(parse('only distinct courses from (CSCI 121, CSCI 125)')).to.deep.equal({
			$type: 'filter',
			$distinct: true,
			$of: [
				course('CSCI 121'),
				course('CSCI 125'),
			],
		})
	})
})
