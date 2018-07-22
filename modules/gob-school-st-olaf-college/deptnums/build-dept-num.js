// @flow

import {buildDeptString} from './build-dept'

/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @param {Boolean} includeSection - whether or not to include the section in the result
 * @returns {String} - the deptnum string
 */
export function buildDeptNum(
	course: {
		departments: string[],
		number: number,
		section?: string,
		deptnum?: string,
	},
	includeSection?: boolean = false,
) {
	let {departments, number, section = '', deptnum} = course

	const dept = buildDeptString(departments)
	const deptnumString = deptnum || `${dept} ${number}`

	if (includeSection) {
		return `${deptnumString}${section}`
	}

	return deptnumString
}
