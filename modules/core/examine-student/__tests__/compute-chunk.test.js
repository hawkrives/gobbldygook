import {expect} from 'chai'
import computeChunk from '../../src/area-tools/compute-chunk'

describe('computeChunk', () => {
	it('requires that the expression be an object', () => {
		expect(() => computeChunk({expr: 'string'})).to.throw(TypeError)
	})

	it('throws when encountering an unknown type', () => {
		expect(() => computeChunk({expr: {$type: 'invalid'}})).to.throw(TypeError)
	})
})
