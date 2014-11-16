// tests/getRandomInt-test.js
var should = require('should');

describe('getRandomInt', function() {
	it('finds a random integer between the parameters', function() {
		var getRandomInt = require('../app/helpers/getRandomInt.es6').default;

		getRandomInt(1, 3).should.be.within(0, 4);
		getRandomInt(0, 3).should.be.within(-1, 4);
		getRandomInt(1, 5).should.be.within(0, 6);
		getRandomInt(1, 3).should.be.within(0, 4);
	});
});
