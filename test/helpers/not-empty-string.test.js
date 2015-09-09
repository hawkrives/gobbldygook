import {expect} from 'chai'
import notEmptyString from '../../src/helpers/not-empty-string'

describe('notEmptyString', () => {
	it('checks if a string is not empty', () => {
		expect(notEmptyString('a')).to.be.true
		expect(notEmptyString('')).to.be.false
	})
})
