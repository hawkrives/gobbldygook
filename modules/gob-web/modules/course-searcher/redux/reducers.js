import {
	UPDATE_QUERY,
	SUBMIT_QUERY,
	BEGIN_QUERY,
	SORT_RESULTS,
	GROUP_RESULTS,
	CLEAR_RESULTS,
	SET_PARTIAL_QUERY,
} from './constants'

import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import flatten from 'lodash/flatten'
import toPairs from 'lodash/toPairs'
import round from 'lodash/round'
import oxford from 'listify'
import present from 'present'

import {
	SORT_BY,
	GROUP_BY,
} from '../../../modules/course-searcher/course-searcher-options'

import {to12HourTime as to12} from '@gob/lib'
const REVERSE_ORDER = new Set(['Year', 'Term', 'Semester'])

const TITLE = course => course.title || course.name

const ALL_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const DAY_OF_WEEK = course => {
	if (!course.offerings) {
		return 'No Days Listed'
	}

	let days = [...new Set((course.offerings || []).map(offer => offer.day))]
	let sorted = sortBy(days, day => ALL_DAYS.indexOf(day))
	return sorted.join('/')
}

const TIME_OF_DAY = course => {
	if (!course.offerings) {
		return 'No Times Listed'
	}

	let times = course.offerings.map(
		time => `${to12(time.start)}-${to12(time.end)}`,
	)

	return oxford(sortBy([...new Set(times)]))
}

const DEPARTMENT = course =>
	course.department ? course.department : 'No Department'

const NUMBER = course => course.number

const SECTION = course => course.section || 'No Section'

const GEREQ = course => (course.gereqs ? oxford(course.gereqs) : 'No GEs')

const YEAR = course => course.year

const SEMESTER = course => course.semester

const GROUP_BY_TO_KEY = {
	'Day of Week': DAY_OF_WEEK,
	Department: DEPARTMENT,
	GenEd: GEREQ,
	Semester: SEMESTER,
	Term: course => [YEAR(course), SEMESTER(course)].join(''),
	'Time of Day': TIME_OF_DAY,
	Year: YEAR,
	None: false,
}

const SORT_BY_TO_KEY = {
	Year: [YEAR, SEMESTER, DEPARTMENT, NUMBER, SECTION],
	Title: [TITLE, DEPARTMENT, NUMBER, SECTION],
	Department: [DEPARTMENT, NUMBER, SECTION],
	'Day of Week': [DAY_OF_WEEK, DEPARTMENT, NUMBER, SECTION],
	'Time of Day': [TIME_OF_DAY, DEPARTMENT, NUMBER, SECTION],
}

function sortAndGroup({sortBy: sorting, groupBy: grouping, rawResults}) {
	const start = present()

	// TODO: Speed this up! This preparation stuff takes ~230ms by itself,
	// with enough courses rendered. (like, say, {year: 2012})
	const sorted = sortBy(rawResults, SORT_BY_TO_KEY[sorting])

	// Group them by term, then turn the object into an array of pairs.
	const groupedAndPaired = toPairs(groupBy(sorted, GROUP_BY_TO_KEY[grouping]))

	// Sort the result arrays by the first element, the term, because
	// object keys don't have an implicit sort.
	let processed = sortBy(groupedAndPaired, ([key]) => key)

	if (REVERSE_ORDER.has(grouping)) {
		// Also reverse it, so the most recent is at the top.
		processed.reverse()
	}

	console.info('grouping/sorting took', round(present() - start, 2), 'ms')

	return flatten(flatten(processed))
}

const initialState = {
	error: '',
	groupBy: GROUP_BY['term'],
	hasQueried: false,
	inProgress: false,
	partial: {},
	rawResults: [],
	query: '',
	results: [],
	sortBy: SORT_BY['year'],
}

export default function reducer(state = initialState, action) {
	const {type, payload} = action

	switch (type) {
		case UPDATE_QUERY: {
			return {...state, query: payload}
		}

		case SET_PARTIAL_QUERY: {
			return {...state, partial: payload}
		}

		case BEGIN_QUERY: {
			return {...state, inProgress: true}
		}

		case SORT_RESULTS: {
			state = {...state, sortBy: payload}
			const results = sortAndGroup(state)
			return {...state, results}
		}

		case GROUP_RESULTS: {
			state = {...state, groupBy: payload}
			const results = sortAndGroup(state)
			return {...state, results}
		}

		case SUBMIT_QUERY: {
			state = {
				...state,
				rawResults: payload,
				inProgress: false,
				hasQueried: true,
			}
			const results = sortAndGroup(state)
			return {...state, results}
		}

		case CLEAR_RESULTS: {
			return {...state, results: [], rawResults: [], inProgress: false}
		}

		default: {
			return state
		}
	}
}
