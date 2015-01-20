import {map, flatten, findIndex, any, zip, clone} from 'lodash'
import {checkScheduleTimeConflicts} from 'sto-sis-time-parser'
import {ordinal} from 'humanize-plus'
import {isTrue} from 'sto-helpers/lib/is'
import expandYear from 'sto-helpers/lib/expandYear'
import semesterName from 'sto-helpers/lib/semesterName'

let checkForInvalidYear = (course, scheduleYear) => {
	let result = {
		warning: false,
		type: 'invalid-year',
		msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
		className: 'course-invalid-year',
	}

	let thisYear = new Date().getFullYear()

	if (course.year !== scheduleYear && scheduleYear <= thisYear)
		result.warning = true

	return result.warning ? result : null
}

let checkForInvalidSemester = (course, scheduleSemester) => {
	let result = {
		warning: false,
		type: 'invalid-semester',
		msg: `Wrong Semester (originally from ${semesterName(course.sem)})`,
		className: 'course-invalid-semester',
	}

	if (course.sem !== scheduleSemester)
		result.warning = true

	return result.warning ? result : null
}

let checkForTimeConflicts = (courses) => {
	let conflicts = checkScheduleTimeConflicts(courses)
	conflicts = map(conflicts, conflictSet => {
		let result = {
			warning: false,
			type: 'time-conflict',
			msg: '',
			className: 'course-time-conflict',
		}

		if (any(conflictSet)) {
			let conflictIndex = findIndex(conflictSet, isTrue)
			conflictIndex += 1 // because humans don't 0-index lists
			result.warning = true
			result.msg = `Time conflict with the ${ordinal(conflictIndex)} course`
		}

		return result.warning ? result : null
	})

	return conflicts
}

let findWarnings = (courses, schedule) => {
	let warningsOfInvalidity = map(courses, course => {
		let invalidYear = checkForInvalidYear(course, schedule.year)
		let invalidSemester = checkForInvalidSemester(course, schedule.semester)
		return [invalidYear, invalidSemester]
	})

	let timeConflicts = checkForTimeConflicts(courses)

	let nearlyMerged = zip(warningsOfInvalidity, timeConflicts)
	let warningsWithTimeConflicts = map(nearlyMerged, arr => flatten(arr, true))

	let allWarnings = warningsWithTimeConflicts

	return allWarnings
}

export default findWarnings
export {
	findWarnings,
	checkForTimeConflicts,
	checkForInvalidSemester,
	checkForInvalidYear
}
