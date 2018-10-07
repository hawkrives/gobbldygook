// @flow

import sumBy from 'lodash/sumBy'

// Sums up the number of credits offered by a set of courses
// TODO(rives): fix this to not be "Object"
export function countCredits(courses: Array<Object> = []) {
	return sumBy(courses, c => (c ? c.credits : 0)) || 0
}
