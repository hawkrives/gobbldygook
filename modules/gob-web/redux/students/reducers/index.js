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
import {undoableReducer as wrapper} from './student'
import {Student} from '@gob/object-student'

export type {UndoableState as IndividualStudentState} from './student'

const initialState = {}

export type State = {
	[key: string]: Undoable<Student>,
}

export function reducer(state: State = initialState, action: Action<*>) {
	const {type, payload, error} = action

	switch (type) {
		case DESTROY_STUDENT: {
			if (error) {
				console.error(action)
				return state
			}
			return omit(state, payload.id)
		}

		case INIT_STUDENT:
		case IMPORT_STUDENT:
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
