import pathToOverride from '../path-to-override'

describe('pathToOverride', () => {
	it('computes the path to an override', () => {
		expect(pathToOverride(['a', 'b', 'c d'])).toBe('a\x1Cb\x1Cc d')
	})

	it('lower-cases the path', () => {
		expect(pathToOverride(['aA', 'b', 'c d'])).toBe('aa\x1Cb\x1Cc d')
	})

	it('retains spaces in the path', () => {
		expect(pathToOverride(['aA', 'b', 'Studio aRt'])).toBe(
			'aa\x1Cb\x1Cstudio art',
		)
	})
})
