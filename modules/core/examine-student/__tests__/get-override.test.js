import { expect } from 'chai'
import getOverride from '../get-override'

describe('getOverride', () => {
	// Note: we're using .equal for booleans here to indicate that it's
	// returning the value, rather than a boolean.
	it('returns an override', () => {
		expect(getOverride([ 'a', 'b', 'c' ], { 'a.b.c': true })).to.equal(true)
	})

	it('simply returns the value of the override', () => {
		expect(getOverride([ 'a', 'b', 'c' ], { 'a.b.c': false })).to.equal(false)
		expect(getOverride([ 'a', 'b', 'c' ], { 'a.b.c': 5 })).to.equal(5)
	})

	it('returns the same instance, too', () => {
		const arr = [ 1, 2, 3 ]
		expect(getOverride([ 'a', 'b', 'c' ], { 'a.b.c': arr })).to.equal(arr)
	})
})
