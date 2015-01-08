import {filter, uniq, all, size, isUndefined} from 'lodash'
import acrossAtLeastTwoDepartments from './acrossAtLeastTwoDepartments'
import countGeneds from './countGeneds'
import hasGenEd from './hasGenEd'

/**
 * Checks that a list of courses spans at least two departments, but also
 * checks to make sure that it's not one course that's spanning both.
 *
 * @param {Array.<Course>} courses - the list of courses.
 * @param {Array.<String>} geneds - The list of geneds.
 * @param {Object} options
 *   - options.courseCount defaults to 2;
 *   - options.gened is the gened we're looking for.
 * @returns {Boolean}
 */
function checkThatCoursesSpanDepartmentsAndGeneds(courses, geneds, options={}) {
	if (isUndefined(options.courseCount))
		options.courseCount = 2
	if (isUndefined(options.gened))
		options.gened = geneds[0]

	const coursesOne = filter(courses, hasGenEd(geneds[0]))
	const coursesTwo = geneds[1] ? filter(courses, hasGenEd(geneds[1])) : []

	const allCourses = uniq(coursesOne.concat(coursesTwo), 'crsid')
	const coversTwoDepartments = acrossAtLeastTwoDepartments(allCourses)

	return all([
		countGeneds(courses, options.gened) >= 1,
		size(allCourses) >= options.courseCount,
		coversTwoDepartments,
	])
}

export default checkThatCoursesSpanDepartmentsAndGeneds
