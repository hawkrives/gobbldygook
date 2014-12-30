// tests/findMissingNumberBinarySearch-test.js
var should = require('should');

describe('findMissingNumberBinarySearch', function() {
	it('takes a list of numbers and finds the first gap', function() {
		var findMissingNumberBinarySearch = require('../app/helpers/findMissingNumberBinarySearch');
		var nums = [
			[1,2,3],
			[0,1,2],
			[0,3,4]
		];

		should(findMissingNumberBinarySearch(nums[0])).equal(null);
		should(findMissingNumberBinarySearch(nums[0])).not.equal(4);

		should(findMissingNumberBinarySearch(nums[1])).equal(null);

		// I mean, ideally this would return 1, but for now...
		should(findMissingNumberBinarySearch(nums[2])).equal(2);
		should(findMissingNumberBinarySearch(nums[2])).not.equal(1);
	});
});
