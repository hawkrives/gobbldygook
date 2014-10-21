// __tests__/randomChar-test.js
jest.dontMock('../../app/helpers/randomChar');

describe('randomChar', function() {
	it('finds a random integer between the parameters', function() {
		var randomChar = require('../../app/helpers/randomChar').default;

		expect(randomChar()).toMatch(/[a-z]/);
		expect(randomChar()).toMatch(/[a-z]/);
	});
});
