// @flow

import stringify from 'stabilize'
import mapValues from 'lodash/mapValues'

import {Student} from './student'

export function prepareStudentForSave(student: Student) {
	return student.toJSON()
}

export function encodeStudent(student: Student) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
