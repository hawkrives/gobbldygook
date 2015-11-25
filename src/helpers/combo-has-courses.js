import takeWhile from 'lodash/array/takeWhile'
import queryCourses from '../helpers/query-courses'

export default function comboHasAllCourses(courses, combinationOfClasses) {
	const these = takeWhile(courses, course =>
			queryCourses(course, combinationOfClasses).length >= 1)

	return these.length === courses.length
}
