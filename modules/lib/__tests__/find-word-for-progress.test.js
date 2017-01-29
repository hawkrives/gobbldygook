import { findWordForProgress } from '../find-word-for-progress'

describe('findWordForProgress', () => {
	it('properly handles each tenth of the float', () => {
		expect(findWordForProgress(100, 100)).toBe('hundred')
		expect(findWordForProgress(100, 90)).toBe('ninety')
		expect(findWordForProgress(100, 80)).toBe('eighty')
		expect(findWordForProgress(100, 70)).toBe('seventy')
		expect(findWordForProgress(100, 60)).toBe('sixty')
		expect(findWordForProgress(100, 50)).toBe('fifty')
		expect(findWordForProgress(100, 40)).toBe('forty')
		expect(findWordForProgress(100, 30)).toBe('thirty')
		expect(findWordForProgress(100, 20)).toBe('twenty')
		expect(findWordForProgress(100, 10)).toBe('ten')
		expect(findWordForProgress(100, 5)).toBe('under-ten')
		expect(findWordForProgress(100, 0)).toBe('zero')
	})

	it('handles numbers between tenths of a float', () => {
		expect(findWordForProgress(100, 75.52313)).toBe('seventy')
	})
})
