// __tests__/uuid-test.js
jest.dontMock('../../app/helpers/uuid');

describe('uuid', function() {
	it('generates a uuid', function() {
		var uuid = require('../../app/helpers/uuid').default;

		expect(uuid().length).toBe(36);
		expect(uuid().length).toBe(36);
	});
});
