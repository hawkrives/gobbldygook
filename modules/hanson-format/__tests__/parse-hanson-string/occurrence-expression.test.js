import {expect} from 'chai'
import {parse} from '../../parse-hanson-string'

describe('OccurrenceExpression', () => {
	it('requires a course to check for occurrences of', () => {
		expect(parse('one occurrence of CSCI 121')).to.deep.equal({
			$type: 'occurrence',
			$count: {$operator: '$gte', $num: 1},
			$course: {
				department: [
					'CSCI',
				],
				number: 121,
			},
		})
	})
})
