import filter from 'lodash/collection/filter'
import uniq from 'lodash/array/uniq'
import all from 'lodash/collection/all'
import size from 'lodash/collection/size'

import acrossAtLeastTwoDepartments from './across-at-least-two-departments'
import countGeneds from './count-geneds'
import hasGenEd from './has-gened'

/**
 * Checks that a list of courses spans at least two departments, but also
 * checks to make sure that it's not one course that's spanning both.
 *
 * @param {Array.<Course>} courses - the list of courses.
 * @param {Array.<String>} geneds - The list of geneds.
 * @returns {Boolean} - if the courses space both departments and geneds
 */
function checkThatCoursesSpanDepartmentsAndGeneds(courses, geneds, {courseCount, gened}={}) {
	courseCount = courseCount || 2
	gened = gened || geneds[0]

	const coursesOne = filter(courses, hasGenEd(geneds[0]))
	const coursesTwo = geneds[1] ? filter(courses, hasGenEd(geneds[1])) : []

	const allCourses = uniq(coursesOne.concat(coursesTwo), 'crsid')
	const coversTwoDepartments = acrossAtLeastTwoDepartments(allCourses)

	return all([
		countGeneds(courses, gened) >= 1,
		size(allCourses) >= courseCount,
		coversTwoDepartments,
	])
}

export default checkThatCoursesSpanDepartmentsAndGeneds
