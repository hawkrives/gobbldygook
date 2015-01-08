import {map} from 'lodash'
import checkCourseTimeConflicts from './checkCourseTimeConflicts'

function checkScheduleTimeConflicts(courses) {
	// results = {
	// 		c1: {
	// 			c1: null,
	// 			c2: false,
	// 			c3: true
	// 		},
	// 		c2: {
	// 			c1: false,
	// 			c2: null,
	// 			c3: false
	// 		},
	// 		c3: {
	// 			c1: true,
	// 			c2: false,
	// 			c3: null,
	// 		}
	// }
	// true = conflict, false = no conflict, null = same course

	if (courses.toArray)
		courses = courses.toArray()

	let results = map(courses, (c1, c1idx) => {
		return map(courses, (c2, c2idx) => {
			let result = false
			if (c1 === c2)
				result = null
			else if (checkCourseTimeConflicts(c1, c2))
				result = true
			return result
		})
	})

	return results
}

export default checkScheduleTimeConflicts
