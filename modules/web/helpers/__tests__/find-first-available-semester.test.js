// @flow
import { findFirstAvailableSemester } from '../find-first-available-semester'

describe('findFirstAvailableSemester', () => {
    describe('finds the first open semester', () => {
        it('for 2012', () => {
            let schedules = [
                { id: 14, year: 2012, semester: 1 },
                { id: 1, year: 2012, semester: 1 },
                { id: 2, year: 2012, semester: 2 },
                { id: 3, year: 2012, semester: 3 },
            ]

            expect(findFirstAvailableSemester(schedules, 2011)).toBe(1)
            expect(findFirstAvailableSemester(schedules, 2012)).toBe(4)
            expect(findFirstAvailableSemester(schedules, 2013)).toBe(1)
        })

        it('for 2013', () => {
            let schedules = [
                { id: 4, year: 2013, semester: 1 },
                { id: 5, year: 2013, semester: 2 },
                { id: 6, year: 2013, semester: 5 },
            ]

            expect(findFirstAvailableSemester(schedules, 2012)).toBe(1)
            expect(findFirstAvailableSemester(schedules, 2013)).toBe(3)
            expect(findFirstAvailableSemester(schedules, 2014)).toBe(1)
        })

        it('for 2014', () => {
            let schedules = [
                { id: 7, year: 2014, semester: 1 },
                { id: 8, year: 2014, semester: 2 },
                { id: 9, year: 2014, semester: 2 },
            ]

            expect(findFirstAvailableSemester(schedules, 2013)).toBe(1)
            expect(findFirstAvailableSemester(schedules, 2014)).toBe(3)
            expect(findFirstAvailableSemester(schedules, 2015)).toBe(1)
        })

        it('for 2015', () => {
            let schedules = [
                { id: 12, year: 2015, semester: 1 },
                { id: 13, year: 2015, semester: 3 },
                { id: 11, year: 2015, semester: 4 },
            ]

            expect(findFirstAvailableSemester(schedules, 2014)).toBe(1)
            expect(findFirstAvailableSemester(schedules, 2015)).toBe(2)
            expect(findFirstAvailableSemester(schedules, 2016)).toBe(1)
        })
    })

    it('handles years of 0', () => {
        let schedules = [
            {
                year: 0,
                semester: 0,
                active: true,
                id: 8,
                title: 'New Schedule',
                index: 1,
            },
        ]

        expect(findFirstAvailableSemester(schedules, 0)).toBe(1)
    })
})
