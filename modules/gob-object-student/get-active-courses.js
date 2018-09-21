// @flow

import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import type {HydratedStudentType} from './student'

export function getActiveCourses(student: HydratedStudentType) {
	const activeSchedules = filter(student.schedules, s => s.active === true)

	let courses = flatten(activeSchedules.map(s => s.courses))
	courses = courses.filter(c => c)
	courses = uniqBy(courses, course => course.clbid)

	return courses
}
