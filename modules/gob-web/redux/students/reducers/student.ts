import undoable from "redux-undo"
import type { AnyAction } from "redux"
import { Student } from "@gob/object-student"
import type { Undoable } from "../../types"
import { CHANGE_STUDENT } from "../actions/change"
import { LOAD_STUDENT, INIT_STUDENT, IMPORT_STUDENT } from "../constants"

export type UndoableState = Undoable<Student>

type StudentAction = {
  type:
    | typeof INIT_STUDENT
    | typeof IMPORT_STUDENT
    | typeof LOAD_STUDENT
    | typeof CHANGE_STUDENT
  payload: Student
}

const initialState: Student = new Student()

function reducer(
  state: Student | undefined = initialState,
  action: AnyAction,
): Student {
  switch (action.type) {
    case INIT_STUDENT:
    case IMPORT_STUDENT:
    case LOAD_STUDENT:
    case CHANGE_STUDENT: {
      return (action as StudentAction).payload
    }

    default: {
      return state
    }
  }
}

const undoableReducer = undoable(reducer, {
  limit: 10,

  filter(_action, currentState, previousState) {
    // only save history when something has changed.
    return currentState !== previousState
  },

  // treat LOAD_STUDENTS as the beginning of history
  initTypes: [
    "@@redux/INIT",
    "@@INIT",
    LOAD_STUDENT,
    INIT_STUDENT,
    IMPORT_STUDENT,
  ],
})

export { undoableReducer, reducer }
