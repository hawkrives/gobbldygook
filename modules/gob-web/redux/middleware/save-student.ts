import type { AnyAction, Middleware } from "redux"
import * as studentActions from "../students/constants"
import { ActionTypes as UndoableActionTypes } from "redux-undo"
import { saveStudent } from "../../helpers/save-student"
import type { RootState } from "../reducer"

const whitelist = new Set<string>([
  studentActions.INIT_STUDENT,
  studentActions.IMPORT_STUDENT,
  studentActions.CHANGE_STUDENT,
  UndoableActionTypes.UNDO,
  UndoableActionTypes.REDO,
])

export const shouldTakeAction = ({ type }: Readonly<{ type: string }>) => {
  return whitelist.has(type)
}

const saveStudentsMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action: AnyAction) => {
    if (!shouldTakeAction(action)) {
      return next(action)
    }

    console.log(action)

    // save a copy of the old state
    let oldState = store.getState()
    let oldStudents = oldState.students

    // dispatch the action along the chain
    // this is what actually changes the state
    let result: unknown = next(action)

    // grab a copy of the *new* state
    let newState = store.getState()
    let newStudents = newState.students

    if (oldStudents === newStudents) {
      return result
    }

    // get any student whose identity has changed
    let toSave = Object.values(newStudents)
      .map((s) => s.present)
      .filter((student) => {
        let old = oldStudents[student.id]
        return old === undefined || old.present !== student
      })

    // save them
    let promises = toSave.map((student) => saveStudent(student))

    return Promise.all(promises).then(() => result)
  }

export default saveStudentsMiddleware
