import uniq from "lodash/uniq"
import type { Dispatch } from "redux"

import { loadStudent } from "./load-student"

export function loadStudents() {
  return (dispatch: Dispatch) => {
    // Get the list of students we know about, or the string 'null',
    // if localStorage doesn't have the key 'studentIds'.
    let stored: unknown = JSON.parse(
      localStorage.getItem("studentIds") ?? "null",
    )
    let studentIds = uniq(Array.isArray(stored) ? stored.map(String) : [])

    for (let id of studentIds) {
      dispatch(loadStudent(id))
    }
  }
}
