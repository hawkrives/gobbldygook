import { expect } from 'chai'
import { stringifyError } from '../stringify-error'

describe('stringifyError', () => {
	it('should turn an error into a stringifiable object', () => {
		let err = new Error('test message')
		expect(() => JSON.stringify(err)).to.throw
		expect(() => stringifyError(err)).not.to.throw
		expect(JSON.parse(stringifyError(err)).message).to.equal('test message')
	})
})
