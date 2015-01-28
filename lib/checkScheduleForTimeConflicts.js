import {map} from 'lodash'
import checkCoursesForTimeConflicts from './checkCoursesForTimeConflicts'

function checkScheduleForTimeConflicts(courses) {
	if (courses.toArray)
		courses = courses.toArray()

	for (let c1 of courses) {
		for (let c2 of courses) {
			if (c1 === c2)
				continue
			else if (checkCoursesForTimeConflicts(c1, c2))
				return true
		}
	}

	return false
}

export default checkScheduleForTimeConflicts
