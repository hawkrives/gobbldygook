import {expect} from 'chai'
import {counter, courseDeclr} from './support'
import {customParser} from './support'
const parse = customParser({allowedStartRules: ['Occurrence']})

describe('OccurrenceExpression', () => {
	it('requires a course to check for occurrences of', () => {
		expect(parse('one occurrence of CSCI 121')).to.deep.equal({
			$type: 'occurrence',
			$count: counter('gte', 1),
			$course: courseDeclr('CSCI 121'),
		})
	})
})
