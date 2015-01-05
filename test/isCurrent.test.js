// tests/isCurrent-test.js
var should = require('should');

describe('isCurrentSemester', function() {
	it('checks if a schedule is in the given semester', function() {
		var isCurrentSemester = require('app/helpers/isCurrent').isCurrentSemester;
		isCurrentSemester(2012, 2, {year: 2012, semester: 2}).should.be.true;
	});
});

describe('isCurrentYear', function() {
	it('checks if a schedule is in the given year', function() {
		var isCurrentYear = require('app/helpers/isCurrent').isCurrentYear;
		isCurrentYear(2012, {year: 2012, semester: 2}).should.be.true;
	});
});
