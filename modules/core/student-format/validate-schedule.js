// @flow
import {findWarnings} from './find-course-warnings'
import filter from 'lodash/filter'
import flatten from 'lodash/flatten'
import identity from 'lodash/identity'
import map from 'lodash/map'
import some from 'lodash/some'
import reject from 'lodash/reject'
import isUndefined from 'lodash/isUndefined'

export function validateSchedule(schedule) {
	// Checks to see if the schedule is valid
	let courses = schedule.courses

	// only check the courses that have data
	courses = reject(courses, isUndefined)

	// Step one: do any times conflict?
	const conflicts = findWarnings(courses, schedule)

	const flattened = flatten(conflicts)
	const filtered = filter(flattened, identity)
	const warnings = map(filtered, c => c.warning)
	const hasConflict = some(warnings, w => w === true)

	return {...schedule, hasConflict, conflicts}
}
