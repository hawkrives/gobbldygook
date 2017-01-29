import { computeReference } from '../compute-chunk'

describe('computeReference', () => {
	it('returns the result of the referenced requirement', () => {
		const expr = { $requirement: 'Req' }
		const ctx = { Req: { computed: true } }

		const actual = computeReference({ expr, ctx })
		expect(actual.computedResult).toBeDefined()
		expect(actual.computedResult).toBe(true)
	})

	it('supports spaces in the requirement name', () => {
		const expr = { $requirement: 'Req Name' }
		const ctx = { 'Req Name': { computed: true } }

		const actual = computeReference({ expr, ctx })
		expect(actual.computedResult).toBeDefined()
		expect(actual.computedResult).toBe(true)
	})

	xit('returns the list of matches, if present', () => {
		const expr = { $requirement: 'Req Name' }
		const ctx = { 'Req Name': { computed: true, matches: [ 'Match' ], result: '' } }
		expect(computeReference({ expr, ctx })).toEqual({
			computedResult: true,
			matches: [ 'Match' ],
		})
	})

	it('throws a ReferenceError if the referenced requirement doesn\'t exist', () => {
		const expr = { $requirement: 'A' }
		const ctx = { ONLY: {} }
		expect(() => computeReference({ expr, ctx })).toThrowError(ReferenceError)
	})
})
