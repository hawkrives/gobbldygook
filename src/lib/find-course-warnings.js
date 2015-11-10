import map from 'lodash/collection/map'
import flatten from 'lodash/array/flatten'
import compact from 'lodash/array/compact'
import any from 'lodash/collection/any'
import zip from 'lodash/array/zip'

import ordinal from 'ord'
import {oxford} from 'humanize-plus'
import plur from 'plur'
import {findScheduleTimeConflicts} from 'sto-sis-time-parser'
import isTrue from '../helpers/is-true'
import expandYear from '../helpers/expand-year'
import semesterName from '../helpers/semester-name'

export function checkForInvalidYear(course, scheduleYear) {
	let result = {
		warning: false,
		type: 'invalid-year',
		msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
		icon: 'ionicon-alert-circled',
	}

	let thisYear = new Date().getFullYear()

	if (course.year !== scheduleYear && scheduleYear <= thisYear) {
		result.warning = true
	}

	return result.warning ? result : null
}

export function checkForInvalidSemester(course, scheduleSemester) {
	let result = {
		warning: false,
		type: 'invalid-semester',
		msg: `Wrong Semester (originally from ${semesterName(course.semester)})`,
		icon: 'ionicon-ios-calendar-outline',
	}

	if (course.semester !== scheduleSemester) {
		result.warning = true
	}

	return result.warning ? result : null
}

export function checkForTimeConflicts(courses) {
	let conflicts = findScheduleTimeConflicts(courses)
	conflicts = map(conflicts, conflictSet => {
		let result = {
			warning: false,
			type: 'time-conflict',
			msg: '',
			icon: 'ionicon-ios-clock-outline',
		}

		if (any(conflictSet)) {
			// +1 to the indices because humans don't 0-index lists
			const conflicts = compact(map(conflictSet, (possibility, i) => isTrue(possibility) ? i + 1 : false))
			const conflicted = map(conflicts, i => `${i}${ordinal(i)}`)
			result.warning = true
			result.msg = `Time conflict with the ${oxford(conflicted, {oxfordComma: true})} ${plur('course', conflicts.length)}`
		}

		return result.warning ? result : null
	})

	return conflicts
}

export function findWarnings(courses, schedule) {
	let warningsOfInvalidity = map(courses, course => {
		let invalidYear = checkForInvalidYear(course, schedule.year)
		let invalidSemester = checkForInvalidSemester(course, schedule.semester)
		return [invalidYear, invalidSemester]
	})

	let timeConflicts = checkForTimeConflicts(courses)

	let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
	let warningsWithTimeConflicts = map(nearlyMerged, flatten)

	let allWarnings = warningsWithTimeConflicts

	return allWarnings
}

export default findWarnings
