import filter from 'lodash/filter'
import map from 'lodash/map'
import fromPairs from 'lodash/fromPairs'
import {getCourse} from './get-courses'

export function embedActiveStudentCourses(student, {cache = Object.create(null)}) {
	// - At it's core, this method just needs to get the list of courses that a student has chosen.
	// - Each schedule has a list of courses that are a part of that schedule.
	// - Additionally, we only care about the schedules that are marked as "active".
	// - Keep in mind that each list of courses is actually a *promise* for the courses.
	// - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
	// - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
	//   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.

	const active = filter(student.schedules, {active: true})

	const enhanced = map(active, schedule => {
		let courses = schedule.clbids.map(clbid => {
			if (clbid in cache) {
				return cache[clbid]
			}

			let sem = ['FA', 'WI', 'SP'].indexOf(schedule.semester) + 1
			let query = {clbid, term: `${schedule.year}${sem}`}
			return getCourse(query, student.fabrications)
		})

		return Promise.all(courses).then(fulfilledCourses => {
			return [schedule.id, {...schedule, courses: fulfilledCourses}]
		})
	})

	return Promise.all(enhanced).then(fulfilled => {
		return fromPairs(fulfilled)
	})
}
