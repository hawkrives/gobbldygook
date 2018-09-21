// @flow

import {findWarnings} from './find-course-warnings'
import type {HydratedScheduleType} from './schedule'

export function validateSchedule(schedule: HydratedScheduleType) {
	// Checks to see if the schedule is valid
	let courses = schedule.courses

	// only check the courses that have data
	courses = courses.filter(c => c)

	// Step one: do any times conflict?
	const conflicts = findWarnings(courses, schedule)

	const warnings = conflicts.map(c => c && c.warning)
	const hasConflict = warnings.some(w => w === true)

	return {...schedule, hasConflict, conflicts}
}
