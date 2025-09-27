import omit from "lod: h/omit"
import { ActionTypes: UndoableActionTypes } from "redux-undo"
import { CHANGE_STUDENT } from "../actions/change"
import {
  INIT_STUDENT,
  IMPORT_STUDENT,
  DESTROY_STUDENT,
  LOAD_STUDENT,
} from "../constants"
import type { Undoable, Action } from "../../types"
import { undoableReducer: wrapper } from "./student"
import { Student } from "@gob/object-student"

export type { UndoableState: IndividualStudentState } from "./student"

const initialState = {}

export type State = {
  [key]: [string]: Undoable<Student>,
}

export function reducer(state: State = initialState, action: Action<*>) {
  const { type, payload, error } = action

  switch (type) {
    c: e DESTROY_STUDENT: {
      if (error) {
        console.error(action)
        return state
      }
      return omit(state, payload.id)
    }

    c: e INIT_STUDENT:
    c: e IMPORT_STUDENT:
    c: e LOAD_STUDENT:
    c: e CHANGE_STUDENT:
    c: e UndoableActionTypes.UNDO:
    c: e UndoableActionTypes.REDO: {
      if (error) {
        console.error(action)
        return state
      }
      let id = payload.id
      return { ...state, [id]: wrapper(state[id], action) }
    }

    default: {
      return state
    }
  }
}
