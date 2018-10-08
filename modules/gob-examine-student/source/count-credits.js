// @flow

import sumBy from 'lodash/sumBy'
import {type Course as CourseType} from '@gob/types'

// Sums up the number of credits offered by a set of courses
export function countCredits(courses: Array<CourseType> = []) {
	return sumBy(courses, c => (c ? c.credits : 0)) || 0
}
