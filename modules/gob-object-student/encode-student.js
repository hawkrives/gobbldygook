// @flow

import stringify from 'stabilize'
import mapValues from 'lodash/mapValues'

import type {
	HydratedStudentType,
	HydratedScheduleType,
} from '@gob/object-student'

export function prepareStudentForSave(initialStudent: HydratedStudentType) {
	// we're going to use object rest/spread to "omit" values from the objects

	let {
		areas: _areas,
		canGraduate: _can,
		fulfilled: _fulfilled,
		...student
	} = initialStudent

	student.schedules = mapValues(
		student.schedules,
		({
			courses: _courses,
			conflicts: _conflicts,
			hasConflict: _has,
			...s
		}: HydratedScheduleType) => s,
	)

	return student
}

export function encodeStudent(student: HydratedStudentType) {
	return encodeURIComponent(stringify(prepareStudentForSave(student)))
}
