// @flow

import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import some from 'lodash/some'
import zip from 'lodash/zip'

import ordinal from 'ord'
import oxford from 'listify'
import {findTimeConflicts} from '@gob/schedule-conflicts'
import {expandYear, semesterName} from '@gob/school-st-olaf-college'

import type {Course, CourseError} from '@gob/types'
import type {ScheduleType} from './schedule'

export type WarningTypeEnum =
	| 'invalid-semester'
	| 'invalid-year'
	| 'time-conflict'

export type WarningType = {
	warning: true,
	type: WarningTypeEnum,
	msg: string,
}

export function checkForInvalidYear(
	course: Course,
	scheduleYear: number,
): ?WarningType {
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
): ?WarningType {
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

export function checkForInvalidity(
	courses: Array<Course>,
	{year, semester}: {year: number, semester: number},
): Array<[?WarningType, ?WarningType]> {
	return courses.map(course => {
		let invalidYear = checkForInvalidYear(course, year)
		let invalidSemester = checkForInvalidSemester(course, semester)
		return [invalidYear, invalidSemester]
	})
}

export function checkForTimeConflicts(courses: Array<Course>): Array<?WarningType> {
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
	courses: Array<Course | CourseError>,
	schedule: ScheduleType,
): Array<Array<?WarningType>> {
	let {year, semester} = schedule

	let onlyCourses: Array<Course> = (courses.filter(
		(c: any) => !c.error,
	): Array<any>)

	let warningsOfInvalidity = checkForInvalidity(onlyCourses, {year, semester})
	let timeConflicts = checkForTimeConflicts(onlyCourses)

	let nearlyMerged: Array<Array<Array<?WarningType>>> = (zip(
		warningsOfInvalidity,
		timeConflicts,
	): Array<any>)

	let allWarnings = nearlyMerged.map(flatten)

	return allWarnings
}
