// __tests__/countCredits-test.js
jest.dontMock('../../app/helpers/countCredits');
jest.dontMock('../../app/helpers/add');
jest.dontMock('lodash');

describe('countCredits', function() {
	it('counts the number of credits in a list of courses', function() {
		var _ = require('lodash');
		var countCredits = require('../../app/helpers/countCredits').default;
		var courses = [
			{credits: 1},
			{credits: 0.25},
			{credits: 0.5},
			{credits: 0.75},
			{credits: 1}
		]

		expect(countCredits(courses)).toBe(3.5);
	});
});
