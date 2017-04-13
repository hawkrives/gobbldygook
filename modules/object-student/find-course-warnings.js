'use strict'
const map = require('lodash/map')
const flatten = require('lodash/flatten')
const compact = require('lodash/compact')
const some = require('lodash/some')
const zip = require('lodash/zip')

const ordinal = require('ord')
const oxford = require('listify')
const plur = require('plur')
const { findScheduleTimeConflicts } = require('sto-sis-time-parser')
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
        return {
            warning: true,
            type: 'invalid-year',
            msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
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
        return {
            warning: true,
            type: 'invalid-semester',
            msg: `Wrong Semester (originally from ${semesterName(course.semester)})`,
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
            return {
                warning: true,
                type: 'time-conflict',
                msg: `Time conflict with the ${oxford(conflicted, {
                    oxfordComma: true,
                })} ${plur('course', conflicts.length)}`,
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
        let invalidSemester = checkForInvalidSemester(
            course,
            schedule.semester
        )
        return [invalidYear, invalidSemester]
    })

    let timeConflicts = checkForTimeConflicts(courses)

    let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
    let warningsWithTimeConflicts = map(nearlyMerged, flatten)

    return warningsWithTimeConflicts
}
