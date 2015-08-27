import evenIndex from '../../src/helpers/even-index'

describe('evenIndex', () => {
	it('returns true if the index is even', () => {
		expect(evenIndex(undefined, 2)).to.be.true
	})

	it('returns false if the index is off', () => {
		expect(evenIndex(undefined, 1)).to.be.false
	})

	it('returns true for zero', () => {
		expect(evenIndex(undefined, 0)).to.be.true
	})
})
