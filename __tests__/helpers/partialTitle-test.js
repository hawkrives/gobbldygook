// __tests__/partialTitle-test.js
jest.dontMock('../../app/helpers/partialTitle');
jest.dontMock('lodash');

describe('partialTitle', function() {
	var _ = require('lodash');
	var courses = [];

	beforeEach(function() {
		courses = [
			{title: 'AsianCon3: Interpreting Asia'},
			{title: 'Introduction to Modern Dance'},
			{title: 'Hello world!'},
			{title: 'Fubar.'},
			{title: 'Modern Japanese Literature'},
		];
		courses = _.map(courses, function(c) {
			c.name = c.title;
			return c;
		})
	});

	it('checks if a course has a matching string in the title', function() {
		var partialTitle = require('../../app/helpers/partialTitle').partialTitle;

		expect(partialTitle('Asia', courses[0])).toBe(true);
		expect(partialTitle('Dance', courses[1])).toBe(true);
		expect(partialTitle('Japanese', courses[4])).toBe(true);
	});

	it('checks if a course has a matching string in the name', function() {
		var partialName = require('../../app/helpers/partialTitle').partialName;

		expect(partialName('Asia', courses[0])).toBe(true);
		expect(partialName('Dance', courses[1])).toBe(true);
		expect(partialName('Japanese', courses[4])).toBe(true);
	});

	it('checks if a course has a matching string in either the title or the name', function() {
		var partialNameOrTitle = require('../../app/helpers/partialTitle').partialNameOrTitle;

		expect(partialNameOrTitle('Asia', courses[0])).toBe(true);
		expect(partialNameOrTitle('Dance', courses[1])).toBe(true);
		expect(partialNameOrTitle('Japanese', courses[4])).toBe(true);
		expect(partialNameOrTitle('China', courses[4])).toBe(false);
	});
});
