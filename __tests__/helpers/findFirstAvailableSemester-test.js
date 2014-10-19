// __tests__/findFirstAvailableSemester-test.js
jest.dontMock('../../app/helpers/findFirstAvailableSemester');
jest.dontMock('../../app/helpers/findMissingNumberBinarySearch');

describe('findFirstAvailableSemester', function() {
	it('takes a list of schedules and finds the first open semester', function() {
		var findFirstAvailableSemester = require('../../app/helpers/findFirstAvailableSemester').default;
		var schedules = {
			"14": {"id": 14, "year": 2012, "semester": 1},
			"1": {"id": 1, "year": 2012, "semester": 1},
			"2": {"id": 2, "year": 2012, "semester": 2},
			"3": {"id": 3, "year": 2012, "semester": 3},

			"4": {"id": 4, "year": 2013, "semester": 1},
			"5": {"id": 5, "year": 2013, "semester": 2},
			"6": {"id": 6, "year": 2013, "semester": 5},

			"7": {"id": 7, "year": 2014, "semester": 1},
			"8": {"id": 8, "year": 2014, "semester": 2},
			"9": {"id": 9, "year": 2014, "semester": 2},

			"12": {"id": 12, "year": 2015, "semester": 2},
			"13": {"id": 13, "year": 2015, "semester": 3},
			"11": {"id": 11, "year": 2015, "semester": 4},
		};

		expect(findFirstAvailableSemester(schedules, 2012)).toEqual(4);
		expect(findFirstAvailableSemester(schedules, 2013)).toEqual(3);
		expect(findFirstAvailableSemester(schedules, 2014)).toEqual(3);
		expect(findFirstAvailableSemester(schedules, 2015)).toEqual(1);
		expect(findFirstAvailableSemester(schedules, 2016)).toEqual(1);
	});
});
