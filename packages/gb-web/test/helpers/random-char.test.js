import {expect} from 'chai'
import randomChar from '../../src/helpers/random-char'

describe('randomChar', () => {
	it('finds a random integer between the parameters', () => {
		expect(randomChar()).to.match(/[a-z0-9]/)
		expect(randomChar()).to.match(/[a-z0-9]/)
	})
})
