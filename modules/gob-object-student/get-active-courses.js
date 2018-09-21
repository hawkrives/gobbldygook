// @flow

import uniqBy from 'lodash/uniqBy'
import flatMap from 'lodash/flatMap'
import type {StudentType} from './student'

export function getActiveCourses(student: StudentType) {
	const activeSchedules = student.schedules.filter(s => s.active === true)

	let courses = flatMap(activeSchedules, s => s.courses)
	courses = uniqBy(courses.filter(c => c), course => course.clbid)

	return courses
}
