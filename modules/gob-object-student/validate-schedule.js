// @flow

import {findWarnings, type WarningType} from './find-course-warnings'
import type {OnlyCourseLookupFunc} from './types'
import {Schedule} from './schedule'
import {Map, List} from 'immutable'

type Result = {
	id: string,
	hasConflict: boolean,
	conflicts: Map<string, List<?WarningType>>,
}

// Checks to see if the schedule is valid
export async function validateSchedule(
	schedule: Schedule,
	lookupCourse: OnlyCourseLookupFunc,
): Promise<Result> {
	let id = schedule.get('id')

	// only check the courses that have data
	let courses = await schedule.getOnlyCourses(lookupCourse)

	// discover any warnings about the course load
	let conflicts = findWarnings(courses, schedule)
	let hasConflict = conflicts.some(perCourse =>
		perCourse.some(w => w && w.warning === true),
	)

	return {id, hasConflict, conflicts}
}
