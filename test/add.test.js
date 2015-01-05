// tests/add-test.js
var should = require('should');

describe('add', function() {
	it('adds 1 + 2 to equal 3', function() {
		var add = require('../app/helpers/add');
		add(1, 2).should.equal(3);
	});
});
