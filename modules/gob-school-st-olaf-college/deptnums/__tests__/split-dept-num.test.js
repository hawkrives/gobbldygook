import {splitDeptNum} from '../split-dept-num'

describe('splitDeptNum', () => {
	it('splits up a single department course into components', () => {
		let deptnum = 'ASIAN 275'

		expect(splitDeptNum(deptnum)).toEqual({
			department: 'ASIAN',
			number: 275,
		})
	})

	it('includes the section, if given', () => {
		let deptnum = 'ASIAN 275A'

		expect(splitDeptNum(deptnum, true)).toEqual({
			department: 'ASIAN',
			number: 275,
			section: 'A',
		})
	})
})
