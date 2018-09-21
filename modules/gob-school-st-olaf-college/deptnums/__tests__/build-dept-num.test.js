import {buildDeptNum} from '../build-dept-num'

describe('buildDeptNum', () => {
	it('builds a department string', () => {
		let ASIAN = {department: 'ASIAN', number: 175}

		expect(buildDeptNum(ASIAN)).toBe('ASIAN 175')
	})

	it('handles sections', () => {
		let AMCON = {department: 'AMCON', number: 201, section: 'A'}

		expect(buildDeptNum(AMCON, true)).toBe('AMCON 201A')
	})

	it('only handles sections when told to', () => {
		let AMCON = {department: 'AMCON', number: 201, section: 'A'}

		expect(buildDeptNum(AMCON)).toBe('AMCON 201')
	})
})
