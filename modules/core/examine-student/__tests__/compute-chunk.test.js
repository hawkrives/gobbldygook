import computeChunk from '../compute-chunk'

describe('computeChunk', () => {
	it('requires that the expression be an object', () => {
		expect(() => computeChunk({ expr: 'string' })).toThrow(TypeError)
	})

	it('throws when encountering an unknown type', () => {
		expect(() => computeChunk({ expr: { $type: 'invalid' } })).toThrow(TypeError)
	})
})
