import { quacksLikeDeptNum } from '../quacks-like-dept-num'

describe('quacksLikeDeptNum', () => {
    it('fails on the empty string', () => {
        expect(quacksLikeDeptNum('')).toBe(false)
    })

    it('handles multi-department courses', () => {
        expect(quacksLikeDeptNum('AS/RE 250')).toBe(true)
    })

    it('handles single-department courses', () => {
        expect(quacksLikeDeptNum('ASIAN 275')).toBe(true)
    })

    it('requires that there be a department and a number', () => {
        expect(quacksLikeDeptNum('AMCON 100')).toBe(true)
    })

    it('requires that the number be comprised entirely of numbers', () => {
        expect(quacksLikeDeptNum('ASIAN 9XX')).toBe(false)
    })

    it('can also handle sections', () => {
        expect(quacksLikeDeptNum('ASIAN 220B')).toBe(true)
    })

    it('expects the section to be a single letter', () => {
        expect(quacksLikeDeptNum('ASIAN 220B')).toBe(true)
    })

    it('handles two-letter departments', () => {
        expect(quacksLikeDeptNum('ID 220')).toBe(true)
    })

    it('cares not how many spaces are between the dept and num', () => {
        expect(quacksLikeDeptNum('ASIAN    192')).toBe(true)
        expect(quacksLikeDeptNum('ASIAN192')).toBe(true)
    })

    it('cares not how many spaces are between the num and the section', () => {
        expect(quacksLikeDeptNum('ASIAN192B')).toBe(true)
        expect(quacksLikeDeptNum('ASIAN192 B')).toBe(true)
        expect(quacksLikeDeptNum('ASIAN192    B')).toBe(true)
    })
})
