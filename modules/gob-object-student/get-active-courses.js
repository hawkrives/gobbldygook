// @flow

import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import flatten from 'lodash/flatten'
import type {HydratedStudentType} from './student'
import type {Course as CourseType} from '@gob/types'

export function getActiveCourses(
	student: HydratedStudentType,
): Array<CourseType> {
	const activeSchedules = filter(student.schedules, s => s.active === true)

	let courses = flatten(activeSchedules.map(s => s.courses))
	let onlyCourses: Array<CourseType> = (courses.filter(
		(c: any) => c && !c.error,
	): Array<any>)
	return uniqBy(onlyCourses, course => course.clbid)
}
