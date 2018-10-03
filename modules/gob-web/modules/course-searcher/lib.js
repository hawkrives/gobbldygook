// @flow

import type {Course as CourseType} from '@gob/types'
import {List, Set} from 'immutable'
import oxford from 'listify'
import present from 'present'
import prettyMs from 'pretty-ms'
import {to12HourTime as to12} from '@gob/lib'
import {type SORT_BY_KEY, type GROUP_BY_KEY} from './constants'

const ALL_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function TITLE(course: CourseType): string {
	return course.title || course.name
}

function DAY_OF_WEEK(course: CourseType): string {
	if (!course.offerings) {
		return 'No Days Listed'
	}

	return Set((course.offerings || []).map(offer => offer.day))
		.sortBy(day => ALL_DAYS.indexOf(day))
		.join('/')
}

function TIME_OF_DAY(course: CourseType): string {
	if (!course.offerings) {
		return 'No Times Listed'
	}

	let times = course.offerings.map(
		time => `${to12(time.start)}-${to12(time.end)}`,
	)

	return oxford([...Set(times).sort()])
}

function DEPARTMENT(course: CourseType): string {
	return course.department ? course.department : 'No Department'
}

function NUMBER(course: CourseType): string {
	return String(course.number)
}

function SECTION(course: CourseType): string {
	return course.section || 'No Section'
}

function GEREQ(course: CourseType): string {
	return course.gereqs ? oxford(course.gereqs) : 'No GEs'
}

function YEAR(course: CourseType): string {
	return String(course.year)
}

function SEMESTER(course: CourseType): string {
	return String(course.semester)
}

const GROUP_BY_TO_KEY = {
	day: DAY_OF_WEEK,
	department: DEPARTMENT,
	gened: GEREQ,
	semester: SEMESTER,
	term: course => [YEAR(course), SEMESTER(course)].join(''),
	time: TIME_OF_DAY,
	year: YEAR,
	none: null,
}

const SORT_BY_TO_KEY: {[key: SORT_BY_KEY]: Array<(CourseType) => string>} = {
	year: [YEAR, SEMESTER, DEPARTMENT, NUMBER, SECTION],
	title: [TITLE, DEPARTMENT, NUMBER, SECTION],
	department: [DEPARTMENT, NUMBER, SECTION],
	day: [DAY_OF_WEEK, DEPARTMENT, NUMBER, SECTION],
	time: [TIME_OF_DAY, DEPARTMENT, NUMBER, SECTION],
}

const REVERSE_ORDER: Set<GROUP_BY_KEY> = Set.of('year', 'term', 'semester')

export function sortAndGroup(
	results: List<CourseType>,
	args: {sorting: SORT_BY_KEY, grouping: GROUP_BY_KEY},
): List<string | CourseType> {
	let {sorting, grouping} = args
	const start = present()

	for (let comparator of SORT_BY_TO_KEY[sorting]) {
		if (!comparator) {
			continue
		}
		results = results.sortBy(comparator)
	}

	let grouper = GROUP_BY_TO_KEY[grouping]
	if (!grouper) {
		throw new Error(`unknown grouping function "${grouping}"`)
	}

	let nestedResults = results
		.groupBy(grouper)
		.sortBy((_, key) => key)
		.toOrderedMap()
		.toList()

	if (REVERSE_ORDER.has(grouping)) {
		// Also reverse it, so the most recent is at the top.
		nestedResults = nestedResults.reverse()
	}

	nestedResults = nestedResults.flatten()

	console.info(`grouping/sorting took ${prettyMs(present() - start)}`)

	return nestedResults
}
