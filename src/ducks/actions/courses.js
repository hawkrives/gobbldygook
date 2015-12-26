import {
	LOAD_COURSES,
} from '../constants/courses'

export function loadCourses(terms=[]) {
	return { type: LOAD_COURSES, payload: {terms} }
}
