import {expect} from 'chai'
import assertKeys from '../../src/area-tools/assert-keys'

describe('assertKeys', () => {
	it('checks for required keys', () => {
		expect(() => assertKeys({a: 1}, 'b')).to.throw(ReferenceError)
	})

	it('is quiet if all keys are present', () => {
		expect(() => assertKeys({a: 1}, 'a')).not.to.throw(ReferenceError)
	})
})
