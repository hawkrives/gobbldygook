import combinations from '../../src/helpers/base-combinations'

describe('combinations', () => {
	it('finds all combinations of an array', () => {
		expect(combinations([1, 2], 2)).to.eql([[1, 2]])

		expect(combinations([1, 2, 3], 1)).to.eql([[1], [2], [3]])

		expect(combinations([1, 2, 3], 2)).to.eql([[1, 2], [1, 3], [2, 3]])

		expect(combinations([1, 2, 3], 3)).to.eql([[1, 2, 3]])

		expect(combinations([1, 2, 3], 4)).to.eql([])

		expect(combinations([1, 2, 3], 0)).to.eql([])

		expect(combinations([1, 2, 3], -1)).to.eql([])

		expect(combinations([], 0)).to.eql([])
	})
})
