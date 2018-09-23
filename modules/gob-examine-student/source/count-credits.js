// @flow

import sumBy from 'lodash/sumBy'
import type {Course} from '@gob/types'

// Sums up the number of credits offered by a set of courses
export function countCredits(courses: Array<Course> = []) {
	return sumBy(courses, c => c.credits) || 0
}
