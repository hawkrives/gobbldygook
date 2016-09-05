import {normalizeDepartment} from '../stolaf-courses'

/**
 * Builds a department string from a course.
 *
 *    AS/RE => ASIAN/REL
 *    ASIAN/REL => ASIAN/REL
 *    ASIAN/RELIGION => ASIAN/REL
 *
 * @param {Course} course - the course
 * @returns {String} - the department string
 */
export default function buildDept(course): string {
	let departments = course.depts

	departments = departments.map(dept => {
		dept = dept.toLowerCase()
		return normalizeDepartment(dept) || dept.toUpperCase()
	})

	return departments.join('/')
}
