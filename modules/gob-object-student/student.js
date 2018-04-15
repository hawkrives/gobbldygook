import clone from 'lodash/clone'
import findIndex from 'lodash/findIndex'
import findKey from 'lodash/findKey'
import fromPairs from 'lodash/fromPairs'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import isNumber from 'lodash/isNumber'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import omit from 'lodash/omit'
import reject from 'lodash/reject'
import uuid from 'uuid/v4'
import debug from 'debug'
const log = debug('student-format:student')

import {randomChar} from '@gob/lib'

const now = new Date()
import {Schedule} from './schedule'

export function Student(data) {
    const baseStudent = {
        id: uuid(),
        name: 'Student ' + randomChar(),
        version: VERSION,

        creditsNeeded: 35,

        matriculation: now.getFullYear() - 2,
        graduation: now.getFullYear() + 2,
        advisor: '',

        dateLastModified: new Date(),
        dateCreated: new Date(),

        studies: [],
        schedules: {},
        overrides: {},
        fabrications: {},
        fulfillments: {},

        settings: {},
    }

    const student = Object.assign({}, baseStudent, data)

    if (isArray(student.schedules)) {
        student.schedules = fromPairs(
            map(student.schedules, s => [
                String(s.id),
                Object.assign({}, s, {id: String(s.id)}),
            ]),
        )
    }

    student.schedules = mapValues(student.schedules, Schedule)

    return student
}

////////
////////
////////

export function changeStudentName(student, newName) {
    if (student.name === newName) {
        return student
    }
    return Object.assign({}, student, {name: newName})
}

export function changeStudentAdvisor(student, newAdvisor) {
    if (student.advisor === newAdvisor) {
        return student
    }
    return Object.assign({}, student, {advisor: newAdvisor})
}

export function changeStudentCreditsNeeded(student, newCreditsNeeded) {
    if (student.creditsNeeded === newCreditsNeeded) {
        return student
    }
    return Object.assign({}, student, {creditsNeeded: newCreditsNeeded})
}

export function changeStudentMatriculation(student, newMatriculation) {
    if (student.matriculation === newMatriculation) {
        return student
    }
    return Object.assign({}, student, {matriculation: newMatriculation})
}

export function changeStudentGraduation(student, newGraduation) {
    if (student.graduation === newGraduation) {
        return student
    }
    return Object.assign({}, student, {graduation: newGraduation})
}

export function changeStudentSetting(student, key, value) {
    if (student.settings && student.settings[key] === value) {
        return student
    }
    return Object.assign({}, student, {
        settings: Object.assign({}, student.settings, {[key]: value}),
    })
}

export function addScheduleToStudent(student, newSchedule) {
    if (student.schedules instanceof Array) {
        throw new TypeError(
            'addScheduleToStudent: schedules must not be an array!',
        )
    }

    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [newSchedule.id]: newSchedule,
        }),
    })
}

export function destroyScheduleFromStudent(student, scheduleId) {
    log(`Student.destroySchedule(): removing schedule ${scheduleId}`)

    if (student.schedules instanceof Array) {
        throw new TypeError(
            'destroyScheduleFromStudent: schedules must not be an array!',
        )
    }

    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `Could not find a schedule with an ID of ${scheduleId}.`,
        )
    }

    const deadSched = student.schedules[scheduleId]
    const schedules = omit(student.schedules, scheduleId)

    if (deadSched && deadSched.active) {
        const otherSchedKey = findKey(
            schedules,
            sched =>
                sched.year === deadSched.year &&
                sched.semester === deadSched.semester &&
                sched.id !== deadSched.id,
        )

        /* istanbul ignore else */
        if (otherSchedKey) {
            schedules[otherSchedKey] = Object.assign(
                {},
                schedules[otherSchedKey],
                {active: true},
            )
        }
    }

    return Object.assign({}, student, {schedules})
}

export function addCourseToSchedule(student, scheduleId, clbid) {
    if (!isNumber(clbid)) {
        throw new TypeError('addCourse(): clbid must be a number')
    }

    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `Could not find a schedule with an ID of ${scheduleId}.`,
        )
    }

    let schedule = clone(student.schedules[scheduleId])

    // If the schedule already has the course we're adding, just return the student
    if (includes(schedule.clbids, clbid)) {
        return student
    }

    log(
        `adding clbid ${clbid} to schedule ${schedule.id} (${schedule.year}-${
            schedule.semester
        }.${schedule.index})`,
    )

    schedule.clbids = schedule.clbids.concat(clbid)

    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}

export function removeCourseFromSchedule(student, scheduleId, clbid) {
    if (!isNumber(clbid)) {
        throw new TypeError(
            `removeCourse(): clbid must be a number (was ${typeof clbid})`,
        )
    }

    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `Could not find a schedule with an ID of ${scheduleId}.`,
        )
    }

    let schedule = clone(student.schedules[scheduleId])

    // If the schedule doesn't have the course we're removing, just return the student
    if (!includes(schedule.clbids, clbid)) {
        return student
    }

    log(
        `removing clbid ${clbid} from schedule ${schedule.id} (${
            schedule.year
        }-${schedule.semester}.${schedule.index})`,
    )

    schedule.clbids = reject(schedule.clbids, id => id === clbid)

    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}

export function moveCourseToSchedule(
    student,
    {fromScheduleId, toScheduleId, clbid},
) {
    log(
        `moveCourseToSchedule(): moving ${clbid} from schedule ${fromScheduleId} to schedule ${toScheduleId}`,
    )

    student = removeCourseFromSchedule(student, fromScheduleId, clbid)
    student = addCourseToSchedule(student, toScheduleId, clbid)

    return Object.assign({}, student)
}

export function addAreaToStudent(student, areaOfStudy) {
    return Object.assign({}, student, {
        studies: [...student.studies, areaOfStudy],
    })
}

export function removeAreaFromStudent(student, areaQuery) {
    return Object.assign({}, student, {
        studies: reject(student.studies, areaQuery),
    })
}

export function setOverrideOnStudent(student, key, value) {
    let overrides = Object.assign({}, student.overrides)
    overrides[key] = value
    return Object.assign({}, student, {overrides})
}

export function removeOverrideFromStudent(student, key) {
    let overrides = omit(student.overrides, key)
    return Object.assign({}, student, {overrides})
}

export function addFabricationToStudent(student, fabrication) {
    if (!('clbid' in fabrication)) {
        throw new ReferenceError(
            'addFabricationToStudent: fabrications must include a clbid',
        )
    }
    if (typeof fabrication.clbid !== 'string') {
        throw new TypeError('addFabricationToStudent: clbid must be a string')
    }
    let fabrications = Object.assign({}, student.fabrications, {
        [fabrication.clbid]: fabrication,
    })
    return Object.assign({}, student, {fabrications})
}

export function removeFabricationFromStudent(student, fabricationId) {
    if (typeof fabricationId !== 'string') {
        throw new TypeError('removeCourseFromSchedule: clbid must be a string')
    }
    let fabrications = omit(student.fabrications, fabricationId)
    return Object.assign({}, student, {fabrications})
}

export function moveScheduleInStudent(
    student,
    scheduleId,
    {year, semester} = {},
) {
    if (year === undefined && semester === undefined) {
        throw new RangeError(
            'moveScheduleInStudent: Either year or semester must be provided.',
        )
    }
    if (!isUndefined(year) && !isNumber(year)) {
        throw new TypeError('moveScheduleInStudent: year must be a number.')
    }
    if (!isUndefined(semester) && !isNumber(semester)) {
        throw new TypeError('moveScheduleInStudent: semester must be a number.')
    }

    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `moveScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
        )
    }

    let schedule = clone(student.schedules[scheduleId])

    if (isNumber(year)) {
        schedule.year = year
    }
    if (isNumber(semester)) {
        schedule.semester = semester
    }

    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}

export function reorderScheduleInStudent(student, scheduleId, index) {
    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `reorderScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
        )
    }

    let schedule = Object.assign({}, student.schedules[scheduleId], {
        index: index,
    })
    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}

export function renameScheduleInStudent(student, scheduleId, title) {
    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `renameScheduleInStudent: Could not find a schedule with an ID of "${scheduleId}".`,
        )
    }

    let schedule = Object.assign({}, student.schedules[scheduleId], {
        title: title,
    })
    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}

export function reorderCourseInSchedule(student, scheduleId, {clbid, index}) {
    if (!isNumber(clbid)) {
        throw new TypeError('reorderCourse(): clbid must be a number')
    }

    if (!(scheduleId in student.schedules)) {
        throw new ReferenceError(
            `reorderCourseInSchedule: Could not find a schedule with an ID of "${scheduleId}".`,
        )
    }

    let schedule = clone(student.schedules[scheduleId])

    if (index < 0) {
        index = 0
    } else if (index >= schedule.clbids.length) {
        index = schedule.clbids.length - 1
    }

    const oldIndex = findIndex(schedule.clbids, id => id === clbid)

    if (oldIndex === -1) {
        throw new ReferenceError(
            `reorderCourseInSchedule: ${clbid} is not in schedule "${scheduleId}"`,
        )
    }

    schedule.clbids = [...schedule.clbids]
    schedule.clbids.splice(oldIndex, 1)
    schedule.clbids.splice(index, 0, clbid)

    return Object.assign({}, student, {
        schedules: Object.assign({}, student.schedules, {
            [schedule.id]: schedule,
        }),
    })
}
