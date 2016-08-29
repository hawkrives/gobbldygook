import {expect} from 'chai'
import {computeReference} from '../../src/area-tools/compute-chunk'

describe('computeReference', () => {
	it('returns the result of the referenced requirement', () => {
		const expr = {$requirement: 'Req'}
		const ctx = {Req: {computed: true}}
		expect(computeReference({expr, ctx})).to.have.property('computedResult', true)
	})

	it('supports spaces in the requirement name', () => {
		const expr = {$requirement: 'Req Name'}
		const ctx = {'Req Name': {computed: true}}
		expect(computeReference({expr, ctx})).to.have.property('computedResult', true)
	})

	xit('returns the list of matches, if present', () => {
		const expr = {$requirement: 'Req Name'}
		const ctx = {'Req Name': {computed: true, matches: ['Match']}}
		expect(computeReference({expr, ctx})).to.deep.equal({
			computedResult: true,
			matches: ['Match'],
		})
	})

	it('throws a ReferenceError if the referenced requirement doesn\'t exist', () => {
		const expr = {$requirement: 'A'}
		const ctx = {ONLY: {}}
		expect(() => computeReference({expr, ctx})).to.throw(ReferenceError)
	})
})
