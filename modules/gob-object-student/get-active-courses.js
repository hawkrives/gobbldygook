// @flow

import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import flatMap from 'lodash/flatMap'
import type {StudentType} from './student'
import type {HydratedScheduleType} from './schedule'
import type {Course} from '@gob/types'

export function getActiveCourses(student: StudentType) {
	const activeSchedules = filter(student.schedules, s => s.active === true)

	let courses: Array<Course> = flatMap(activeSchedules, (s: HydratedScheduleType) => s.courses)
	courses = courses.filter(c => c)
	courses = uniqBy(courses, course => course.clbid)

	return courses
}
