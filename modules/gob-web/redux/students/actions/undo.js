// @flow

import {ActionTypes as UndoableActionTypes} from 'redux-undo'

export function undo(id: string) {
	return {type: UndoableActionTypes.UNDO, payload: {id}}
}

export function redo(id: string) {
	return {type: UndoableActionTypes.REDO, payload: {id}}
}
