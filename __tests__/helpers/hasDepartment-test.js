// __tests__/hasDepartment-test.js
jest.dontMock('../../app/helpers/hasDepartment');

describe('hasDepartment', function() {
	it('checks if a course is in a department', function() {
		var hasDepartment = require('../../app/helpers/hasDepartment');
		var courses = [
			{depts: ['ASIAN', 'REL'], num: 230},
			{depts: ['BIO', 'CHEM'], num: 125},
			{depts: ['CHEM', 'BIO'], num: 125},
			{depts: ['ASIAN'], num: 175},
		];

		expect(hasDepartment('ASIAN', courses[0])).toEqual(true);
		expect(hasDepartment('BIO', courses[1])).toEqual(true);
		expect(hasDepartment('CHEM', courses[2])).toEqual(true);
		expect(hasDepartment('REL', courses[3])).toEqual(false);
	});
});
