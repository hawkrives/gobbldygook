import db from '../../../helpers/db'
import flatMap from 'lodash/array/flatMap'
import map from 'lodash/collection/map'
import loadArea from '../../../helpers/load-area'

import {
	LOAD_ALL_AREAS,
	LOADING_AREAS,
	RELOAD_CACHED_AREAS,
	START_LOAD_AREAS,
	LOAD_AREAS,
	CACHE_AREAS_FROM_STUDIES,
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

export function reloadCachedAreas() {
	return (dispatch, getState) => {
		dispatch(loadingAreas())
		const {areas} = getState()
		dispatch({ type: START_LOAD_AREAS, payload: areas })
		const areaPromises = Promise.all(map(areas, loadArea))
		return dispatch({ type: RELOAD_CACHED_AREAS, payload: areaPromises })
	}
}

export function loadAreas() {
	return (dispatch, getState) => {
		dispatch(loadingAreas())
		const {students} = getState()
		const areas = flatMap(students.present, student => student.studies)
		dispatch({ type: START_LOAD_AREAS, payload: areas })
		const areaPromises = Promise.all(map(areas, loadArea))
		return dispatch({ type: LOAD_AREAS, payload: areaPromises })
	}
}

export function cacheAreasFromStudies(areas) {
	return (dispatch, getState) => {
		dispatch(loadingAreas())
		dispatch({ type: START_LOAD_AREAS, payload: areas })
		const {areas: cachedAreas} = getState()
		const areaPromises = Promise.all(map(areas, area => loadArea(area, cachedAreas)))
		return dispatch({ type: CACHE_AREAS_FROM_STUDIES, payload: areaPromises })
	}
}
