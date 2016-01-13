import filter from 'lodash/collection/filter'
import findWarnings from '../helpers/find-course-warnings'
import flatten from 'lodash/array/flatten'
import identity from 'lodash/utility/identity'
import pluck from 'lodash/collection/pluck'
import some from 'lodash/collection/some'
import reject from 'lodash/collection/reject'
import isUndefined from 'lodash/lang/isUndefined'

import getCoursesFromSchedule from './get-courses-from-schedule'

export default async function validateSchedule(schedule) {
	// Checks to see if the schedule is valid
	let courses = await getCoursesFromSchedule(schedule)

	// only check the courses that have data
	courses = reject(courses, isUndefined)

	// Step one: do any times conflict?
	const conflicts = findWarnings(courses, schedule)

	const flattened = flatten(conflicts)
	const filtered = filter(flattened, identity)
	const warnings = pluck(filtered, 'warning')
	const hasConflict = some(warnings, w => w === true)

	if (hasConflict) {
		debug('schedule conflicts', conflicts, hasConflict)
	}

	return {hasConflict, conflicts}
}
