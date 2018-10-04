// @flow

import omit from 'lodash/omit'
import {ActionTypes as UndoableActionTypes} from 'redux-undo'
import {CHANGE_STUDENT} from '../actions/change'
import {
	INIT_STUDENT,
	IMPORT_STUDENT,
	DESTROY_STUDENT,
	LOAD_STUDENT,
} from '../constants'
import type {Undoable, Action} from '../../types'
import {reducer as wrapper} from './student-wrapper'
import {Student} from '@gob/object-student'

export type {State as IndividualStudentState} from './student-wrapper'

const initialState = {}

export type State = {
	[key: string]: Undoable<Student>,
}

export function reducer(state: State = initialState, action: Action<*>) {
	const {type, payload, error} = action

	switch (type) {
		case INIT_STUDENT:
		case IMPORT_STUDENT: {
			if (error) {
				console.error(action)
				return state
			}
			return {...state, [payload.id]: wrapper(undefined, action)}
		}

		case DESTROY_STUDENT: {
			if (error) {
				console.error(action)
				return state
			}
			return omit(state, payload.id)
		}

		case LOAD_STUDENT:
		case CHANGE_STUDENT:
		case UndoableActionTypes.UNDO:
		case UndoableActionTypes.REDO: {
			if (error) {
				console.error(action)
				return state
			}
			let id = payload.id
			return {...state, [id]: wrapper(state[id], action)}
		}

		default: {
			return state
		}
	}
}
