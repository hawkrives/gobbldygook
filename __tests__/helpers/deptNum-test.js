// __tests__/deptNum-test.js
jest.dontMock('../../app/helpers/deptNum');
jest.dontMock('../../app/helpers/hasDepartment');
jest.dontMock('lodash');

describe('deptNum', function() {
	var _ = require('lodash');
	var deptNum = require('../../app/helpers/deptNum')

	it('splits a deptnum into components', function() {
		var splitDeptNum = deptNum.splitDeptNum;
		var deptnums = [
			'AS/RE 250',
			'ASIAN/REL 250',
			'ASIAN 275',
		];

		expect(splitDeptNum(deptnums[0])).toEqual({depts: ['AS','RE'], num: 250});
		expect(splitDeptNum(deptnums[1])).toEqual({depts: ['ASIAN','REL'], num: 250});
		expect(splitDeptNum(deptnums[2])).toEqual({depts: ['ASIAN'], num: 275});
	});

	it('builds a consistent deptnum from depts and num', function() {
		var buildDeptNum = deptNum.buildDeptNum;
		var courses = {
			'AS/RE': {depts: ['ASIAN', 'REL'], num: 230},
			'BI/CH': {depts: ['BIO', 'CHEM'], num: 125},
			'CH/BI': {depts: ['CHEM', 'BIO'], num: 125},
			'ASIAN': {depts: ['ASIAN'], num: 175},
		};

		expect(buildDeptNum(courses['AS/RE'])).toEqual('ASIAN/REL 230');
		expect(buildDeptNum(courses['BI/CH'])).toEqual('BIO/CHEM 125');
		expect(buildDeptNum(courses['CH/BI'])).toEqual('CHEM/BIO 125');
		expect(buildDeptNum(courses['ASIAN'])).toEqual('ASIAN 175');
	});

	it('checks if a course\'s dept and num are between the parameters', function() {
		var hasDeptNumBetween = deptNum.hasDeptNumBetween;
		var options = [
			{dept: 'ASIAN', start: 200, end: 250}
		];
		var courses = [
			{depts: ['ASIAN', 'REL'], num: 230},
			{depts: ['BIO', 'CHEM'], num: 125},
			{depts: ['CHEM', 'BIO'], num: 125},
			{depts: ['BIO'], num: 175},
		];

		expect(hasDeptNumBetween(options[0], courses[0])).toBe(true);
	});
});
