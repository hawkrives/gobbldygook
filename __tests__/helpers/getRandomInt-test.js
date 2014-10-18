// __tests__/getRandomInt-test.js
jest.dontMock('../../app/helpers/getRandomInt');

describe('getRandomInt', function() {
	it('finds a random integer between the parameters', function() {
		var getRandomInt = require('../../app/helpers/getRandomInt');

		expect(getRandomInt(1, 3)).toBeGreaterThan(0);
		expect(getRandomInt(1, 3)).toBeLessThan(4);

		expect(getRandomInt(0, 3)).toBeGreaterThan(-1);
		expect(getRandomInt(0, 3)).toBeLessThan(4);

		expect(getRandomInt(1, 5)).toBeGreaterThan(0);
		expect(getRandomInt(1, 5)).toBeLessThan(6);

		expect(getRandomInt(1, 3)).toBeGreaterThan(0);
		expect(getRandomInt(1, 3)).toBeLessThan(4);
	});
});
