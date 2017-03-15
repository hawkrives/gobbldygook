import { normalizeDepartment } from '../convert-department'

describe('normalizeDepartment', () => {
    it('expands a short department abbreviation into a long abbreviation', () => {
        expect(normalizeDepartment('AS')).toBe('ASIAN')
    })

    it('returns the input when a department is unknown', () => {
        expect(normalizeDepartment('HUMONGOUS')).toBe('HUMONGOUS')
    })
})
