import db from '../../../helpers/db'

import {
	LOAD_ALL_AREAS,
	LOADING_AREAS,
	REFRESH_AREAS,
} from '../constants'

export function loadingAreas() {
	return { type: LOADING_AREAS }
}

export function loadAllAreas() {
	return dispatch => {
		dispatch(loadingAreas())
		const areasPromise = db.store('areas').getAll()
		return dispatch({ type: LOAD_ALL_AREAS, payload: areasPromise })
	}
}

export function refreshAreas() {
	return dispatch => {
		return dispatch(loadAllAreas())
	}
}
