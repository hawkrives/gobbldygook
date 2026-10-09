import type { Student } from "@gob/object-student"
import { loadStudent as load } from "../../../helpers/load-student.ts"

import { LOAD_STUDENT } from "../constants.ts"

// redux-promise dispatches the action again once the student has loaded
export function loadStudent(id: string): {
  type: typeof LOAD_STUDENT
  payload: Promise<Student>
} {
  return { type: LOAD_STUDENT, payload: load(id) }
}
