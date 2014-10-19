// __tests__/calculateNextScheduleId-test.js
jest.dontMock('../../app/helpers/calculateNextScheduleId');

describe('calculateNextScheduleId', function() {
 it('calculates the next available schedule id', function() {
   var calculateNextScheduleId = require('../../app/helpers/calculateNextScheduleId');
   var schedules = {
		"1": {"id": 1},
		"2": {"id": 2},
		"3": {"id": 3},
		"4": {"id": 4},
		"5": {"id": 5},
		"6": {"id": 6},
		"7": {"id": 7},
		"8": {"id": 8},
		"9": {"id": 9},
		"10": {"id": 10},
		"11": {"id": 11},
		"12": {"id": 12},
		"13": {"id": 13},
		"14": {"id": 14}
	};

   expect(calculateNextScheduleId(schedules)).toBe(15);
 });
});
