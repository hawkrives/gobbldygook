import {
    findMissingNumberBinarySearch,
} from '../find-missing-number-binary-search'

describe('findMissingNumberBinarySearch', () => {
    it('takes a list of numbers and finds the first gap', () => {
        expect(findMissingNumberBinarySearch([1, 2, 3])).toBe(null)
        expect(findMissingNumberBinarySearch([1, 2, 3])).not.toBe(4)

        expect(findMissingNumberBinarySearch([1, 2, 3, 5])).toBe(4)
        expect(findMissingNumberBinarySearch([1, 3, 4, 5])).toBe(2)
        expect(findMissingNumberBinarySearch([1, 2, 4, 5, 6, 7, 8])).toBe(3)
    })

    it('returns null if there is no gap', () => {
        expect(findMissingNumberBinarySearch([0, 1, 2])).toBe(null)
        expect(findMissingNumberBinarySearch([1, 2, 3, 4])).toBe(null)
    })

    it('returns the high-end of a multi-number gap', () => {
        // I mean, ideally this would return 1, but for now...
        expect(findMissingNumberBinarySearch([0, 3, 4])).toBe(2)
        expect(findMissingNumberBinarySearch([0, 3, 4])).not.toBe(1)
    })
})
