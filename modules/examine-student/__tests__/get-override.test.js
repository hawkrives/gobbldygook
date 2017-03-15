import getOverride from '../get-override'

describe('getOverride', () => {
    it('returns an override', () => {
        expect(getOverride(['a', 'b', 'c'], { 'a.b.c': 'val' })).toBe('val')
    })

    it('simply returns the value of the override', () => {
        expect(getOverride(['a', 'b', 'c'], { 'a.b.c': false })).toBe(false)
        expect(getOverride(['a', 'b', 'c'], { 'a.b.c': 5 })).toBe(5)
    })

    it('returns the same instance, too', () => {
        const arr = [1, 2, 3]
        expect(getOverride(['a', 'b', 'c'], { 'a.b.c': arr })).toBe(arr)
    })
})
