// @flow
import some from 'lodash/some'
import checkCoursesForTimeConflicts from './check-courses-for-time-conflicts'

export default function checkScheduleForTimeConflicts(courses): boolean {
	return some(courses, c1 => some(courses, c2 =>
		checkCoursesForTimeConflicts(c1, c2)))
}
