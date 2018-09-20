// @flow

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @param {Boolean} includeSection - whether or not to include the section in the result
 * @returns {String} - the deptnum string
 */
export function buildDeptNum(
	course: {
		department: string,
		number: number,
		section?: string,
	},
	includeSection?: boolean = false,
) {
	let {department, number, section = ''} = course

	const deptnumString = `${department} ${number}`

	if (includeSection) {
		return `${deptnumString}${section}`
	}

	return deptnumString
}
