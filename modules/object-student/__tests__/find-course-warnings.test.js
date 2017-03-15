import { convertTimeStringsToOfferings } from 'sto-sis-time-parser'
import {
    checkForInvalidYear,
    checkForInvalidSemester,
    checkForTimeConflicts,
    findWarnings,
} from '../find-course-warnings'

describe('checkForInvalidYear', () => {
    it('checks for an invalid year on a course', () => {
        expect(checkForInvalidYear({ year: 1994 }, 2012)).toMatchSnapshot()
    })
})

describe('checkForInvalidSemester', () => {
    it('checks for an invalid semester on a course', () => {
        expect(checkForInvalidSemester({ semester: 2 }, 5)).toMatchSnapshot()
    })
})

xdescribe('checkForTimeConflicts', () => {})

xdescribe('findWarnings', () => {})
