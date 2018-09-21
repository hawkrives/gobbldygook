import stringify from 'stabilize'
import mapValues from 'lodash/mapValues'

export function prepareStudentForSave(initialStudent) {
	// we're going to use object rest/spread to "omit" values from the objects

	let {
		areas: _areas,
		canGraduate: _can,
		fulfilled: _fulfilled,
		...student
	} = initialStudent

	student.schedules = mapValues(
		student.schedules,
		({courses: _courses, conflicts: _conflicts, hasConflict: _has, ...s}) =>
			s,
	)

	return student
}

export function encodeStudent(student) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
