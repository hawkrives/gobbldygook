// tests/countCredits-test.js
var assert = require('assert');

describe('semesterName', function() {
	it('converts a semester number to a semester name', function() {
		var semesterName = require('../app/helpers/semesterName');

		assert.equal(semesterName(0), 'Unknown (0)');
		assert.equal(semesterName(1), 'Fall');
		assert.equal(semesterName(2), 'Interim');
		assert.equal(semesterName(3), 'Spring');
		assert.equal(semesterName(4), 'Early Summer');
		assert.equal(semesterName(5), 'Late Summer');
	});
});

describe('toPrettyTerm', function() {
	it('converts a term id to a year and semester', function() {
		var toPrettyTerm = require('../app/helpers/semesterName').toPrettyTerm;

		assert.equal(toPrettyTerm(20141), 'Fall 2014—2015');
		assert.equal(toPrettyTerm(20103), 'Spring 2010—2011');
		assert.equal(toPrettyTerm(20135), 'Late Summer 2013—2014');
		assert.equal(toPrettyTerm(20111), 'Fall 2011—2012');
		assert.equal(toPrettyTerm(20316), 'Unknown (6) 2031—2032');
		assert.equal(toPrettyTerm(20134), 'Early Summer 2013—2014');
	});
});

describe('expandYear', function() {
	it('expands a year to year-(year+1)', function() {
		var expandYear = require('../app/helpers/semesterName').expandYear;

		assert.equal(expandYear(2014), '2014—2015');
		assert.equal(expandYear(2010), '2010—2011');
		assert.equal(expandYear(2013), '2013—2014');
		assert.equal(expandYear(2011), '2011—2012');
		assert.equal(expandYear(2031), '2031—2032');
		assert.equal(expandYear(2013), '2013—2014');
	});
});
