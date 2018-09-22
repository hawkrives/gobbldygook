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
		+department: string,
		+number: number,
		+section?: string,
		+type?: string,
	},
	includeSection?: boolean = false,
) {
	let {department, number, section = '', type = null} = course

	const deptnumString = `${department} ${number}`

	if (includeSection) {
		if (type && type === 'Lab') {
			return `${deptnumString}${section}[L]`
		}
		return `${deptnumString}${section}`
	}

	if (type && type === 'Lab') {
		return `${deptnumString}[L]`
	}

	return deptnumString
}
