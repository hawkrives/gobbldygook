import {
	LOAD_COURSES,
	REFRESH_COURSES,
} from '../constants'

export function loadCourses() {
	return { type: LOAD_COURSES }
}

export function refreshCourses() {
	return { type: REFRESH_COURSES }
}
