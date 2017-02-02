import { semesterName } from '../semester-name'

describe('semesterName', () => {
	it('converts a semester number to a semester name', () => {
		expect(semesterName(0)).toBe('Abroad')
		expect(semesterName(1)).toBe('Fall')
		expect(semesterName(2)).toBe('Interim')
		expect(semesterName(3)).toBe('Spring')
		expect(semesterName(4)).toBe('Summer Session 1')
		expect(semesterName(5)).toBe('Summer Session 2')
		expect(semesterName(6)).toBe('Unknown (6)')
		expect(semesterName(9)).toBe('Non-St. Olaf')
	})
})
