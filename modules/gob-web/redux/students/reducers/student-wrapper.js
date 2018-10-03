// @flow

import {LOAD_STUDENT} from '../constants'
import type {Undoable, Action} from '../../types'
import {undoableReducer} from './student'
import {Student} from '@gob/object-student'

type State = Undoable<Student>

const initialState = {
	present: new Student(),
	past: [],
	future: [],
}

export function reducer(state: State = initialState, action: Action<*>) {
	const {type, payload} = action

	switch (type) {
		case LOAD_STUDENT: {
			return undoableReducer({...state, present: payload}, action)
		}

		default: {
			return undoableReducer(state, action)
		}
	}
}
