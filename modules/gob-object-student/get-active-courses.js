// @flow

import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import {Student} from './student'
import type {Course as CourseType} from '@gob/types'
import type {CourseLookupFunc} from './types'

export async function getActiveCourses(
	student: Student,
	getCourse: CourseLookupFunc,
): Promise<Array<CourseType>> {
	let activeSchedules = this.schedules.filter(s => s.active)

	let promises = activeSchedules.map(s =>
		s.getCourses(getCourse, this.fabrications, {includeErrors: false}),
	)

	let courses: Array<CourseType> = await Promise.all(promises)

	return uniqBy(courses, course => course.clbid)
}
