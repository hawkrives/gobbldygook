import { expect } from 'chai'
import { findMissingNumberBinarySearch } from '../find-missing-number-binary-search'

describe('findMissingNumberBinarySearch', () => {
	it('takes a list of numbers and finds the first gap', () => {
		expect(findMissingNumberBinarySearch([ 1, 2, 3 ])).to.equal(null)
		expect(findMissingNumberBinarySearch([ 1, 2, 3 ])).to.not.equal(4)

		expect(findMissingNumberBinarySearch([ 1, 2, 3, 5 ])).to.equal(4)
		expect(findMissingNumberBinarySearch([ 1, 3, 4, 5 ])).to.equal(2)
		expect(findMissingNumberBinarySearch([ 1, 2, 4, 5, 6, 7, 8 ])).to.equal(3)
	})

	it('returns null if there is no gap', () => {
		expect(findMissingNumberBinarySearch([ 0, 1, 2 ])).to.equal(null)
		expect(findMissingNumberBinarySearch([ 1, 2, 3, 4 ])).to.equal(null)
	})

	it('returns the high-end of a multi-number gap', () => {
		// I mean, ideally this would return 1, but for now...
		expect(findMissingNumberBinarySearch([ 0, 3, 4 ])).to.equal(2)
		expect(findMissingNumberBinarySearch([ 0, 3, 4 ])).to.not.equal(1)
	})
})
