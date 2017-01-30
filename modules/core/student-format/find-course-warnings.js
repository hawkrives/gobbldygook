import map from 'lodash/map'
import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import some from 'lodash/some'
import zip from 'lodash/zip'

import ordinal from 'ord'
import oxford from 'listify'
import plur from 'plur'
import { findScheduleTimeConflicts } from 'sto-sis-time-parser'
// import {expandYear, semesterName} from 'modules/schools/stolaf'
import { expandYear, semesterName } from 'modules/schools/stolaf/course-info'
// import {alertCircled, iosCalendarOutline, iosClockOutline} from 'modules/web/icons/ionicons'

export function checkForInvalidYear(course, scheduleYear) {
	let thisYear = new Date().getFullYear()

	if (course.year !== scheduleYear && scheduleYear <= thisYear) {
		return {
			warning: true,
			type: 'invalid-year',
			msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
			icon: 'alertCircled',
		}
	}

	return null
}

export function checkForInvalidSemester(course, scheduleSemester) {
	if (course.semester !== scheduleSemester) {
		return {
			warning: true,
			type: 'invalid-semester',
			msg: `Wrong Semester (originally from ${semesterName(course.semester)})`,
			icon: 'iosCalendarOutline',
		}
	}

	return null
}

export function checkForTimeConflicts(courses) {
	let conflicts = findScheduleTimeConflicts(courses)

	conflicts = map(conflicts, conflictSet => {
		if (some(conflictSet)) {
			// +1 to the indices because humans don't 0-index lists
			// eslint-disable-next-line no-confusing-arrow
			const conflicts = compact(map(conflictSet, (possibility, i) => (possibility === true) ? i + 1 : false))
			const conflicted = map(conflicts, i => `${i}${ordinal(i)}`)
			return {
				warning: true,
				type: 'time-conflict',
				msg: `Time conflict with the ${oxford(conflicted, { oxfordComma: true })} ${plur('course', conflicts.length)}`,
				icon: 'iosClockOutline',
			}
		}

		return null
	})

	return conflicts
}

export function findWarnings(courses, schedule) {
	let warningsOfInvalidity = map(courses, course => {
		let invalidYear = checkForInvalidYear(course, schedule.year)
		let invalidSemester = checkForInvalidSemester(course, schedule.semester)
		return [ invalidYear, invalidSemester ]
	})

	let timeConflicts = checkForTimeConflicts(courses)

	let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
	let warningsWithTimeConflicts = map(nearlyMerged, flatten)

	return warningsWithTimeConflicts
}
