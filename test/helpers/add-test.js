// tests/add-test.js

describe('add', function() {
	it('adds 1 + 2 to equal 3', function() {
		var add = require('../../app/helpers/add').default;
		expect(add(1, 2)).toBe(3);
	});
});
