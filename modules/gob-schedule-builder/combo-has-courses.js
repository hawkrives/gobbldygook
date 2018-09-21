// @flow

import takeWhile from 'lodash/takeWhile'
import {queryCourses} from '@gob/search-queries'

import type {Course} from '@gob/types'

export function comboHasCourses(
	courses: Array<Course>,
	combinationOfClasses: Array<Course>,
) {
	const these = takeWhile(
		courses,
		course => queryCourses(course, combinationOfClasses).length >= 1,
	)

	return these.length === courses.length
}
