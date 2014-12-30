// tests/findFirstAvailableYear-test.js
var should = require('should');

describe('findFirstAvailableYear', function() {
	it('takes a list of schedules and finds the first open year', function() {
		var findFirstAvailableYear = require('../app/helpers/findFirstAvailableYear');
		var schedules = [
			{"id": 3, "year": 2012},
			{"id": 6, "year": 2013},
			{"id": 1, "year": 2015},
		];

		findFirstAvailableYear(schedules).should.equal(2014);
		findFirstAvailableYear(schedules).should.not.equal(2016);


		var altScheds = [
			{"id": 3, "year": 2014},
			{"id": 6, "year": 2013},
			{"id": 1, "year": 2015},
		]
		var altMatriculation = 2012;

		findFirstAvailableYear(altScheds, altMatriculation).should.equal(2012);
	});
});
