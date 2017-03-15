import hasOverride from '../has-override'

describe('hasOverride', () => {
    it('checks if an override exists', () => {
        expect(hasOverride(['a', 'b', 'c'], { 'a.b.c': true })).toBe(true)
    })

    it('does not just return the value of the override', () => {
        expect(hasOverride(['a', 'b', 'c'], { 'a.b.c': false })).toBe(true)
    })
})
