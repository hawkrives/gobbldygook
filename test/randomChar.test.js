// tests/randomChar-test.js
var should = require('should');

describe('randomChar', function() {
	it('finds a random integer between the parameters', function() {
		var randomChar = require('../app/helpers/randomChar');

		randomChar().should.match(/[a-z0-9]/);
		randomChar().should.match(/[a-z0-9]/);
	});
});
