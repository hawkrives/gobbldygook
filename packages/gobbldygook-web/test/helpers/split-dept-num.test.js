import {expect} from 'chai'
import splitDeptNum from '../../src/helpers/split-dept-num'

describe('splitDeptNum', () => {
	it('splits multi-department courses into components', () => {
		let asre = 'AS/RE 250'
		let asianrel = 'ASIAN/REL 250'

		expect(splitDeptNum(asre)).to.eql({depts: ['AS', 'RE'], num: 250})
		expect(splitDeptNum(asianrel)).to.eql({depts: ['ASIAN', 'REL'], num: 250})
	})

	it('splits up a single department course into components', () => {
		let deptnum = 'ASIAN 275'

		expect(splitDeptNum(deptnum)).to.eql({depts: ['ASIAN'], num: 275})
	})

	it('includes the section, if given', () => {
		let deptnum = 'ASIAN 275A'

		expect(splitDeptNum(deptnum, true)).to.eql({depts: ['ASIAN'], num: 275, sect: 'A'})
	})
})
