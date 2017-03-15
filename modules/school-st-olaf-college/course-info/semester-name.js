// @flow
'use strict'

const has = require('lodash/has')

const SEMESTERS = {
    '0': 'Abroad',
    '1': 'Fall',
    '2': 'Interim',
    '3': 'Spring',
    '4': 'Summer Session 1',
    '5': 'Summer Session 2',
    '9': 'Non-St. Olaf',
}

// Takes a semester number and returns the associated semester string.
function semesterName(semester: string | number): string {
    if (typeof semester === 'number') {
        semester = String(semester)
    }
    return has(SEMESTERS, semester)
    ? SEMESTERS[semester]
    : `Unknown (${semester})`
}

module.exports.semesterName = semesterName