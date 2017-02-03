import pathToOverride from '../path-to-override'

describe('pathToOverride', () => {
	it('computes the path to an override', () => {
		expect(pathToOverride(['a', 'b', 'c d'])).toBe('a.b.c d')
	})

	it('lower-cases the path', () => {
		expect(pathToOverride(['aA', 'b', 'c d'])).toBe('aa.b.c d')
	})

	it('retains spaces in the path', () => {
		expect(pathToOverride(['aA', 'b', 'Studio aRt'])).toBe('aa.b.studio art')
	})
})
