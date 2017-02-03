import stringify from 'stabilize'
import omit from 'lodash/omit'
import mapValues from 'lodash/mapValues'

export function prepareStudentForSave(student) {
	student = { ...student }
	student = omit(student, ['areas', 'canGraduate', 'fulfilled'])
	student.schedules = mapValues(student.schedules, s => omit(s, ['courses', 'conflicts', 'hasConflict']))
	return student
}

export function encodeStudent(student) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
