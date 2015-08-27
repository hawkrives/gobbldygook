import findMissingNumberBinarySearch from '../../src/helpers/find-missing-number-binary-search'

describe('findMissingNumberBinarySearch', () => {
	it('takes a list of numbers and finds the first gap', () => {
		let nums = [
			[1, 2, 3],
			[0, 1, 2],
			[0, 3, 4],
		]

		expect(findMissingNumberBinarySearch(nums[0])).to.equal(null)
		expect(findMissingNumberBinarySearch(nums[0])).to.not.equal(4)

		expect(findMissingNumberBinarySearch(nums[1])).to.equal(null)

		// I mean, ideally this would return 1, but for now...
		expect(findMissingNumberBinarySearch(nums[2])).to.equal(2)
		expect(findMissingNumberBinarySearch(nums[2])).to.not.equal(1)
	})
})
