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

import { SORT_BY, GROUP_BY } from '../../../modules/course-searcher/course-searcher-options'

import includes from 'lodash/includes'
import uniq from 'lodash/uniq'
import flatMap from 'lodash/flatMap'
import toPairs from 'lodash/toPairs'
import round from 'lodash/round'
import oxford from 'listify'
import map from 'lodash/map'
import present from 'present'
import debug from 'debug'
const log = debug('web:redux:search')

import { buildDeptString } from '../../../../school-st-olaf-college/deptnums'
import { to12HourTime } from '../../../../lib/to-12-hour-time'
const REVERSE_ORDER = ['Year', 'Term', 'Semester']

// eslint-disable-next-line no-confusing-arrow
const DAY_OF_WEEK = course => course.offerings
	? map(course.offerings, offer => offer.day).join('/')
	: 'No Days Listed'

// eslint-disable-next-line no-confusing-arrow
const TIME_OF_DAY = course => course.offerings
	? oxford(sortBy(uniq(flatMap(course.offerings, offer =>
		map(offer.times, time => `${to12HourTime(time.start)}-${to12HourTime(time.end)}`)))))
	: 'No Times Listed'

// eslint-disable-next-line no-confusing-arrow
const DEPARTMENT = course => course.departments
	? buildDeptString(course.departments)
	: 'No Department'

// eslint-disable-next-line no-confusing-arrow
const GEREQ = course => course.gereqs ? oxford(course.gereqs) : 'No GEs'

const GROUP_BY_TO_KEY = {
	'Day of Week': DAY_OF_WEEK,
	'Department': DEPARTMENT,
	'GenEd': GEREQ,
	'Semester': 'semester',
	'Term': 'term',
	'Time of Day': TIME_OF_DAY,
	'Year': 'year',
	'None': false,
}

const SORT_BY_TO_KEY = {
	'Year': 'year',
	'Title': 'title',
	// eslint-disable-next-line no-confusing-arrow
	'Department': DEPARTMENT,
	'Day of Week': DAY_OF_WEEK,
	'Time of Day': TIME_OF_DAY,
}


function sortAndGroup({ sortBy: sorting, groupBy: grouping, rawResults }) {
	const start = present()

	// TODO: Speed this up! This preperation stuff takes ~230ms by itself,
	// with enough courses rendered. (like, say, {year: 2012})
	const sortByArgs = ['year', 'deptnum', 'semester', 'section'].concat(SORT_BY_TO_KEY[sorting])
	const sorted = sortBy(rawResults, sortByArgs)

	// Group them by term, then turn the object into an array of pairs.
	const groupedAndPaired = toPairs(groupBy(sorted, GROUP_BY_TO_KEY[grouping]))

	// Sort the result arrays by the first element, the term, because
	// object keys don't have an implicit sort.
	let processed = sortBy(groupedAndPaired, group => group[0])

	if (includes(REVERSE_ORDER, grouping)) {
		// Also reverse it, so the most recent is at the top.
		processed.reverse()
	}

	log('grouping/sorting took', round(present() - start, 2), 'ms')

	return processed
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
	const { type, payload } = action

	switch (type) {
		case UPDATE_QUERY: {
			return { ...state, query: payload }
		}

		case SET_PARTIAL_QUERY: {
			return { ...state, partial: payload }
		}

		case BEGIN_QUERY: {
			return { ...state, inProgress: true }
		}

		case SORT_RESULTS: {
			state = { ...state, sortBy: payload }
			const results = sortAndGroup(state)
			return { ...state, results }
		}

		case GROUP_RESULTS: {
			state = { ...state, groupBy: payload }
			const results = sortAndGroup(state)
			return { ...state, results }
		}

		case SUBMIT_QUERY: {
			state = {
				...state,
				rawResults: payload,
				inProgress: false,
				hasQueried: true,
			}
			const results = sortAndGroup(state)
			return { ...state, results }
		}

		case CLEAR_RESULTS: {
			return { ...state, results: [], rawResults: [], inProgress: false }
		}

		default: {
			return state
		}
	}
}
