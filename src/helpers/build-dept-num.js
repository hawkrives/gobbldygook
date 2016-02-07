import buildDept from './build-dept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @returns {String} - the deptnum string
 */
export default function buildDeptNum(course, includeSection=false) {
	let dept = buildDept(course)
	let num = course.num

	if (includeSection) {
		return `${dept} ${num}${course.sect}`
	}

	return `${dept} ${num}`
}
