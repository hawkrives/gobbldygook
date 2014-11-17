// tests/countCredits-test.js
var assert = require('assert');

describe('semesterName', function() {
	it('converts a semester number to a semester name ', function() {
		var semesterName = require('../app/helpers/semesterName.es6').default;

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
		var toPrettyTerm = require('../app/helpers/semesterName.es6').toPrettyTerm;

		assert.equal(toPrettyTerm(20141), 'Fall 2014-15');
		assert.equal(toPrettyTerm(20103), 'Spring 2010-11');
		assert.equal(toPrettyTerm(20135), 'Late Summer 2013-14');
		assert.equal(toPrettyTerm(20111), 'Fall 2011-12');
		assert.equal(toPrettyTerm(20316), 'Unknown (6) 2031-32');
		assert.equal(toPrettyTerm(20134), 'Early Summer 2013-14');
	});
});
