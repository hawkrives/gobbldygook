import values from 'lodash/values'
import fromPairs from 'lodash/fromPairs'
import {getCourse} from './get-courses'

export async function embedActiveStudentCourses(
	student,
	{store = Object.create(null)},
) {
	// - At it's core, this method just needs to get the list of courses that a student has chosen.
	// - Each schedule has a list of courses that are a part of that schedule.
	// - Additionally, we only care about the schedules that are marked as "active".
	// - Keep in mind that each list of courses is actually a *promise* for the courses.
	// - We also need to make sure to de-duplicate the final list of courses, so that each `clbid` only appears once.
	// - Finally, remember that a given `clbid` might not exist in the database, in which case we get back 'undefined'.
	//   In this case, we need to know where the `clbid` came from, so that we can render an error in the correct location.

	let active = values(student.schedules).filter(s => s.active === true)

	let enhancedPromises = active.map(async schedule => {
		let courses = schedule.clbids.map(async clbid => {
			if (clbid in store) {
				return await store[clbid]
			}

			let term = parseInt(`${schedule.year}${schedule.semester}`, 10)
			let query = {clbid, term}

			return await getCourse(query, student.fabrications)
		})

		let fulfilledCourses = await Promise.all(courses)

		return [schedule.id, {...schedule, courses: fulfilledCourses}]
	})

	let fulfilled = await Promise.all(enhancedPromises)

	return fromPairs(fulfilled)
}
