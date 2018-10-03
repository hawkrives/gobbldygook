// @flow

import type {Course as CourseType} from '@gob/types'
import {List, Map} from 'immutable'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import flatten from 'lodash/flatten'
import toPairs from 'lodash/toPairs'
import oxford from 'listify'
import present from 'present'
import prettyMs from 'pretty-ms'
import {to12HourTime as to12} from '@gob/lib'
import {type SORT_BY_KEY, type GROUP_BY_KEY} from './constants'

const ALL_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function TITLE(course: CourseType) {
	return course.title || course.name
}

function DAY_OF_WEEK(course: CourseType) {
	if (!course.offerings) {
		return 'No Days Listed'
	}

	let days = [...new Set((course.offerings || []).map(offer => offer.day))]
	let sorted = sortBy(days, day => ALL_DAYS.indexOf(day))
	return sorted.join('/')
}

function TIME_OF_DAY(course: CourseType) {
	if (!course.offerings) {
		return 'No Times Listed'
	}

	let times = course.offerings.map(
		time => `${to12(time.start)}-${to12(time.end)}`,
	)

	return oxford(sortBy([...new Set(times)]))
}

function DEPARTMENT(course: CourseType) {
	return course.department ? course.department : 'No Department'
}

function NUMBER(course: CourseType) {
	return course.number
}

function SECTION(course: CourseType) {
	return course.section || 'No Section'
}

function GEREQ(course: CourseType) {
	return course.gereqs ? oxford(course.gereqs) : 'No GEs'
}

function YEAR(course: CourseType) {
	return course.year
}

function SEMESTER(course: CourseType) {
	return course.semester
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

const SORT_BY_TO_KEY: {[key: SORT_BY_KEY]: Array<Function>} = {
	year: [YEAR, SEMESTER, DEPARTMENT, NUMBER, SECTION],
	title: [TITLE, DEPARTMENT, NUMBER, SECTION],
	department: [DEPARTMENT, NUMBER, SECTION],
	day: [DAY_OF_WEEK, DEPARTMENT, NUMBER, SECTION],
	time: [TIME_OF_DAY, DEPARTMENT, NUMBER, SECTION],
}

const REVERSE_ORDER: Set<GROUP_BY_KEY> = new Set(['year', 'term', 'semester'])

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
