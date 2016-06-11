import {map, flatten, compact, some, zip} from 'lodash-es'
import expandYear from '../helpers/expand-year'
import semesterName from '../helpers/semester-name'

const ordinal = require('ord')
const {oxford} = require('humanize-plus')
const plur = require('plur')
const {findScheduleTimeConflicts} = require('sto-sis-time-parser')

export function checkForInvalidYear(course, scheduleYear) {
	let thisYear = new Date().getFullYear()

	if (course.year !== scheduleYear && scheduleYear <= thisYear) {
		return {
			warning: true,
			type: 'invalid-year',
			msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
			icon: 'alert-circled',
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
			icon: 'ios-calendar-outline',
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
				msg: `Time conflict with the ${oxford(conflicted, {oxfordComma: true})} ${plur('course', conflicts.length)}`,
				icon: 'ios-clock-outline',
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
		return [invalidYear, invalidSemester]
	})

	let timeConflicts = checkForTimeConflicts(courses)

	let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
	let warningsWithTimeConflicts = map(nearlyMerged, flatten)

	let allWarnings = warningsWithTimeConflicts

	return allWarnings
}

export default findWarnings
