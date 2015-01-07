import buildDept from './buildDept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course
 * @returns {String}
 */
function buildDeptNum(course, includeSection=false) {
	let dept = buildDept(course)
	let num = course.num

	if (includeSection) {
		let sect = course.sect
		return `${dept} ${num}${sect}`
	}

	return `${dept} ${num}`
}

export default buildDeptNum
