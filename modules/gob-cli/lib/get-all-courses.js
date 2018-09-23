import {getCourse} from './get-course'
import flatten from 'lodash/flatten'

export async function getAllCourses({schedules, fabrications}) {
	let promises = flatten(
		Object.values(schedules).map(schedule => {
			let term = parseInt(`${schedule.year}${schedule.semester}`)
			return schedule.clbids.map(clbid =>
				getCourse({clbid, term}, fabrications),
			)
		}),
	)

	return await Promise.all(promises)
}
