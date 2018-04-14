import map from 'lodash/map'
import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import some from 'lodash/some'
import zip from 'lodash/zip'

import ordinal from 'ord'
import oxford from 'listify'
import {findScheduleTimeConflicts} from 'sto-sis-time-parser'
import {expandYear, semesterName} from '@gob/school-st-olaf-college'

export function checkForInvalidYear(course, scheduleYear) {
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

export function checkForInvalidSemester(course, scheduleSemester) {
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

export function checkForTimeConflicts(courses) {
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

export function findWarnings(courses, schedule) {
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
