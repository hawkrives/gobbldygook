import { stringifyError } from '../stringify-error'

describe('stringifyError', () => {
	it('should turn an error into a stringifiable object', () => {
		let err = new Error('test message')
		expect(() => stringifyError(err)).not.toThrow()
		expect(JSON.parse(stringifyError(err)).message).toBe('test message')
	})
})
