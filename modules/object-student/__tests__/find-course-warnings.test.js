import { convertTimeStringsToOfferings } from 'sto-sis-time-parser'
import {
    checkForInvalidYear,
    checkForInvalidSemester,
    checkForTimeConflicts,
    findWarnings,
} from '../find-course-warnings'

describe('checkForInvalidYear', () => {
    it('checks for an invalid year on a course', () => {
        expect(
            checkForInvalidYear({ year: 1994, semester: 1 }, 2012)
        ).toMatchSnapshot()
    })

    it('returns null if no semester is present', () => {
        expect(checkForInvalidYear({ year: 1994 }, 2012)).toBe(null)
    })

    it('returns null if the semester is "not from stolaf"', () => {
        expect(checkForInvalidYear({ year: 1994, semester: 9 }, 2012)).toBe(
            null
        )
    })
})

describe('checkForInvalidSemester', () => {
    it('checks for an invalid semester on a course', () => {
        expect(checkForInvalidSemester({ semester: 2 }, 5)).toMatchSnapshot()
    })

    it('returns null if no semester is given', () => {
        expect(checkForInvalidSemester({ semester: undefined }, 5)).toBe(null)
    })
})

xdescribe('checkForTimeConflicts', () => {})

xdescribe('findWarnings', () => {})
