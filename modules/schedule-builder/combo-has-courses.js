import takeWhile from 'lodash/takeWhile'
import { queryCourses } from '../search-queries'

export function comboHasCourses(courses, combinationOfClasses) {
	const these = takeWhile(courses, course =>
			queryCourses(course, combinationOfClasses).length >= 1)

	return these.length === courses.length
}
