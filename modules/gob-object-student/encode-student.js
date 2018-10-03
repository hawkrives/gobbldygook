// @flow

import stringify from 'stabilize'
import {Student} from './student'

export function prepareStudentForSave(student: Student) {
	return student.toJSON()
}

export function encodeStudent(student: Student) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
