// @flow

import {List} from 'immutable'
import {Student} from './student'
import type {Course as CourseType} from '@gob/types'
import type {CourseLookupFunc} from './types'

export async function getActiveCourses(
	student: Student,
	getCourse: CourseLookupFunc,
): Promise<Array<CourseType>> {
	let activeSchedules = student.schedules.filter(s => s.active)

	let promises = activeSchedules
		.toList()
		.map(s => s.getCourses(getCourse, student.fabrications))

	let courses = List(await Promise.all(promises)).flatMap(courses => courses)

	return [...courses]
}
