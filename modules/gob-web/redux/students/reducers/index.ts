import omit from "lodash/omit"
import type { AnyAction } from "redux"
import { ActionTypes as UndoableActionTypes } from "redux-undo"
import { CHANGE_STUDENT } from "../actions/change"
import {
  INIT_STUDENT,
  IMPORT_STUDENT,
  DESTROY_STUDENT,
  LOAD_STUDENT,
} from "../constants"
import type { Undoable } from "../../types"
import { undoableReducer as wrapper } from "./student"
import type { Student } from "@gob/object-student"

export type { UndoableState as IndividualStudentState } from "./student"

export type State = Readonly<Record<string, Undoable<Student>>>

const initialState: State = {}

export function reducer(state: State = initialState, action: AnyAction): State {
  // every action reaches this reducer; the student actions, and undo and
  // redo, all carry the student's id in their payload
  const type: unknown = action.type
  const error: unknown = action["error"]
  const payload = action["payload"] as { id: string }

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
      return { ...state, [id]: wrapper(state[id], action) }
    }

    default: {
      return state
    }
  }
}
