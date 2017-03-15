// @flow
import { REFRESH_COURSES } from '../constants'

// import flatten from 'lodash/flatten'
// import values from 'lodash/values'
// import map from 'lodash/map'
// import {getCoursesFromSchedules} from '../../../helpers/get-courses'

export function refreshCourses(): { type: string } {
    return { type: REFRESH_COURSES }
}

export function loadCourses() {
    throw new Error('This function does not work.')
    // return (dispatch, getState) => {
    // 	let {students, courses} = getState()
    // 	let schedules = flatten(map(students, student => values(student.data.present.schedules)))
    // 	let action = { type: LOAD_COURSES, payload: getCoursesFromSchedules(schedules, courses) }
    // 	return dispatch(action)
    // }
}
