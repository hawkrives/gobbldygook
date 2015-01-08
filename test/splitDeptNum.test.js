// tests/splitDeptNum.test.js
import splitDeptNum from 'app/helpers/splitDeptNum'

describe('splitDeptNum', () => {
	it('splits multi-department courses into components', () => {
		let asre = 'AS/RE 250'
		let asianrel = 'ASIAN/REL 250'

		splitDeptNum(asre).should.eql({depts: ['AS', 'RE'], num: 250})
		splitDeptNum(asianrel).should.eql({depts: ['ASIAN', 'REL'], num: 250})
	})

	it('splits up a single department course into components', () => {
		let deptnum = 'ASIAN 275'

		splitDeptNum(deptnum).should.eql({depts: ['ASIAN'], num: 275})
	})
})
