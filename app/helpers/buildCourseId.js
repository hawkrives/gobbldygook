/**
 * Builds a course ID from the deptnum, term offered, and clbid.
 *
 * @param {Course} course
 * @returns {String}
 */
let buildCourseId = (course) => {
	// ASIAN/REL_282_98312
	return `${course.deptnum.replace(' ', '_')}_${course.clbid}`
}

export default buildCourseId
