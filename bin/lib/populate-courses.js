import flatten from 'lodash/array/flatten'
// import difference from 'lodash/array/difference'
import includes from 'lodash/collection/includes'

import searchForCourses from './search-for-courses'

export async function getCoursesByClbid(clbids) {
	let courses = await searchForCourses({riddles: [course => includes(clbids, course.clbid)]})
	// console.log(courses)
	// let retrievedClbids = courses.map(c => c.clbid)
	// console.log(clbids)
	// console.log(retrievedClbids)
	// console.log(difference(clbids, retrievedClbids))
	return courses
}

export default async function populateCourses(student) {
	const clbids = student.clbids || flatten(student.schedules.filter(s => s.active).map(s => s.clbids))
	let courses = await getCoursesByClbid(clbids)
	courses = courses.map(c => {
		c.department = c.depts
		c.number = c.num
		return c
	})
	return courses
}
