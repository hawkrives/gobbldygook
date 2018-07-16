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
		subject: string,
		number: string,
		section?: string,
		deptnum?: string,
	},
	includeSection?: boolean = false,
) {
	let {subject, number, section = '', deptnum} = course

	const dept = subject
	const deptnumString = deptnum || `${dept} ${number}`

	if (includeSection) {
		return `${deptnumString}.${section}`
	}

	return deptnumString
}
