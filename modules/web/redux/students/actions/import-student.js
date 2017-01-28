import { Student } from 'modules/core'

import {
	IMPORT_STUDENT,
} from '../constants'

export function importStudent({ data, type }={}) {
  let stu = undefined
  if (type === 'application/json') {
    try {
      stu = JSON.parse(data)
    }
    catch (err) {
      return {
        type: IMPORT_STUDENT,
        error: true,
        payload: err,
      }
    }
  }
  else {
    return {
      type: IMPORT_STUDENT,
      error: true,
      payload: new TypeError(`importStudent: ${type} is an invalid data type`),
    }
  }

  if (!stu) {
    return {
      type: IMPORT_STUDENT,
      error: true,
      payload: new Error('Could not process data: ' + data),
    }
  }

  const fleshedStudent = new Student(stu)
  return { type: IMPORT_STUDENT, payload: fleshedStudent }
}
