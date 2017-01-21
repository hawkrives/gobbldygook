// @flow
import {expect} from 'chai'
import humanizeOperator from '../humanize-operator'

describe('humanizeOperator', () => {
	it('handles $gte', () => {
		expect(humanizeOperator('$gte')).to.equal('')
	})

	it('handles $lte', () => {
		expect(humanizeOperator('$lte')).to.equal('at most')
	})

	it('handles $eq', () => {
		expect(humanizeOperator('$eq')).to.equal('exactly')
	})

	it('throws on unexpected values', () => {
		expect(() => humanizeOperator('$')).to.throw()
	})
})
