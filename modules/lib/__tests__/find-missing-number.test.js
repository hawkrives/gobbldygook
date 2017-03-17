// @flow
import { findMissingNumber } from '../find-missing-number'

describe('findMissingNumber', () => {
    it('takes a list of numbers and finds the first gap', () => {
        expect(findMissingNumber([1, 2, 3])).toBe(null)
        expect(findMissingNumber([1, 2, 3])).not.toBe(4)

        expect(findMissingNumber([1, 2, 3, 5])).toBe(4)
        expect(findMissingNumber([1, 3, 4, 5])).toBe(2)
        expect(findMissingNumber([1, 2, 4, 5, 6, 7, 8])).toBe(3)
    })

    it('returns null if there is no gap', () => {
        expect(findMissingNumber([0, 1, 2])).toBe(null)
        expect(findMissingNumber([1, 2, 3, 4])).toBe(null)
    })

    it('returns the low end of a multi-number gap', () => {
        expect(findMissingNumber([0, 3, 4])).toBe(1)
        expect(findMissingNumber([0, 3, 4])).not.toBe(2)
    })

    it('foo', () => {
        expect(findMissingNumber([0, 2, 3, 4])).toBe(1)
    })
})
