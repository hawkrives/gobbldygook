// @flow
import type {Action} from 'redux'

import {
	REFRESH_COURSES,
	// LOAD_COURSES,
} from '../constants'

// import {flatten} from 'lodash'
// import {values} from 'lodash'
// import {map} from 'lodash'
// import {getCoursesFromSchedules} from '../../../helpers/get-courses'


export function refreshCourses(): Action {
	return { type: REFRESH_COURSES }
}

export function loadCourses() {
	throw new Error('This function does not work.')
	// return (dispatch, getState) => {
	// 	let {students, courses} = getState()
	// 	let schedules = flatten(map(students, student => values(student.data.present.schedules)))
	// 	console.log('schedules', schedules)
	// 	let action = { type: LOAD_COURSES, payload: getCoursesFromSchedules(schedules, courses) }
	// 	return dispatch(action)
	// }
}
