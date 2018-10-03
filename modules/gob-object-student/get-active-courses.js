// @flow

import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import {Student} from './student'
import type {Course as CourseType} from '@gob/types'
import type {OnlyCourseLookupFunc} from './types'
import {List} from 'immutable'

export async function getActiveCourses(
	student: Student,
	getCourse: OnlyCourseLookupFunc,
): Promise<Array<CourseType>> {
	let activeSchedules = student.schedules.filter(s => s.active)

	let promises = activeSchedules
		.map(s => s.getOnlyCourses(getCourse).then(l => l.toArray()))
		.toList()
		.toArray()

	let courses: Array<Array<CourseType>> = await Promise.all(promises)

	return uniqBy(flatten(courses), course => course.clbid)
}
