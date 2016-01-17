import { ga } from '../../../analytics'
import queryCourseDatabase from '../../../helpers/query-course-database'
import present from 'present'
import round from 'lodash/math/round'

import {
	UPDATE_QUERY,
	SUBMIT_QUERY,
	BEGIN_QUERY,
	SORT_RESULTS,
	GROUP_RESULTS,
	CLEAR_RESULTS,
	SET_PARTIAL_QUERY,
} from '../constants'

export function updateQuery(newQuery) {
	return { type: UPDATE_QUERY, payload: newQuery }
}

export function setPartialQuery(partial) {
	return { type: SET_PARTIAL_QUERY, payload: partial }
}

export function clearResults() {
	return { type: CLEAR_RESULTS }
}

export function sortResults(by) {
	return { type: SORT_RESULTS, payload: by }
}

export function groupResults(by) {
	return { type: GROUP_RESULTS, payload: by }
}

function beginQuery() {
	return { type: BEGIN_QUERY }
}

export function submitQuery() {
	return (dispatch, getState) => {
		const { search } = getState()
		const { query, partial, inProgress } = search

		if ((query.length === 0 && !partial) || inProgress) {
			return
		}

		ga('send', 'event', 'search_query', 'submit', query, 1)

		const startQueryTime = present()

		dispatch(beginQuery())
		const payload = queryCourseDatabase(query, partial)
			.then(results => {
				console.log(`query took ${round(present() - startQueryTime, 2)}ms.`)
				return results
			})

		return dispatch({ type: SUBMIT_QUERY, payload })
	}
}
