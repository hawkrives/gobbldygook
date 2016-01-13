import map from 'lodash/map'
import checkCoursesForTimeConflicts from './checkCoursesForTimeConflicts'

export default function findScheduleTimeConflicts(courses) {
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

	if (courses.hasOwnProperty('toArray')) {
		courses = courses.toArray()
	}

	let results = map(courses, c1 => {
		return map(courses, c2 => {
			let result = false
			if (c1 === c2) {
				result = null
			}
			else if (checkCoursesForTimeConflicts(c1, c2)) {
				result = true
			}
			return result
		})
	})

	return results
}
