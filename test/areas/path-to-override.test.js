import {expect} from 'chai'
import pathToOverride from '../../src/area-tools/path-to-override'

describe('pathToOverride', () => {
	it('computes the path to an override', () => {
		expect(pathToOverride(['a', 'b', 'c d'])).to.equal('a.b.c d')
	})

	it('lower-cases the path', () => {
		expect(pathToOverride(['aA', 'b', 'c d'])).to.equal('aa.b.c d')
	})

	it('retains spaces in the path', () => {
		expect(pathToOverride(['aA', 'b', 'Studio aRt'])).to.equal('aa.b.studio art')
	})
})
