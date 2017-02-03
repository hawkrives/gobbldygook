// @flow
import { deptNumRegex } from './dept-num-regex'

/**
 * Splits a deptnum string (like "AS/RE 230A") into its components,
 * like {departments: ['AS', 'RE'], number: 230, section: 'A'}.
 *
 * @param {String} deptNumString - the deptnum to split
 * @param {Boolean} includeSection - include the section in the result?
 * @returns {Object} - the result
 */
export function splitDeptNum(deptNumString: string, includeSection?: boolean=false) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {departments: ['AS', 'RE'], number: 230}
	let matches = deptNumRegex.exec(deptNumString)

	let deptNum: {
		departments: string[],
		number: number,
		section?: string,
	} = {
		departments: matches[1].indexOf('/') !== -1 ? [matches[2], matches[3]] : [matches[1]],
		number: parseInt(matches[4], 10),
	}

	if (includeSection && matches.length >= 6 && matches[5]) {
		deptNum.section = matches[5]
	}

	return deptNum
}
