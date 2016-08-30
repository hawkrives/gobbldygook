import takeWhile from 'lodash/takeWhile'
import queryCourses from 'gb-search-queries/query-courses'

export default function comboHasAllCourses(courses, combinationOfClasses) {
	const these = takeWhile(courses, course =>
			queryCourses(course, combinationOfClasses).length >= 1)

	return these.length === courses.length
}
