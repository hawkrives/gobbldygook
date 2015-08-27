import oddIndex from '../../src/helpers/odd-index'

describe('oddIndex', () => {
	it('returns false if the index is even', () => {
		expect(oddIndex(undefined, 2)).to.be.false
	})

	it('returns true if the index is off', () => {
		expect(oddIndex(undefined, 1)).to.be.true
	})

	it('returns false for zero', () => {
		expect(oddIndex(undefined, 0)).to.be.false
	})
})
