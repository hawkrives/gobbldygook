// __tests__/findMissingNumberBinarySearch-test.js
jest.dontMock('../../app/helpers/findMissingNumberBinarySearch');
jest.dontMock('../../app/helpers/findMissingNumberBinarySearch');
jest.dontMock('lodash');

describe('findMissingNumberBinarySearch', function() {
	var _ = require('lodash');

	it('takes a list of numbers and finds the first gap', function() {
		var findMissingNumberBinarySearch = require('../../app/helpers/findMissingNumberBinarySearch');
		var nums = [
			[1,2,3],
			[0,1,2],
			[0,3,4]
		];

		expect(findMissingNumberBinarySearch(nums[0])).toEqual(null);
		expect(findMissingNumberBinarySearch(nums[0])).not.toEqual(4);

		expect(findMissingNumberBinarySearch(nums[1])).toEqual(null);

		expect(findMissingNumberBinarySearch(nums[2])).toEqual(2);
		expect(findMissingNumberBinarySearch(nums[2])).not.toEqual(1);
	});
});
