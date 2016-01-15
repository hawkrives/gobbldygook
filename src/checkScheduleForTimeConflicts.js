import checkCoursesForTimeConflicts from './checkCoursesForTimeConflicts'

export default function checkScheduleForTimeConflicts(courses) {
	// for (let c1 of courses) {
	// 	for (let c2 of courses) {
	// 		if (c1 === c2) {
	// 			continue
	// 		}
	// 		else if (checkCoursesForTimeConflicts(c1, c2)) {
	// 			return true
	// 		}
	// 	}
	// }

	return courses.some(c1 => courses.some(c2 =>
		checkCoursesForTimeConflicts(c1, c2)))
}
