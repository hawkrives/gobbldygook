import mapValues from 'lodash/mapValues'
import props from 'p-props'
import {getCourse} from './get-courses'
import {alterCourse} from './alter-course-for-evaluation'

export async function fulfillFulfillments(
	student,
	{store = Object.create(null)},
) {
	let promises = mapValues(
		student.fulfillments,
		clbid => store[clbid] || getCourse({clbid}, student.fabrications),
	)

	let result = await props(promises)

	return mapValues(result, r => ({
		$type: 'course',
		$course: alterCourse(r),
		_isFulfillment: true,
	}))
}
