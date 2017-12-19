'use strict'
const map = require('lodash/map')
const flatten = require('lodash/flatten')
const compact = require('lodash/compact')
const some = require('lodash/some')
const zip = require('lodash/zip')

const ordinal = require('ord')
const oxford = require('listify')
const {findScheduleTimeConflicts} = require('sto-sis-time-parser')
const {
    expandYear,
    semesterName,
} = require('../school-st-olaf-college/course-info')

module.exports.checkForInvalidYear = checkForInvalidYear
function checkForInvalidYear(course, scheduleYear) {
    if (course.semester === 9 || course.semester === undefined) {
        return null
    }

    let thisYear = new Date().getFullYear()

    if (course.year !== scheduleYear && scheduleYear <= thisYear) {
        const yearString = expandYear(course.year, true, '–')
        return {
            warning: true,
            type: 'invalid-year',
            msg: `Wrong Year (originally from ${yearString})`,
        }
    }

    return null
}

module.exports.checkForInvalidSemester = checkForInvalidSemester
function checkForInvalidSemester(course, scheduleSemester) {
    if (course.semester === undefined) {
        return null
    }

    if (course.semester !== scheduleSemester) {
        const semString = semesterName(course.semester)
        return {
            warning: true,
            type: 'invalid-semester',
            msg: `Wrong Semester (originally from ${semString})`,
        }
    }

    return null
}

module.exports.checkForTimeConflicts = checkForTimeConflicts
function checkForTimeConflicts(courses) {
    let conflicts = findScheduleTimeConflicts(courses)

    conflicts = map(conflicts, conflictSet => {
        if (some(conflictSet)) {
            // +1 to the indices because humans don't 0-index lists
            const conflicts = compact(
                map(
                    conflictSet,
                    (possibility, i) => (possibility === true ? i + 1 : false)
                )
            )
            const conflicted = map(conflicts, i => `${i}${ordinal(i)}`)

            const conflictsStr = oxford(conflicted, {oxfordComma: true})
            const word = conflicts.length === 1 ? 'course' : 'courses'
            return {
                warning: true,
                type: 'time-conflict',
                msg: `Time conflict with the ${conflictsStr} ${word}`,
            }
        }

        return null
    })

    return conflicts
}

module.exports.findWarnings = findWarnings
function findWarnings(courses, schedule) {
    let warningsOfInvalidity = map(courses, course => {
        let invalidYear = checkForInvalidYear(course, schedule.year)
        let invalidSemester = checkForInvalidSemester(course, schedule.semester)
        return [invalidYear, invalidSemester]
    })

    let timeConflicts = checkForTimeConflicts(courses)

    let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
    let warningsWithTimeConflicts = map(nearlyMerged, flatten)

    return warningsWithTimeConflicts
}
