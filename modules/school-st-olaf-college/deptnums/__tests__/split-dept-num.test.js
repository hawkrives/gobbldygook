import { splitDeptNum } from '../split-dept-num'

describe('splitDeptNum', () => {
	it('splits multi-department courses into components', () => {
		let asre = 'AS/RE 250'
		let asianrel = 'ASIAN/REL 250'

		expect(splitDeptNum(asre)).toEqual({ departments: ['AS', 'RE'], number: 250 })
		expect(splitDeptNum(asianrel)).toEqual({ departments: ['ASIAN', 'REL'], number: 250 })
	})

	it('splits up a single department course into components', () => {
		let deptnum = 'ASIAN 275'

		expect(splitDeptNum(deptnum)).toEqual({ departments: ['ASIAN'], number: 275 })
	})

	it('includes the section, if given', () => {
		let deptnum = 'ASIAN 275A'

		expect(splitDeptNum(deptnum, true)).toEqual({ departments: ['ASIAN'], number: 275, section: 'A' })
	})
})
