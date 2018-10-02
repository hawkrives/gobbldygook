// @flow

import {findWarnings, type WarningType} from './find-course-warnings'
import {Schedule, type CourseLookupFunc} from './schedule'

// Checks to see if the schedule is valid
export async function validateSchedule(
	schedule: Schedule,
	lookupCourse: CourseLookupFunc
): Promise<{
	id: string,
	hasConflict: boolean,
	conflicts: Array<Array<?WarningType>>,
}> {
	let id = schedule.get('id')

	// only check the courses that have data
	let courses = await schedule.getCourses(lookupCourse)

	// discover any warnings about the course load
	let conflicts = findWarnings(courses, schedule)
	let hasConflict = conflicts.some(perCourse =>
		perCourse.some(w => w && w.warning === true),
	)

	return {id, hasConflict, conflicts}
}
