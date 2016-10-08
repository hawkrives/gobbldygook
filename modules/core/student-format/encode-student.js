import stringify from 'stabilize'
import {omit, mapValues} from 'lodash'

export function prepareStudentForSave(student) {
	student = {...student}
	student = omit(student, ['areas', 'canGraduate', 'fulfilled'])
	student.schedules = mapValues(student.schedules, s => omit(s, ['courses', 'conflicts', 'hasConflict']))
	return student
}

export function encodeStudent(student) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
