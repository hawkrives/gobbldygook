// tests/courseLevels-test.js
var should = require('should');

describe('courseLevels', function() {
	var courseLevels = require('../app/helpers/courseLevels');
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

		coursesAtOrAboveLevel(200, courses[0]).should.be.true;
		coursesAtOrAboveLevel(200, courses[1]).should.be.true;
		coursesAtOrAboveLevel(200, courses[2]).should.be.false;
	});

	it('filters a list of courses to only those with a level at or above "x"', function() {
		var onlyCoursesAtOrAboveLevel = courseLevels.onlyCoursesAtOrAboveLevel;

		onlyCoursesAtOrAboveLevel(200, courses).should.have.length(4);
	});

	it('checks if a course is at a certain level', function() {
		var coursesAtLevel = courseLevels.coursesAtLevel;

		coursesAtLevel(200, courses[0]).should.be.false;
		coursesAtLevel(200, courses[1]).should.be.true;
		coursesAtLevel(200, courses[2]).should.be.false;
	});

	it('filters a list of courses to only those with a level at "x"', function() {
		var onlyCoursesAtLevel = courseLevels.onlyCoursesAtLevel;

		onlyCoursesAtLevel(200, courses).should.have.length(1);
	});
});
