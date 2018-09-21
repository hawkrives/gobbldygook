// @flow

import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import some from 'lodash/some'

import ordinal from 'ord'
import oxford from 'listify'
import {findTimeConflicts} from '@gob/schedule-conflicts'
import {expandYear, semesterName} from '@gob/school-st-olaf-college'

import type {Course} from '@gob/types'
import type {ScheduleType} from './schedule'

export type WarningTypeEnum = 'invalid-semester' | 'invalid-year' | 'time-conflict'

export type Warning = {
	warning: true,
	type: WarningTypeEnum,
	msg: string,
}

export function checkForInvalidYear(
	course: Course,
	scheduleYear: number,
): ?Warning {
	if (course.semester === 9 || course.semester === undefined) {
		return null
	}

	let thisYear = new Date().getFullYear()

	if (course.year !== scheduleYear && scheduleYear <= thisYear) {
		const yearString = expandYear(course.year, true, '–')
		return {
			warning: true,
			type: 'invalid-year',
			msg: `Wrong Year (originally from ${yearString})`,
		}
	}

	return null
}

export function checkForInvalidSemester(
	course: Course,
	scheduleSemester: number,
): ?Warning {
	if (course.semester === undefined) {
		return null
	}

	if (course.semester !== scheduleSemester) {
		const semString = semesterName(course.semester)
		return {
			warning: true,
			type: 'invalid-semester',
			msg: `Wrong Semester (originally from ${semString})`,
		}
	}

	return null
}

export function checkForTimeConflicts(courses: Array<Course>): Array<?Warning> {
	let conflicts = findTimeConflicts(courses)

	conflicts = conflicts.map(conflictSet => {
		if (some(conflictSet)) {
			// +1 to the indices because humans don't 0-index lists
			const conflicts = compact(
				conflictSet.map(
					(possibility, i) => (possibility === true ? i + 1 : false),
				),
			)
			const conflicted = conflicts.map(i => `${i}${ordinal(i)}`)

			const conflictsStr = oxford(conflicted, {oxfordComma: true})
			const word = conflicts.length === 1 ? 'course' : 'courses'
			return {
				warning: true,
				type: 'time-conflict',
				msg: `Time conflict with the ${conflictsStr} ${word}`,
			}
		}

		return null
	})

	return conflicts
}

export function findWarnings(
	courses: Array<Course>,
	schedule: ScheduleType,
): Array<?Warning> {
	let warningsOfInvalidity = courses.map(course => {
		let invalidYear = checkForInvalidYear(course, schedule.year)
		let invalidSemester = checkForInvalidSemester(course, schedule.semester)
		return [invalidYear, invalidSemester]
	})

	let timeConflicts = checkForTimeConflicts(courses)

	return flatten([...warningsOfInvalidity, ...timeConflicts])
}
