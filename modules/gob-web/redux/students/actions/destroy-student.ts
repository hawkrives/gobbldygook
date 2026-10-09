import { removeStudentFromCache } from "../../../helpers/save-student.ts"

import { DESTROY_STUDENT } from "../constants.ts"

export type DestroyStudentAction = {
  type: typeof DESTROY_STUDENT
  payload: { id: string }
}

export function destroyStudent(
  studentId: string,
): Promise<DestroyStudentAction> {
  return new Promise((resolve) => {
    removeStudentFromCache(studentId)
    localStorage.removeItem(studentId)

    resolve({ type: DESTROY_STUDENT, payload: { id: studentId } })
  })
}
