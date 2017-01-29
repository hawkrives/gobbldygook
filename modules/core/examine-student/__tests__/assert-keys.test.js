import assertKeys from '../assert-keys'

describe('assertKeys', () => {
	it('checks for required keys', () => {
		expect(() => assertKeys({ a: 1 }, 'b')).toThrow(ReferenceError)
	})

	it('is quiet if all keys are present', () => {
		expect(() => assertKeys({ a: 1 }, 'a')).not.toThrow(ReferenceError)
	})
})
