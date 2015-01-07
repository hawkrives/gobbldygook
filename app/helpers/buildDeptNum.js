import buildDept from './buildDept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course
 * @returns {String}
 */
function buildDeptNum(course) {
	let dept = buildDept(course)
	let num = course.num
	return `${dept} ${num}`
}

export default buildDeptNum
