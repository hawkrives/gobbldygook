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
