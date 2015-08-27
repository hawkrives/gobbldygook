import buildDept from './build-dept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @returns {String} - the deptnum string
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
