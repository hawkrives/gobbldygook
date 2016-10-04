import {uniqBy} from 'lodash'
import {filter} from 'lodash'
import {flatMap} from 'lodash'

export function getActiveStudentCourses(student) {
	/*
	 - At it's core, this method just needs to get the list of courses that a student has chosen.
	 - Each schedule has a list of courses that are a part of that schedule.
	 - Additionally, we only care about the schedules that are marked as "active".
	 - Keep in mind that each list of courses is actually a *promise* for the courses.
	 - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
	 - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
	   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.
	 */

	const activeSchedules = filter(student.schedules, {active: true})
	let courses = flatMap(activeSchedules, s => s.courses)
	courses = uniqBy(filter(courses, c => c), course => course.clbid)

	return courses
}
