import {
	RELOAD_CACHED_COURSES,
	LOAD_COURSES,
	CACHE_COURSES_FROM_SCHEDULES,
} from '../constants'

import flatten from 'lodash/flatten'
import values from 'lodash/values'
import map from 'lodash/map'
import getCourses, {getCoursesFromSchedules} from '../../../helpers/get-courses'


export function reloadCachedCourses() {
	return (dispatch, getState) => {
		let {courses} = getState()

		courses = map(courses, ({clbid, term}) => ({clbid, term}))

		let action = { type: RELOAD_CACHED_COURSES, payload: getCourses(courses) }
		return dispatch(action)
	}
}

export function loadCourses() {
	return (dispatch, getState) => {
		let {students, courses} = getState()
		let schedules = flatten(map(students, student => values(student.data.present.schedules)))
		console.log('schedules', schedules)
		let action = { type: LOAD_COURSES, payload: getCoursesFromSchedules(schedules, courses) }
		return dispatch(action)
	}
}

export function cacheCoursesFromSchedules(schedules) {
	return (dispatch, getState) => {
		let {courses} = getState()
		let action = { type: CACHE_COURSES_FROM_SCHEDULES, payload: getCoursesFromSchedules(schedules, courses) }
		return dispatch(action)
	}
}
