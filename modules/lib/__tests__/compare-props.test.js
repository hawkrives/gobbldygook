import { compareProps } from '../compare-props'

describe('compareProps', () => {
    it('should return true if the component should update', () => {
        expect(compareProps({ a: 1 }, { a: 2 })).toBe(true)
        expect(compareProps({ a: 1 }, { b: 1 })).toBe(true)
    })

    it('should return false if the component has no input changes', () => {
        expect(compareProps({ a: 1 }, { a: 1 })).toBe(false)
    })
})
