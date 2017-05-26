// @flow
import db from '../../../helpers/db'
import map from 'lodash/map'
import loadArea from '../../../helpers/load-area'

import {
    LOAD_ALL_AREAS,
    LOADING_AREAS,
    REFRESH_AREAS,
    START_LOAD_AREAS,
} from '../constants'

export function loadingAreas(): { type: string } {
    return { type: LOADING_AREAS }
}

export function loadAllAreas() {
    return (dispatch: ({type: string}) => any) => {
        dispatch(loadingAreas())
        const areasPromise = db.store('areas').getAll()
        return dispatch({ type: LOAD_ALL_AREAS, payload: areasPromise })
    }
}

export function refreshAreas() {
    return (dispatch: ({type: string}) => any, getState: () => any) => {
        dispatch(loadingAreas())
        const areas = getState().areas.data
        dispatch({ type: START_LOAD_AREAS, payload: areas })
        const areaPromises = Promise.all(map(areas, loadArea))
        return dispatch({ type: REFRESH_AREAS, payload: areaPromises })
    }
}
