import { removeStudentFromCache } from '../../../helpers/save-student'

import {
	DESTROY_STUDENT,
} from '../constants'

export function destroyStudent(studentId) {
  return new Promise(resolve => {
    removeStudentFromCache(studentId)
    localStorage.removeItem(studentId)

    resolve({ type: DESTROY_STUDENT, payload: { studentId } })
  })
}
