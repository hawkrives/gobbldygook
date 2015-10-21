import flatten from 'lodash/array/flatten'
import includes from 'lodash/collection/includes'

import searchCourses from './search-for-courses'

export default async function populateCourses(student) {
	const clbids = student.clbids || flatten(student.schedules.map(s => s.clbids))
	let courses = await searchCourses({riddles: [course => includes(clbids, course.clbid)]})
	courses = courses.map(c => {
		c.department = c.depts
		c.number = c.num
		return c
	})
	return courses
}
