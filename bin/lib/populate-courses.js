import flatten from 'lodash/array/flatten'
import includes from 'lodash/collection/includes'

import updateData from './update-local-data-cache'

import searchCourses from './search-for-courses'

export default async function populateCourses(student) {
	await updateData()
	const clbids = student.clbids || flatten(student.schedules.map(s => s.clbids))

	return searchCourses({riddles: course => includes(clbids, course.clbid)})
}
