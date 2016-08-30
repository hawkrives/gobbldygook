// @flow
import type {Action} from 'redux'
import {
	LOAD_ALL_AREAS,
	LOADING_AREAS,
} from '../constants'

type AreaOfStudy = {};
type State = {data: AreaOfStudy[], isLoading: boolean};
const initialState = {data: [], isLoading: false}

export default function reducer(state: State = initialState, action: Action) {
	const {type, payload} = action

	switch (type) {
		case LOADING_AREAS: {
			return {...state, isLoading: true}
		}

		case LOAD_ALL_AREAS: {
			return {...state, data: payload, isLoading: false}
		}

		default: {
			return state
		}
	}
}
