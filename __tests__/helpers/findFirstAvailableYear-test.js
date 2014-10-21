// __tests__/findFirstAvailableYear-test.js
jest.dontMock('../../app/helpers/findFirstAvailableYear');
jest.dontMock('../../app/helpers/findMissingNumberBinarySearch');

describe('findFirstAvailableYear', function() {
	it('takes a list of schedules and finds the first open year', function() {
		var findFirstAvailableYear = require('../../app/helpers/findFirstAvailableYear').default;
		var schedules = {
			"3": {"id": 3, "year": 2012},
			"6": {"id": 6, "year": 2013},
			"1": {"id": 1, "year": 2015},
		};

		expect(findFirstAvailableYear(schedules)).toEqual(2014);
		expect(findFirstAvailableYear(schedules)).not.toEqual(2016);
	});
});
