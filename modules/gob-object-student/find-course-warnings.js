// @flow

import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import some from 'lodash/some'
import zip from 'lodash/zip'
import {List} from 'immutable'

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

type Course = CourseType | FabricationType

export function checkForInvalidYear(
	course: Course,
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
	courses: List<Course>,
	{year, semester}: {year: number, semester: number},
): List<List<?WarningType>> {
	return courses.map(course => {
		let invalidYear = checkForInvalidYear(course, year)
		let invalidSemester = checkForInvalidSemester(course, semester)
		return List([invalidYear, invalidSemester])
	})
}

export function checkForTimeConflicts(
	courses: List<Course>,
): List<?WarningType> {
	let conflicts = List(findTimeConflicts(courses.toArray()))

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
	courses: List<Course | CourseError>,
	schedule: Schedule,
): Array<Array<?WarningType>> {
	let [year, semester] = [schedule.get('year'), schedule.get('semester')]

	let onlyCourses = courses.filterNot(c => !c.error)

	let warningsOfInvalidity = checkForInvalidity(onlyCourses, {year, semester})
	let timeConflicts = checkForTimeConflicts(onlyCourses)

	let nearlyMerged: List<
		List<List<?WarningType>>,
	> = warningsOfInvalidity.zip(timeConflicts)

	let allWarnings = nearlyMerged.flatten(1)

	return allWarnings
}
