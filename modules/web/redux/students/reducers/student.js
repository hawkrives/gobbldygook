import undoable from 'redux-undo'

import {
    changeStudentName,
    changeStudentAdvisor,
    changeStudentCreditsNeeded,
    changeStudentMatriculation,
    changeStudentGraduation,
    changeStudentSetting,
    addAreaToStudent,
    removeAreaFromStudent,
    addScheduleToStudent,
    destroyScheduleFromStudent,
    moveCourseToSchedule,
    setOverrideOnStudent,
    removeOverrideFromStudent,
    addFabricationToStudent,
    removeFabricationFromStudent,
    renameScheduleInStudent,
    reorderScheduleInStudent,
    moveScheduleInStudent,
    addCourseToSchedule,
    removeCourseFromSchedule,
    reorderCourseInSchedule,
} from '../../../../object-student/student'

import {
    LOAD_STUDENT,
    INIT_STUDENT,
    IMPORT_STUDENT,
    CHANGE_NAME,
    CHANGE_ADVISOR,
    CHANGE_CREDITS_NEEDED,
    CHANGE_MATRICULATION,
    CHANGE_GRADUATION,
    CHANGE_SETTING,
    ADD_AREA,
    REMOVE_AREA,
    REMOVE_AREAS,
    ADD_SCHEDULE,
    DESTROY_SCHEDULE,
    DESTROY_SCHEDULES,
    RENAME_SCHEDULE,
    REORDER_SCHEDULE,
    MOVE_SCHEDULE,
    ADD_COURSE,
    REMOVE_COURSE,
    REORDER_COURSE,
    MOVE_COURSE,
    SET_OVERRIDE,
    REMOVE_OVERRIDE,
    ADD_FABRICATION,
    REMOVE_FABRICATION,
} from '../constants'

const initialState = {}

export function studentReducer(state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case INIT_STUDENT: {
            if (action.error) {
                return state
            }
            return payload
        }

        case CHANGE_NAME: {
            return changeStudentName(state, payload.name)
        }
        case CHANGE_ADVISOR: {
            return changeStudentAdvisor(state, payload.advisor)
        }
        case CHANGE_CREDITS_NEEDED: {
            return changeStudentCreditsNeeded(state, payload.credits)
        }
        case CHANGE_MATRICULATION: {
            return changeStudentMatriculation(state, payload.matriculation)
        }
        case CHANGE_GRADUATION: {
            return changeStudentGraduation(state, payload.graduation)
        }
        case CHANGE_SETTING: {
            return changeStudentSetting(state, payload.key, payload.value)
        }

        case ADD_AREA: {
            return addAreaToStudent(state, payload.area)
        }
        case REMOVE_AREA: {
            return removeAreaFromStudent(state, payload.areaQuery)
        }
        case REMOVE_AREAS: {
            for (const areaQuery of payload.areaQueries) {
                state = removeAreaFromStudent(state, areaQuery)
            }
            return state
        }

        case ADD_SCHEDULE: {
            return addScheduleToStudent(state, payload.schedule)
        }
        case DESTROY_SCHEDULE: {
            return destroyScheduleFromStudent(state, payload.scheduleId)
        }
        case DESTROY_SCHEDULES: {
            for (const id of payload.scheduleIds) {
                state = destroyScheduleFromStudent(state, id)
            }
            return state
        }
        case RENAME_SCHEDULE: {
            return renameScheduleInStudent(
                state,
                payload.scheduleId,
                payload.newTitle
            )
        }
        case REORDER_SCHEDULE: {
            return reorderScheduleInStudent(
                state,
                payload.scheduleId,
                payload.newIndex
            )
        }
        case MOVE_SCHEDULE: {
            return moveScheduleInStudent(state, payload.scheduleId, {
                year: payload.year,
                semester: payload.semester,
            })
        }

        case ADD_COURSE: {
            return addCourseToSchedule(state, payload.scheduleId, payload.clbid)
        }
        case REMOVE_COURSE: {
            return removeCourseFromSchedule(
                state,
                payload.scheduleId,
                payload.clbid
            )
        }
        case REORDER_COURSE: {
            return reorderCourseInSchedule(state, payload.scheduleId, {
                clbid: payload.clbid,
                index: payload.index,
            })
        }
        case MOVE_COURSE: {
            return moveCourseToSchedule(state, {
                fromScheduleId: payload.fromScheduleId,
                toScheduleId: payload.toScheduleId,
                clbid: payload.clbid,
            })
        }

        case SET_OVERRIDE: {
            return setOverrideOnStudent(state, payload.key, payload.value)
        }
        case REMOVE_OVERRIDE: {
            return removeOverrideFromStudent(state, payload.override)
        }
        case ADD_FABRICATION: {
            return addFabricationToStudent(state, payload.fabrication)
        }
        case REMOVE_FABRICATION: {
            return removeFabricationFromStudent(state, payload.fabricationId)
        }

        default: {
            return state
        }
    }
}

export default undoable(studentReducer, {
    limit: 10,

    filter(action, currentState, previousState) {
        // only save history when something has changed.
        return currentState !== previousState
    },

    // treat LOAD_STUDENTS as the beginning of history
    initTypes: [
        '@@redux/INIT',
        '@@INIT',
        LOAD_STUDENT,
        INIT_STUDENT,
        IMPORT_STUDENT,
    ],
})
