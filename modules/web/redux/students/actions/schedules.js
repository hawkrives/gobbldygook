import { Schedule } from '../../../../object-student'

import {
    ADD_SCHEDULE,
    DESTROY_SCHEDULE,
    DESTROY_SCHEDULES,
    RENAME_SCHEDULE,
    REORDER_SCHEDULE,
    MOVE_SCHEDULE,
} from '../constants'

export function addSchedule(studentId, schedule) {
    const sched = new Schedule(schedule)
    return { type: ADD_SCHEDULE, payload: { studentId, schedule: sched } }
}
export function destroySchedule(studentId, scheduleId) {
    return { type: DESTROY_SCHEDULE, payload: { studentId, scheduleId } }
}
export function destroySchedules(studentId, ...scheduleIds) {
    return { type: DESTROY_SCHEDULES, payload: { studentId, scheduleIds } }
}
export function renameSchedule(studentId, scheduleId, newTitle) {
    return {
        type: RENAME_SCHEDULE,
        payload: { studentId, scheduleId, newTitle },
    }
}
export function reorderSchedule(studentId, scheduleId, newIndex) {
    return {
        type: REORDER_SCHEDULE,
        payload: { studentId, scheduleId, newIndex },
    }
}
export function moveSchedule(studentId, scheduleId, year, semester) {
    return {
        type: MOVE_SCHEDULE,
        payload: { studentId, scheduleId, year, semester },
    }
}
