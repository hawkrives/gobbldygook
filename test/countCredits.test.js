// tests/countCredits-test.js
var should = require('should');

describe('countCredits', function() {
	it('counts the number of credits in a list of courses', function() {
		var countCredits = require('../app/helpers/countCredits');
		var courses = [
			{credits: 1},
			{credits: 0.25},
			{credits: 0.5},
			{credits: 0.75},
			{credits: 1}
		]

		countCredits(courses).should.equal(3.5);
	});
});
