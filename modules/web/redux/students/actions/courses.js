import {
    ADD_COURSE,
    REMOVE_COURSE,
    REORDER_COURSE,
    MOVE_COURSE,
} from '../constants'

export function addCourse(studentId, scheduleId, clbid) {
    return { type: ADD_COURSE, payload: { studentId, scheduleId, clbid } }
}
export function removeCourse(studentId, scheduleId, clbid) {
    return { type: REMOVE_COURSE, payload: { studentId, scheduleId, clbid } }
}
export function reorderCourse(studentId, scheduleId, clbid, index) {
    return {
        type: REORDER_COURSE,
        payload: { studentId, scheduleId, clbid, index },
    }
}
export function moveCourse(studentId, fromScheduleId, toScheduleId, clbid) {
    return {
        type: MOVE_COURSE,
        payload: { studentId, fromScheduleId, toScheduleId, clbid },
    }
}
