import Bluebird from 'bluebird'
import db from '../../../helpers/db'
import map from 'lodash/map'
import loadArea from '../../../helpers/load-area'

import {
	LOAD_ALL_AREAS,
	LOADING_AREAS,
	REFRESH_AREAS,
	START_LOAD_AREAS,
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
	return (dispatch, getState) => {
		dispatch(loadingAreas())
		const areas = getState().areas.data
		dispatch({ type: START_LOAD_AREAS, payload: areas })
		const areaPromises = Bluebird.all(map(areas, loadArea))
		return dispatch({ type: REFRESH_AREAS, payload: areaPromises })
	}
}
