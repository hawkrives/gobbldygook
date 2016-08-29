// @flow
import some from 'lodash/some'
import checkCoursesForTimeConflicts from './checkCoursesForTimeConflicts'

export default function checkScheduleForTimeConflicts(courses: courseT[]): boolean {
	return some(courses, c1 => some(courses, c2 =>
		checkCoursesForTimeConflicts(c1, c2)))
}
