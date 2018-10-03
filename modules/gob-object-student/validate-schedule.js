// @flow

import {findWarnings, type WarningType} from './find-course-warnings'
import type {OnlyCourseLookupFunc} from './types'
import {Schedule} from './schedule'
import {Map, List} from 'immutable'

export type Result = {
	id: string,
	hasConflict: boolean,
	warnings: Map<string, List<?WarningType>>,
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
	let warnings = findWarnings(courses, schedule)
	let hasConflict = warnings.some(perCourse =>
		perCourse.some(w => w && w.warning === true),
	)

	return {id, hasConflict, warnings}
}
