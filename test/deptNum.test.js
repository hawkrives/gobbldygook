// tests/deptNum-test.js
import 'should'

describe('deptNum', () => {
	import * as deptNum from 'app/helpers/deptNum'

	it('splits a deptnum into components', () => {
		let splitDeptNum = deptNum.splitDeptNum
		let deptnums = [
			'AS/RE 250',
			'ASIAN/REL 250',
			'ASIAN 275',
		]

		splitDeptNum(deptnums[0]).should.eql({depts: ['AS','RE'], num: 250})
		splitDeptNum(deptnums[1]).should.eql({depts: ['ASIAN','REL'], num: 250})
		splitDeptNum(deptnums[2]).should.eql({depts: ['ASIAN'], num: 275})
	})

	it('builds a consistent deptnum from depts and num', () => {
		let buildDeptNum = deptNum.buildDeptNum
		let courses = {
			'AS/RE': {depts: ['ASIAN', 'REL'], num: 230},
			'BI/CH': {depts: ['BIO', 'CHEM'], num: 125},
			'CH/BI': {depts: ['CHEM', 'BIO'], num: 125},
			'ASIAN': {depts: ['ASIAN'], num: 175},
		}

		buildDeptNum(courses['AS/RE']).should.equal('ASIAN/REL 230')
		buildDeptNum(courses['BI/CH']).should.equal('BIO/CHEM 125')
		buildDeptNum(courses['CH/BI']).should.equal('CHEM/BIO 125')
		buildDeptNum(courses['ASIAN']).should.equal('ASIAN 175')
	})

	it('checks if a course\'s dept and num are between the parameters', () => {
		let hasDeptNumBetween = deptNum.hasDeptNumBetween
		let options = [
			{dept: 'ASIAN', start: 200, end: 250}
		]
		let courses = [
			{depts: ['ASIAN', 'REL'], num: 230},
			{depts: ['BIO', 'CHEM'], num: 125},
			{depts: ['CHEM', 'BIO'], num: 125},
			{depts: ['BIO'], num: 175},
		]

		hasDeptNumBetween(options[0], courses[0]).should.be.true
	})
})
