import uniqBy from 'lodash/uniqBy'
import filter from 'lodash/filter'
import flatMap from 'lodash/flatMap'

export function getActiveCourses(student) {
	const activeSchedules = filter(student.schedules, s => s.active === true)
	let courses = flatMap(activeSchedules, s => s.courses)
	courses = uniqBy(courses.filter(c => c), course => course.clbid)

	return courses
}
