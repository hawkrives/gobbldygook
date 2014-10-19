// __tests__/courseLevels-test.js
jest.dontMock('../../app/helpers/courseLevels');

describe('courseLevels', function() {
	var courseLevels = require('../../app/helpers/courseLevels');
	var courses = [];

	beforeEach(function() {
		courses = [
			{level: 300},
			{level: 200},
			{level: 100},
			{level: 400},
			{level: 900}
		];
	});

	it('checks if a course is at or above a certain level', function() {
		var coursesAtOrAboveLevel = courseLevels.coursesAtOrAboveLevel;

		expect(coursesAtOrAboveLevel(200, courses[0])).toBe(true);
		expect(coursesAtOrAboveLevel(200, courses[1])).toBe(true);
		expect(coursesAtOrAboveLevel(200, courses[2])).toBe(false);
	});

	it('filters a list of courses to only those with a level at or above "x"', function() {
		var onlyCoursesAtOrAboveLevel = courseLevels.onlyCoursesAtOrAboveLevel;

		expect(onlyCoursesAtOrAboveLevel(200, courses).length).toEqual(4);
	});

	it('checks if a course is at a certain level', function() {
		var coursesAtLevel = courseLevels.coursesAtLevel;

		expect(coursesAtLevel(200, courses[0])).toBe(false);
		expect(coursesAtLevel(200, courses[1])).toBe(true);
		expect(coursesAtLevel(200, courses[2])).toBe(false);
	});

	it('filters a list of courses to only those with a level at "x"', function() {
		var onlyCoursesAtLevel = courseLevels.onlyCoursesAtLevel;

		expect(onlyCoursesAtLevel(200, courses).length).toEqual(1);
	});
});
