// @flow

import {deptNumRegex} from './dept-num-regex'

export type DeptNum = {
	departments: Array<string>,
	number: number,
	section?: string,
}

/**
 * Splits a deptnum string (like "AS/RE 230A") into its components,
 * like {departments: ['AS', 'RE'], number: 230, section: 'A'}.
 *
 * @param {String} deptNumString - the deptnum to split
 * @param {Boolean} includeSection - include the section in the result?
 * @returns {Object} - the result
 */
export function splitDeptNum(
	deptNumString: string,
	includeSection?: boolean = false,
): ?DeptNum {
	// "AS/RE 230.A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {departments: ['AS', 'RE'], number: 230}
	let matches = deptNumRegex.exec(deptNumString)

	if (!matches) {
		return null
	}

	let deptNum: DeptNum = {
		departments:
			matches[1].indexOf('/') !== -1
				? [matches[2], matches[3]]
				: [matches[1]],
		number: matches[4],
	}

	if (includeSection && matches.length >= 6 && matches[5]) {
		deptNum.section = matches[5]
	}

	return deptNum
}
