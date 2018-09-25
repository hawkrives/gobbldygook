import {getCourse} from './get-course'
import flatten from 'lodash/flatten'
import present from 'present'

export async function getAllCourses({schedules, fabrications}) {
	let promises = flatten(
		Object.values(schedules).map(schedule => {
			let term = parseInt(`${schedule.year}${schedule.semester}`)
			return schedule.clbids.map(clbid =>
				getCourse({clbid, term}, fabrications),
			)
		}),
	)

	// let start = present()
	let data = await Promise.all(promises)
	// let end = present()
	// console.log('fetched', promises.length, 'courses in', end - start, 'ms')
	return data
}
