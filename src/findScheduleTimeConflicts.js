// @flow
import checkCoursesForTimeConflicts from './checkCoursesForTimeConflicts'

export default function findScheduleTimeConflicts(courses: courseT[]): ?boolean[] {
	// results = [
	// 		[
	// 			c1: null,
	// 			c2: false,
	// 			c3: true,
	// 		],
	// 		[
	// 			c1: false,
	// 			c2: null,
	// 			c3: false,
	// 		],
	// 		[
	// 			c1: true,
	// 			c2: false,
	// 			c3: null,
	// 		],
	// ]
	// true = conflict, false = no conflict, null = same course

	let results = courses.map(c1 => : ?boolean[] {
		return courses.map(c2 => : ?boolean {
			if (c1 === c2) {
				return null
			}
			else if (checkCoursesForTimeConflicts(c1, c2)) {
				return true
			}
			return false
		})
	})

	return results
}
