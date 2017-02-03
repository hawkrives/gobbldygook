import { interpose } from '../interpose'

describe('interpose', () => {
	it('should interpose a value between other values in an array', () => {
		expect(interpose([1, 2, 3], 5)).toEqual([1, 5, 2, 5, 3])
	})

	it('should not care about types', () => {
		expect(interpose([1, 2, 3], '5')).toEqual([1, '5', 2, '5', 3])
	})
})
