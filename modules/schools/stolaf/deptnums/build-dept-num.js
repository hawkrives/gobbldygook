import {buildDept} from './build-dept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @param {Boolean} includeSection - whether or not to include the section in the result
 * @returns {String} - the deptnum string
 */
export function buildDeptNum(course, includeSection=false) {
	let dept = buildDept(course)
	let number = course.number

	if (includeSection) {
		return `${dept} ${number}${course.sect}`
	}

	return `${dept} ${number}`
}
