// tests/findFirstAvailableYear-test.js
var should = require('should');
var Immutable = require('immutable');

describe('findFirstAvailableYear', function() {
	it('takes a list of schedules and finds the first open year', function() {
		var findFirstAvailableYear = require('../app/helpers/findFirstAvailableYear');
		var schedules = Immutable.List([
			{"id": 3, "year": 2012},
			{"id": 6, "year": 2013},
			{"id": 1, "year": 2015},
		]);

		findFirstAvailableYear(schedules).should.equal(2014);
		findFirstAvailableYear(schedules).should.not.equal(2016);


		var altScheds = Immutable.List([
			{"id": 3, "year": 2014},
			{"id": 6, "year": 2013},
			{"id": 1, "year": 2015},
		]);
		var altMatriculation = 2012;

		findFirstAvailableYear(altScheds, altMatriculation).should.equal(2012);
	});
});
