import {semesterName} from '../semester-name'

describe('semesterName', () => {
	it('converts a semester number to a semester name', () => {
		expect(semesterName(1)).toBe('Fall')
		expect(semesterName(2)).toBe('Winter')
		expect(semesterName(3)).toBe('Spring')
	})
})
