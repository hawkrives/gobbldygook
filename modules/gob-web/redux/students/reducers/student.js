// @flow

import undoable from 'redux-undo'
import {Student} from '@gob/object-student'
import {CHANGE_STUDENT} from '../actions/change'
import {LOAD_STUDENT, INIT_STUDENT, IMPORT_STUDENT} from '../constants'

const initialState: Student = new Student()

function reducer(
	state: Student = initialState,
	action: {type: string, error?: boolean, payload: Student},
) {
	switch (action.type) {
		case INIT_STUDENT: {
			if (action.error) {
				return state
			}
			return action.payload
		}

		case CHANGE_STUDENT: {
			return action.payload
		}

		default: {
			return state
		}
	}
}

const undoableReducer = undoable(reducer, {
	limit: 10,

	filter(action, currentState, previousState) {
		// only save history when something has changed.
		return currentState !== previousState
	},

	// treat LOAD_STUDENTS as the beginning of history
	initTypes: [
		'@@redux/INIT',
		'@@INIT',
		LOAD_STUDENT,
		INIT_STUDENT,
		IMPORT_STUDENT,
	],
})

export {undoableReducer, reducer}
