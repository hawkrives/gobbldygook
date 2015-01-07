/**
 * Builds a department string from a course.
 *
 * @param {Course} course
 * @returns {String}
 */

function buildDept(course) {
	return course.depts.join('/')
}

export default buildDept
