// @flow

import type {Course as CourseType} from '@gob/types'
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

const GROUP_BY_TO_KEY: {
	[key: GROUP_BY_KEY]: boolean | Function | Array<Function>,
} = {
	day: DAY_OF_WEEK,
	department: DEPARTMENT,
	gened: GEREQ,
	semester: SEMESTER,
	term: course => [YEAR(course), SEMESTER(course)].join(''),
	time: TIME_OF_DAY,
	year: YEAR,
	none: false,
}

const SORT_BY_TO_KEY: {[key: SORT_BY_KEY]: Function | Array<Function>} = {
	year: [YEAR, SEMESTER, DEPARTMENT, NUMBER, SECTION],
	title: [TITLE, DEPARTMENT, NUMBER, SECTION],
	department: [DEPARTMENT, NUMBER, SECTION],
	day: [DAY_OF_WEEK, DEPARTMENT, NUMBER, SECTION],
	time: [TIME_OF_DAY, DEPARTMENT, NUMBER, SECTION],
}

const REVERSE_ORDER: Set<GROUP_BY_KEY> = new Set(['year', 'term', 'semester'])

export function sortAndGroup(
	results: Array<CourseType>,
	args: {sorting: SORT_BY_KEY, grouping: GROUP_BY_KEY},
): Array<string | CourseType> {
	let {sorting, grouping} = args
	const start = present()

	// TODO: Speed this up! This preparation stuff takes ~230ms by itself,
	// with enough courses rendered. (like, say, {year: 2012})
	const sorted = sortBy(results, SORT_BY_TO_KEY[sorting])

	// Group them by term, then turn the object into an array of pairs.
	const groupedAndPaired = toPairs(groupBy(sorted, GROUP_BY_TO_KEY[grouping]))

	// Sort the result arrays by the first element, the term, because
	// object keys don't have an implicit sort.
	let processed = sortBy(groupedAndPaired, ([key]) => key)

	if (REVERSE_ORDER.has(grouping)) {
		// Also reverse it, so the most recent is at the top.
		processed.reverse()
	}

	console.info(`grouping/sorting took ${prettyMs(present() - start)}`)

	return flatten(flatten(processed))
}
