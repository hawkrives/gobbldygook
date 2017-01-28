import { expect } from 'chai'
import { convertTimeStringsToOfferings } from 'sto-sis-time-parser'
import {
	checkForInvalidYear,
	checkForInvalidSemester,
	checkForTimeConflicts,
	findWarnings,
} from '../find-course-warnings'

describe('checkForInvalidYear', () => {
  it('checks for an invalid year on a course', () => {
    expect(checkForInvalidYear({ year: 1994 }, 2012)).to.deep.equal({
      warning: true,
      type: 'invalid-year',
      msg: 'Wrong Year (originally from 1994–95)',
      icon: 'alertCircled',
    })
  })
})

describe('checkForInvalidSemester', () => {
  it('checks for an invalid semester on a course', () => {
    expect(checkForInvalidSemester({ semester: 2 }, 5)).to.deep.equal({
      warning: true,
      type: 'invalid-semester',
      msg: 'Wrong Semester (originally from Interim)',
      icon: 'iosCalendarOutline',
    })
  })
})

xdescribe('checkForTimeConflicts', () => {
})

xdescribe('findWarnings', () => {
})
