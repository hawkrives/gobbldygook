import { randomChar } from '../random-char'

describe('randomChar', () => {
	it('finds a random integer between the parameters', () => {
		expect(randomChar()).toMatch(/[a-z0-9]/)
		expect(randomChar()).toMatch(/[a-z0-9]/)
	})
})
