import { expect } from 'chai'
import computeCountWithOperator from '../compute-count-with-operator'

describe('computeCountWithOperator', () => {
	it('throws on operators other than $eq, $lte, or $gte', () => {
		expect(() => computeCountWithOperator({ comparator: '$invalid' })).to.throw(TypeError)
	})

	it('computes $lte', () => {
		expect(computeCountWithOperator({ comparator: '$lte', has: 1, needs: 1 })).to.be.true
		expect(computeCountWithOperator({ comparator: '$lte', has: 1, needs: 0 })).to.be.false
		expect(computeCountWithOperator({ comparator: '$lte', has: 0, needs: 1 })).to.be.true
	})

	it('computes $gte', () => {
		expect(computeCountWithOperator({ comparator: '$gte', has: 1, needs: 1 })).to.be.true
		expect(computeCountWithOperator({ comparator: '$gte', has: 1, needs: 0 })).to.be.true
		expect(computeCountWithOperator({ comparator: '$gte', has: 0, needs: 1 })).to.be.false
	})

	it('computes $eq', () => {
		expect(computeCountWithOperator({ comparator: '$eq', has: 1, needs: 1 })).to.be.true
		expect(computeCountWithOperator({ comparator: '$eq', has: 1, needs: 0 })).to.be.false
		expect(computeCountWithOperator({ comparator: '$eq', has: 0, needs: 1 })).to.be.false
	})
})
