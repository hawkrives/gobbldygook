// @flow

import {findWarnings} from './find-course-warnings'
import type {HydratedScheduleType} from './schedule'

// Checks to see if the schedule is valid
export function validateSchedule(schedule: HydratedScheduleType) {
	// only check the courses that have data
	let courses = schedule.courses.filter(c => c)

	// discover any warnings about the course load
	let conflicts = findWarnings(courses, schedule)
	let hasConflict = conflicts.some(perCourse =>
		perCourse.some(w => w && w.warning === true),
	)

	return {...schedule, hasConflict, conflicts}
}
