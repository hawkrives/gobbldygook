// @flow

import {List, Map} from 'immutable'
import ordinal from 'ord'
import oxford from 'listify'
import {findTimeConflicts} from '@gob/schedule-conflicts'
import {expandYear, semesterName} from '@gob/school-st-olaf-college'
import type {Course as CourseType, CourseError} from '@gob/types'
import {Schedule} from './schedule'

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
	course: CourseType,
	scheduleYear: number,
	thisYear: number = new Date().getFullYear(),
): ?WarningType {
	if (course.semester === 9 || course.semester === undefined) {
		return null
	}

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
	course: CourseType,
	scheduleSemester: number,
): ?WarningType {
	if (course.semester === scheduleSemester) {
		return null
	}

	const semString = semesterName(course.semester)
	return {
		warning: true,
		type: 'invalid-semester',
		msg: `Wrong Semester (originally from ${semString})`,
	}
}

export function checkForInvalidity(
	courses: List<CourseType>,
	{year, semester}: {year: number, semester: number},
): Map<string, List<?WarningType>> {
	let results = courses.map(course => {
		let invalidYear = checkForInvalidYear(course, year)
		let invalidSemester = checkForInvalidSemester(course, semester)
		return [course.clbid, List.of(invalidYear, invalidSemester)]
	})

	return Map(results)
}

export function checkForTimeConflicts(
	courses: List<CourseType>,
): Map<string, List<?WarningType>> {
	let results = courses
		.zip(findTimeConflicts(courses.toArray()))
		.map(([course, conflictSet]) => {
			if (!conflictSet.some(Boolean)) {
				return [course.clbid, List()]
			}

			// +1 to the indices because humans don't 0-index lists
			let conflicts = conflictSet
				.map((isConflict, i) => (isConflict ? i + 1 : false))
				.filter(conflictWith => conflictWith !== false)

			let conflicted = conflicts.map(i => `${String(i)}${ordinal(i)}`)

			let conflictsStr = oxford(conflicted, {oxfordComma: true})
			let word = conflicts.length === 1 ? 'course' : 'courses'

			let warning = {
				warning: true,
				type: 'time-conflict',
				msg: `Time conflict with the ${conflictsStr} ${word}`,
			}

			return [course.clbid, List.of(warning)]
		})

	return Map(results)
}

export function findWarnings(
	courses: List<CourseType | CourseError>,
	schedule: Schedule,
): Map<string, List<?WarningType>> {
	let {year, semester} = schedule

	let noErrors: List<any> = courses.filterNot((c: any) => c.error)
	let onlyCourses: List<CourseType> = noErrors

	let warningsOfInvalidity = checkForInvalidity(onlyCourses, {year, semester})
	let timeConflicts = checkForTimeConflicts(onlyCourses)

	return Map().mergeDeep(warningsOfInvalidity, timeConflicts)
}
