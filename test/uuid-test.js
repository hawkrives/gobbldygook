// tests/uuid-test.js
var should = require('should');

describe('uuid', function() {
	it('generates a uuid', function() {
		var uuid = require('../app/helpers/uuid.es6').default;

		uuid().should.have.length(36);
		uuid().should.have.length(36);
	});
});
