// __tests__/countCredits-test.js
jest.dontMock('../../app/helpers/semesterName');

describe('semesterName', function() {
	it('converts a semester number to a semester name ', function() {
		var semesterName = require('../../app/helpers/semesterName').default;

		expect(semesterName(0)).toBe('Unknown (0)');
		expect(semesterName(1)).toBe('Fall');
		expect(semesterName(2)).toBe('Interim');
		expect(semesterName(3)).toBe('Spring');
		expect(semesterName(4)).toBe('Early Summer');
		expect(semesterName(5)).toBe('Late Summer');
	});
});
