import Bluebird from 'bluebird'
import mapValues from 'lodash/mapValues'
import {getCourse} from './get-courses'
import alterCourse from './alter-course-for-evaluation'

export default function embedActiveStudentCourses(student, {cache=[]}) {
	let promises = mapValues(student.fulfillments,
		clbid => cache[clbid] || getCourse({clbid}, student.fabrications))
	return Bluebird.props(promises)
		.then(result => mapValues(result, r => {
			return {$type: 'course', $course: alterCourse(r), _isFulfillment: true}
		}))
}
