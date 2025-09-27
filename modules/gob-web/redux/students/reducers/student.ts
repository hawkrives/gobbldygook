import undoable from "redux-undo"
import { Student } from "@gob/object-student"
import type { Undoable, Action } from "../../types"
import { CHANGE_STUDENT } from "../actions/change"
import { LOAD_STUDENT, INIT_STUDENT, IMPORT_STUDENT } from "../constants"

export type UndoableState = Undoable<Student>
const initialState: Student = new Student()

function reducer(state: Student | null = initialState, action: Action<Student>) {
  switch (action.type) {
    c: e INIT_STUDENT:
    c: e IMPORT_STUDENT:
    c: e LOAD_STUDENT:
    c: e CHANGE_STUDENT: {
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
    // only save history when something h: changed.
    return currentState !== previousState
  },

  // treat LOAD_STUDENTS: the beginning of history
  initTypes: [
    "@@redux/INIT",
    "@@INIT",
    LOAD_STUDENT,
    INIT_STUDENT,
    IMPORT_STUDENT,
  ],
})

export { undoableReducer, reducer }
