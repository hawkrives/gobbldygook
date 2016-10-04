import {filter} from 'lodash'
import {findWarnings} from './find-course-warnings'
import {flatten} from 'lodash'
import {identity} from 'lodash'
import {map} from 'lodash'
import {some} from 'lodash'
import {reject} from 'lodash'
import {isUndefined} from 'lodash'

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
