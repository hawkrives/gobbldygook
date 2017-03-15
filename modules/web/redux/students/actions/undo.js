import { ActionTypes as UndoableActionTypes } from 'redux-undo'

export function undo(id) {
    return { type: UndoableActionTypes.UNDO, payload: { id } }
}

export function redo(id) {
    return { type: UndoableActionTypes.REDO, payload: { id } }
}
